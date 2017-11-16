'use strict';
const R = require('ramda');
const isCalling = require('../ast-helper').isCalling;

const create = context => ({
    CallExpression(node) {
        const match = isCalling({
            name: 'map',
            arguments: R.both(
                R.propSatisfies(R.lt(0), 'length'),
                R.propSatisfies(isCalling({
                    name: 'prop'
                }), 0)
            )
        });

        if (match(node)) {
            context.report({
                node,
                message: '`map(prop(_))` should be simplified to `pluck(_)`'
            });
        }
    }
});

module.exports = {
    create,
    meta: {
        docs: {
            description: '`map` simplifications, like `map(prop(_))` to `pluck(_)`',
            recommended: 'error'
        }
    }
};
