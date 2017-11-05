'use strict';

const create = context => ({
    CallExpression(node) {
        if (node.callee.type === 'Identifier'
            && node.callee.name === 'or'
            && node.arguments.length >= 2) {
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
