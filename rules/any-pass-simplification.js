'use strict';
const R = require('ramda');
const isCalling = require('../ast-helper').isCalling;

const create = context => ({
    CallExpression(node) {
        const match = isCalling({
            name: 'anyPass',
            arguments: R.both(
                R.propSatisfies(R.lt(0), 'length'),
                R.where({
                    0: R.both(
                        R.propEq('type', 'ArrayExpression'),
                        R.propSatisfies(R.all(isCalling({ name: 'complement' })), 'elements')
                    )
                })
            )
        });

        if (match(node)) {
            context.report({
                node,
                message: '`anyPass` containing only complement functions should be a complement of `allPass`'
            });
        }
    }
});

module.exports = {
    create,
    meta: {
        docs: {
            description: 'Detects when `anyPass` with complements can be replaced by complement of `allPass`',
            recommended: 'error'
        }
    }
};
