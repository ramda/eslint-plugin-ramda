'use strict';
const R = require('ramda');
const isCalling = require('../ast-helper').isCalling;

const create = context => ({
    CallExpression(node) {
        const match = isCalling({
            name: 'either',
            arguments: R.ifElse(
                R.propSatisfies(R.lt(1), 'length'),
                R.where({
                    0: isCalling({ name: 'complement' }),
                    1: isCalling({ name: 'complement' })
                }),
                R.F
            )
        });

        if (match(node)) {
            context.report({
                node,
                message: '`either(complement(_), complement(_))` should be simplified to `complement(both(_, _))`'
            });
        }
    }
});

module.exports = {
    create,
    meta: {
        docs: {
            description: '`either` simplifications, like replacing negation by `both`',
            recommended: 'error'
        }
    }
};
