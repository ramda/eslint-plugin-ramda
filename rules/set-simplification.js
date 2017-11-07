'use strict';

const create = context => ({
    CallExpression(node) {
        if (node.callee.type === 'Identifier'
            && node.callee.name === 'set'
            && node.arguments.length > 0
            && node.arguments[0].type === 'CallExpression'
            && node.arguments[0].callee.type === 'Identifier'
            && node.arguments[0].callee.name === 'lensProp') {
            context.report({
                node,
                message: '`set(lensProp(_))` should be simplified to `assoc(_)`'
            });
        }
    }
});

module.exports = {
    create,
    meta: {
        docs: {
            description: '`set` simplifications, like `set(lensProp(_))` to `assoc(_)`',
            recommended: 'error'
        }
    }
};
