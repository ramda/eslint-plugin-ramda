'use strict';
const R = require('ramda');

// :: Node -> String
const getName = R.ifElse(
    R.propEq('type', 'MemberExpression'),
    R.path(['property', 'name']),
    R.prop('name')
);

// :: String -> Node -> Boolean
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
exports.getName = getName;
