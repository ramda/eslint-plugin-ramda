'use strict';

const create = context => ({
    CallExpression(node) {
        if (node.callee.type === 'Identifier'
            && node.callee.name === 'reduce'
            && node.arguments.length >= 0
            && node.arguments[0].type === 'Identifier'
            && node.arguments[0].name === 'add') {
            context.report({
                node,
                message: '`reduce(add)` should be simplified to `sum`'
            });
        }
    }
});

module.exports = {
    create,
    meta: {
        docs: {
            description: 'Suggest simplifying `reduce(add)` to `sum`',
            recommended: 'error'
        }
    }
};
