const { createMacro, MacroError } = require('babel-plugin-macros');

module.exports = createMacro(mockMacro);

function mockMacro({ references, state, babel }) {
  const { t, template } = babel;

  if (references.mock.length > 0) {
    state.file.path.unshiftContainer(
      'body',
      template('const faker = require("faker")')()
    );
  }
  references.mock.forEach(reference => {
    assert(
      reference.parent.type === 'GenericTypeAnnotation',
      'Must use as a generic type, eg: mock<{ a: number >}'
    );
    const functionDeclaration = reference.getFunctionParent();
    assert(
      functionDeclaration &&
        functionDeclaration.get('returnType').isAncestor(reference),
      'Must use as a return type of a function, eg: function foo(): mock<{ a: number }> { }'
    );
    const typeDef = reference.parentPath.get('typeParameters.params.0').node;
    functionDeclaration.get('returnType.typeAnnotation').replaceWith(typeDef);

    functionDeclaration
      .get('body')
      .unshiftContainer('body', template('return ' + generateCode(typeDef))());
  });
}

function assert(test, message) {
  if (!test) {
    throw new MacroError(message);
  }
}

function generateCode(node) {
  switch (node.type) {
    case 'ObjectTypeAnnotation':
      return (
        '{' +
        node.properties
          .map(
            property =>
              generateCode(property.key) + ':' + generateCode(property.value)
          )
          .join(',') +
        '}'
      );
    case 'NumberTypeAnnotation':
      return 'faker.random.number()';
    case 'StringTypeAnnotation':
      return 'faker.random.word()';
    case 'BooleanTypeAnnotation':
      return 'faker.random.boolean()';
    case 'Identifier':
      return node.name;
    default:
      throw MacroError(`Unknown type definition: ${node.type}`);
  }
}
