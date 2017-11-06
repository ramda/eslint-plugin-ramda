'use strict';

const create = context => ({
    CallExpression(node) {
        if (node.callee.type === 'Identifier'
            && node.callee.name === 'reduce'
            && node.arguments.length >= 0
            && node.arguments[0].type === 'Identifier') {
            const callee = node.arguments[0].name;
            const reporters = {
                'add': 'sum',
                'multiply': 'product'
            }

            if (reporters[callee]) {
                context.report({
                    node,
                    message: '`reduce(' + callee + ')` should be simplified to `' + reporters[callee] + '`'
                });
            }
        }
    }
});

module.exports = {
    create,
    meta: {
        docs: {
            description: '`reduce` simplifications, like `reduce(add)` to `sum`',
            recommended: 'error'
        }
    }
};
