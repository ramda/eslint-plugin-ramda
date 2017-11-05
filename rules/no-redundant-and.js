'use strict';

const create = context => ({
    CallExpression(node) {
        if (node.callee.type === 'Identifier'
            && node.callee.name === 'and'
            && node.arguments.length >= 2) {
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
