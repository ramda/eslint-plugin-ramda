'use strict';
const R = require('ramda');
const isCalling = require('../ast-helper').isCalling;

const create = context => ({
    CallExpression(node) {
        const match = isCalling({
            name: 'filter',
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
                message: '`filter(complement(_))` should be simplified to `reject(_)`'
            });
        }
    }
});

module.exports = {
    create,
    meta: {
        docs: {
            description: '`filter` simplifications, like `filter(complement(_))` to `reject(_)`',
            recommended: 'error'
        }
    }
};
