'use strict';

const create = context => ({
    CallExpression(node) {
        if (node.callee.type === 'Identifier'
            && node.callee.name === 'merge'
            && node.arguments.length >= 2
            && node.arguments[0].type === 'Identifier'
            && node.arguments[0].name === '__'
            && node.arguments[1].type === 'ObjectExpression'
            && node.arguments[1].properties.length === 1) {
            context.report({
                node,
                message: '`merge(__, { key: value })` should be simplified to `assoc(key, value)`'
            });
        }
    }
});

module.exports = {
    create,
    meta: {
        docs: {
            description: '`merge` simplifications, like suggesting assoc for one element',
            recommended: 'error'
        }
    }
};
