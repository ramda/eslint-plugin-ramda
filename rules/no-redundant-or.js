'use strict';
const R = require('ramda');
const isCalling = require('../ast-helper').isCalling;

const create = context => ({
    CallExpression(node) {
        const match = isCalling({
            name: 'or',
            arguments: R.propSatisfies(R.lte(2), 'length')
        });

        if (match(node)) {
            context.report({
                node,
                message: 'No redundant use of `or`. Use `||` in this case'
            });
        }
    }
});

module.exports = {
    create,
    meta: {
        docs: {
            description: 'Forbid using `or` in full call',
            recommended: 'error'
        }
    }
};
