// @flow
import type { MockResponse } from 'mock.macro';

async function foo(): MockResponse<{
  id: number,
  name: string,
  parent: {
    id: number,
    name: string,
  },
}> {}
