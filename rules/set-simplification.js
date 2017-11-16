'use strict';
const R = require('ramda');
const isCalling = require('../ast-helper').isCalling;

const create = context => ({
    CallExpression(node) {
        const match = isCalling({
            name: 'set',
            arguments: R.both(
                R.propSatisfies(R.lt(0), 'length'),
                R.propSatisfies(isCalling({
                    name: 'lensProp'
                }), 0)
            )
        });

        if (match(node)) {
            context.report({
                node,
                message: '`set(lensProp(_))` should be simplified to `assoc(_)`'
            });
        }
    }
});

module.exports = {
    create,
    meta: {
        docs: {
            description: '`set` simplifications, like `set(lensProp(_))` to `assoc(_)`',
            recommended: 'error'
        }
    }
};
