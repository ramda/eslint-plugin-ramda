'use strict';
const R = require('ramda');
const isCalling = require('../ast-helper').isCalling;

const create = context => ({
    CallExpression(node) {
        const match = isCalling({
            name: 'propSatisfies',
            arguments: R.both(
                R.propSatisfies(R.lt(0), 'length'),
                R.propSatisfies(isCalling({
                    name: 'equals'
                }), 0)
            )
        });
        if (match(node)) {
            context.report({
                node,
                message: '`propSatisfies(equals(_))` should be simplified to `propEq(_)`'
            });
        }
    }
});

module.exports = {
    create,
    meta: {
        docs: {
            description: '`propSatisfies` simplifications, like `propSatisfies(equals(_))` to `propEq(_)`',
            recommended: 'error'
        }
    }
};
