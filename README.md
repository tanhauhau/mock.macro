# mock.macro

> Welcome! This project is mainly used to demonstrate [how to create a babel macro](https://lihautan.com/babel-macros/). Of course if you think this project may help you or if you have idea to make it better, [let's talk about it](https://twitter.com/lihautan)!

this is a macro (read about [babel-plugin-macros](https://github.com/kentcdodds/babel-plugin-macros) if you are not familiar) to generate mock data using type system.

## Example Usage

```js
// @flow
import type { mock } from 'mock.macro';

async function foo(): mock<{ id: number, name: string }> {
  // TODO: implement
  return fetch('api/not/ready');
}

// somewhere else
const response = await foo();
console.log(response); 
/* { id: 4916, name: 'Sausages' } */
```

## Prior Art

[Manta Style](https://github.com/Cryrivers/manta-style) - Mock server that converts type definitions into mock data