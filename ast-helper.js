'use strict';
const R = require('ramda');

// :: { name :: String, arity :: Number -> Boolean }
// -> Object
// -> Boolean
exports.isCalling = pattern => R.where({
    type: R.equals('CallExpression'),
    callee: R.either(
        R.whereEq({
            type: 'Identifier',
            name: pattern.name
        }),
        R.where({
            type: R.equals('MemberExpression'),
            object: R.whereEq({ type: 'Identifier', name: 'R' }),
            property: R.whereEq({ type: 'Identifier', name: pattern.name })
        })
    ),
    arguments: pattern.arity
});
