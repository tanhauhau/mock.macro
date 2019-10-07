import _faker from 'faker';

async function foo(): {
  id: number,
  name: string,
} {
  return {
    id: _faker.random.number(),
    name: _faker.random.word()
  };
}
