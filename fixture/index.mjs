// @flow
import type { mock } from '../src/index.macro';

async function foo(): mock<{ id: number, name: string }> {
  // TODO: implement
  return fetch('api/not/ready');
}

function random(): mock<number> {}

console.log(random());
