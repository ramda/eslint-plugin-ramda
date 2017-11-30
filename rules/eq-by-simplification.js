'use strict';
const R = require('ramda');
const isCalling = require('../ast-helper').isCalling;

const create = context => ({
    CallExpression(node) {
        const match = isCalling({
            name: 'eqBy',
            arguments: R.both(
                R.complement(R.isEmpty),
                R.propSatisfies(isCalling({
                    name: 'prop'
                }), 0)
            )
        });

        if (match(node)) {
            context.report({
                node,
                message: '`eqBy(prop(_))` should be simplified to `eqProps(_)`'
            });
        }
    }
});

module.exports = {
    create,
    meta: {
        docs: {
            description: 'Detects when `eqBy(prop(_))` can be replaced by `eqProps(_)`',
            recommended: 'off'
        }
    }
};
