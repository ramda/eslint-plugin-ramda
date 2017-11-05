# eslint-plugin-ramda

Ramda refactoring and simplification

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-ramda`:

```
$ npm install eslint-plugin-ramda --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-ramda` globally.

## Usage

Add `ramda` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "ramda"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "ramda/rule-name": 2
    }
}
```

## Supported Rules

* Fill in provided rules here





