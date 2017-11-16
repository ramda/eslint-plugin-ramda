'use strict';
const R = require('ramda');

const isName = name => R.either(
    R.whereEq({
        type: 'Identifier',
        name
    }),
    R.where({
        type: R.equals('MemberExpression'),
        object: R.whereEq({ type: 'Identifier', name: 'R' }),
        property: R.whereEq({ type: 'Identifier', name })
    })
);

// :: { name :: String, arguments :: [Node] -> Boolean }
// -> Object
// -> Boolean
const isCalling = pattern => R.where({
    type: R.equals('CallExpression'),
    callee: isName(pattern.name),
    arguments: pattern.arguments || R.T
});

exports.isName = isName;
exports.isCalling = isCalling;
