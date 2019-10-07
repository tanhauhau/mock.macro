import _faker from 'faker';

async function foo(): {
  id: number,
  name: string,
  parent: {
    id: number,
    name: string,
  },
} {
  return {
    id: _faker.random.number(),
    name: _faker.random.word(),
    parent: {
      id: _faker.random.number(),
      name: _faker.random.word()
    }
  };
}
