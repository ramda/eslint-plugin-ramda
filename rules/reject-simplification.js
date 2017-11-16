'use strict';
const R = require('ramda');
const isCalling = require('../ast-helper').isCalling;

const create = context => ({
    CallExpression(node) {
        const match = isCalling({
            name: 'reject',
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
                message: '`reject(complement(_))` should be simplified to `filter(_)`'
            });
        }
    }
});

module.exports = {
    create,
    meta: {
        docs: {
            description: '`reject` simplifications, like `reject(complement(_))` to `filter(_)`',
            recommended: 'error'
        }
    }
};
