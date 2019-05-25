# Auto Symbol Description [![Build Status](https://travis-ci.org/kentor/babel-plugin-auto-symbol-description.svg)](https://travis-ci.org/kentor/babel-plugin-auto-symbol-description) [![npm](https://img.shields.io/npm/v/babel-plugin-auto-symbol-description.svg)](https://www.npmjs.com/package/babel-plugin-auto-symbol-description)

A [Babel][b] plugin to automatically set [Symbol][s] descriptions.

**Note:** Babel 7 is supported in version 2.0+.
**Note:** Babel 6 is supported in version 1.0+. Keep using version 0.0.1
for Babel 5 support.

## Use Cases

### Redux
Very useful with Redux if you use Symbols for action types:

In:

```js
// TodoActions.js
export const CREATE = Symbol();
export const CREATE_SUCCESS = Symbol();
export const CREATE_FAILURE = Symbol();
```

Out (something like this):

```js
// TodoActions.js
export const CREATE = Symbol('TodoActions.CREATE');
export const CREATE_SUCCESS = Symbol('TodoActions.CREATE_SUCCESS');
export const CREATE_FAILURE = Symbol('TodoActions.CREATE_FAILURE');
```

Then use these constants in a reducer:

```js
// TodoReducer.js
import * as TodoActions from '../actions/TodoActions';

export function TodoReducer(state, action) {
  switch (action) {
  case TodoActions.CREATE:
    // Handle create
    break;
  case TodoActions.CREATE_SUCCESS:
    // Handle create success
    break;
  case TodoActions.CREATE_FAILURE:
    // Handle create failure
    break;
  default:
    return state;
  }
}
```

Symbol descriptions are only useful for debugging, so idealy you would only
include this transformation in development.

## Installation

```
npm install -D babel-plugin-auto-symbol-description
```

.babelrc:
```
{
  "env": {
    "development": {
      "plugins": ["auto-symbol-description"]
    }
  }
}
```

## Notes

This plugin won't transform any `Symbol` calls with an argument, and it only
works for assignments and variable declarations for now. Let me know if there is
demand for the transformation when setting an object property or any other use
cases.

[b]: http://babeljs.io/
[s]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol
