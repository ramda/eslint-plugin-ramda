'use strict';

const create = context => ({
    CallExpression(node) {
        if (node.callee.type === 'Identifier'
            && node.callee.name === 'map'
            && node.arguments.length > 0
            && node.arguments[0].type === 'CallExpression'
            && node.arguments[0].callee.type === 'Identifier'
            && node.arguments[0].callee.name === 'prop') {
            context.report({
                node,
                message: '`map(prop(_))` should be simplified to `pluck(_)`'
            });
        }
    }
});

module.exports = {
    create,
    meta: {
        docs: {
            description: '`map` simplifications, like `map(prop(_))` to `pluck(_)`',
            recommended: 'error'
        }
    }
};
