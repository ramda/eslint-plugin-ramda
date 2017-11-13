# eslint-plugin-ramda

[![Build Status](https://api.travis-ci.org/rung-tools/eslint-plugin-ramda.svg?branch=master)](https://travis-ci.org/rung-tools/eslint-plugin-ramda)
[![Code Coverage](https://codecov.io/gh/rung-tools/eslint-plugin-ramda/branch/master/graph/badge.svg)](https://codecov.io/gh/rung-tools/eslint-plugin-ramda)

ESLint rules for pragmatic Ramda usage, refactoring and simplification

## Installation

```
$ npm install --save-dev eslint eslint-plugin-ramda
```

## Usage

Configure it in `package.json`.

```json
{
  "name": "my-awesome-project",
  "eslintConfig": {
    "env": {
      "es6": true
    },
    "plugins": [
      "ramda"
    ],
    "rules": {
      "ramda/complement-simplification": "error",
      "ramda/cond-simplification": "error",
      "ramda/filter-simplification": "error",
      "ramda/if-else-simplification": "error",
      "ramda/map-simplification": "error",
      "ramda/merge-simplification": "error",
      "ramda/no-redundant-and": "error",
      "ramda/no-redundant-not": "error",
      "ramda/no-redundant-or": "error",
      "ramda/prop-satisfies-simplification": "error",
      "ramda/reduce-simplification": "error",
      "ramda/reject-simplification": "error",
      "ramda/set-simplification": "error",
      "ramda/unless-simplification": "error",
      "ramda/when-simplification": "error"
    }
  }
}
```

## Rules

- `complement-simplification` - Forbids confusing `complement`, suggesting a better one
- `cond-simplification` - Forbids using `cond` when `ifElse`, `either` or `both` fits
- `filter-simplification` - Forbids using negated `filter` and suggests `reject`
- `if-else-simplification` - Suggests `when` and `unless` when it is possible to replace
- `map-simplification` - Forbids `map(prop(_))` and suggests `pluck`
- `merge-simplification` - Forbids `merge` when `assoc` fits
- `no-redundant-and` - Forbids `and` with 2 parameters in favor of `&&`
- `no-redundant-not` - Forbids `not` with 1 parameter in favor of `!`
- `no-redundant-or` - Forbids `or` with 2 parameters in favor of `||`
- `prop-satisfies-simplification` - Detects when can replace `propSatisfies` by more simple functions
- `reduce-simplification` - Detects when can replace `reduce` by `sum` or `product`
- `reject-simplification` - Forbids using negated `reject` and suggests `filter`
- `set-simplification` - Forbids using `set` with `lensProp` in favor of `assoc`
- `unless-simplification` - Forbids using negated `unless` and suggests `when`
- `when-simplification` - Forbids using negated `when` and suggests `unless`

## Recommended configuration

This plugin exports a [`recommended` configuration](index.js) that enforces good practices.

To enable this configuration, use the `extends` property in your `package.json`.

```json
{
  "name": "my-awesome-project",
  "eslintConfig": {
    "plugins": [
      "ramda"
    ],
    "extends": "plugin:ramda/recommended"
  }
}
```

See [ESLint documentation](http://eslint.org/docs/user-guide/configuring#extending-configuration-files)
for more information about extending configuration files.

MIT © [Rung Tools](https://github.com/rung-tools)
