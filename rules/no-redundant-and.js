'use strict';
const R = require('ramda');
const isCalling = require('../ast-helper').isCalling;

const create = context => ({
    CallExpression(node) {
        const match = isCalling({
            name: 'and',
            arity: R.propSatisfies(R.lte(2), 'length')
        });

        if (match(node)) {
            context.report({
                node,
                message: 'No redundant use of `and`. Use `&&` in this case'
            });
        }
    }
});

module.exports = {
    create,
    meta: {
        docs: {
            description: 'Forbid using `and` in full call',
            recommended: 'error'
        }
    }
};
