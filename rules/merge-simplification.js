'use strict';
const R = require('ramda');
const ast = require('../ast-helper');

const isCalling = ast.isCalling;
const isName = ast.isName;

const create = context => ({
    CallExpression(node) {
        const match = isCalling({
            name: 'merge',
            arguments: R.both(
                R.propSatisfies(R.lte(2), 'length'),
                R.where({
                    0: isName('__'),
                    1: R.where({
                        type: R.equals('ObjectExpression'),
                        properties: R.propEq('length', 1)
                    })
                })
            )
        });

        if (match(node)) {
            context.report({
                node,
                message: '`merge(__, { key: value })` should be simplified to `assoc(key, value)`'
            });
        }
    }
});

module.exports = {
    create,
    meta: {
        docs: {
            description: '`merge` simplifications, like suggesting assoc for one element',
            recommended: 'error'
        }
    }
};
