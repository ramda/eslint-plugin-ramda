'use strict';

const create = context => ({
    CallExpression(node) {
        if (node.callee.type === 'Identifier'
            && node.callee.name === 'not'
            && node.arguments.length > 0) {
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
