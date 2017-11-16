'use strict';
const R = require('ramda');
const isCalling = require('../ast-helper').isCalling;

const create = context => ({
    CallExpression(node) {
        const match = isCalling({
            name: 'unless',
            arguments: R.both(
                R.propSatisfies(R.lt(0), 'length'),
                R.propSatisfies(isCalling({
                    name: 'complement'
                }), 0)
            )
        });

        if (match(node)) {
            context.report({
                node,
                message: '`unless(complement(_))` should be simplified to `when(_)`'
            });
        }
    }
});

module.exports = {
    create,
    meta: {
        docs: {
            description: '`unless` simplifications, like `unless(complement(_))` to `when(_)`',
            recommended: 'error'
        }
    }
};
