'use strict';

const create = context => ({
    CallExpression(node) {
        if (node.callee.type === 'Identifier'
            && node.callee.name === 'cond'
            && node.arguments.length > 0
            && node.arguments[0].type === 'ArrayExpression'
            && node.arguments[0].elements.length <= 2) {
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
