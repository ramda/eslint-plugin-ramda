'use strict';
const R = require('ramda');
const isCalling = require('../ast-helper').isCalling;

const create = context => ({
    CallExpression(node) {
        const match = isCalling({
            name: 'when',
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
                message: '`when(complement(_))` should be simplified to `unless(_)`'
            });
        }
    }
});

module.exports = {
    create,
    meta: {
        docs: {
            description: '`when` simplifications, like `when(complement(_))` to `unless(_)`',
            recommended: 'error'
        }
    }
};
