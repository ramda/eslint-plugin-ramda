'use strict';
const R = require('ramda');
const isCalling = require('../ast-helper').isCalling;

const create = context => ({
    CallExpression(node) {
        const match = isCalling({
            name: 'cond',
            arguments: R.both(
                R.propSatisfies(R.lt(0), 'length'),
                R.where({
                    0: R.pathSatisfies(R.gte(2), ['elements', 'length'])
                })
            )
        });

        if (match(node)) {
            context.report({
                node,
                message: '`cond` with too few parameters should be `ifElse`, `either` or `both`'
            });
        }
    }
});

module.exports = {
    create,
    meta: {
        docs: {
            description: '`cond` simplification, like suggesting ifElse when too few parameters',
            recommended: 'error'
        }
    }
};
