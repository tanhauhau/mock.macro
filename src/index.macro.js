const { createMacro, MacroError } = require('babel-plugin-macros');

module.exports = createMacro(mockMacro);

function mockMacro({ references, state, babel }) {
  const { t, template } = babel;

  if (references.MockResponse && references.MockResponse.length > 0) {
    const fakerIdentifier = state.file.path.scope.generateUidIdentifier(
      'faker'
    );
    const importStatement = babel.template("import %%FAKER%% from 'faker'")({
      FAKER: fakerIdentifier,
    });
    state.file.path.unshiftContainer('body', importStatement);

    references.MockResponse.forEach(reference => {
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

      const secondParam = reference.parentPath.get('typeParameters.params.1');
      if (secondParam && secondParam.isBooleanLiteralTypeAnnotation({ value: false })) {
        return;
      }

      functionDeclaration.get('returnType.typeAnnotation').replaceWith(typeDef);

      functionDeclaration
        .get('body')
        .unshiftContainer(
          'body',
          babel.types.returnStatement(
            generateFakerCode(fakerIdentifier, typeDef)
          )
        );
    });
  }

  function assert(test, message) {
    if (!test) {
      throw new MacroError(message);
    }
  }

  function generateFakerCode(fakerIdentifier, typeDef) {
    switch (typeDef.type) {
      case 'ObjectTypeAnnotation':
        return babel.types.objectExpression(
          typeDef.properties.map(property =>
            babel.types.objectProperty(
              babel.types.identifier(property.key.name),
              generateFakerCode(fakerIdentifier, property.value)
            )
          )
        );
      case 'NumberTypeAnnotation':
        return babel.template.expression('%%FAKER%%.random.number()')({
          FAKER: fakerIdentifier,
        });
      case 'StringTypeAnnotation':
        return babel.template.expression('%%FAKER%%.random.word()')({
          FAKER: fakerIdentifier,
        });
      case 'BooleanTypeAnnotation':
        return babel.template.expression('%%FAKER%%.random.boolean()')({
          FAKER: fakerIdentifier,
        });
      default:
        throw new MacroError(`Unknown type definition: ${typeDef.type}`);
    }
  }
}
