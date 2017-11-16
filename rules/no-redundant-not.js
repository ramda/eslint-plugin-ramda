'use strict';
const R = require('ramda');
const isCalling = require('../ast-helper').isCalling;

const create = context => ({
    CallExpression(node) {
        const matches = isCalling({
            name: 'not',
            arity: R.propSatisfies(R.lt(0), 'length')
        });

        if (matches(node)) {
            context.report({
                node,
                message: 'No redundant use of `not`. Use `!` in this case'
            });
        }
    }
});

module.exports = {
    create,
    meta: {
        docs: {
            description: 'Forbid using `not` in call',
            recommended: 'error'
        }
    }
};
