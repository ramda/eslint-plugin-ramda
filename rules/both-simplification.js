'use strict';
const R = require('ramda');
const isCalling = require('../ast-helper').isCalling;

const create = context => ({
    CallExpression(node) {
        const match = isCalling({
            name: 'both',
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
                message: '`both(complement(_), complement(_))` should be simplified to `complement(either(_, _))`'
            });
        }
    }
});

module.exports = {
    create,
    meta: {
        docs: {
            description: '`both` simplifications, like replacing negation by `either`',
            recommended: 'error'
        }
    }
};
