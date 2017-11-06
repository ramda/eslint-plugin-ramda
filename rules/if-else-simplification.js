'use strict';

const create = context => ({
    CallExpression(node) {
        if (node.callee.type === 'Identifier'
            && node.callee.name === 'ifElse'
            && node.arguments.length >= 2) {
            const second = node.arguments[1].name;

            if (second === 'identity') {
                context.report({
                    node,
                    message: '`ifElse(_, identity, _)` should be simplified to `unless(_, _)`'
                });
            }

            if (node.arguments[2] && node.arguments[2].name === 'identity') {
                context.report({
                    node,
                    message: '`ifElse(_, _, identity)` should be simplified to `when(_, _)`'
                });
            }
        }
    }
});

module.exports = {
    create,
    meta: {
        docs: {
            description: '`ifElse` simplifications, like replacing by `when` or `unless`',
            recommended: 'error'
        }
    }
};
