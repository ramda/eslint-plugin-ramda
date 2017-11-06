'use strict';

const create = context => ({
    CallExpression(node) {
        if (node.callee.type === 'Identifier'
            && node.callee.name === 'propSatisfies'
            && node.arguments.length > 0
            && node.arguments[0].type === 'CallExpression'
            && node.arguments[0].callee.type === 'Identifier'
            && node.arguments[0].callee.name === 'equals') {
            context.report({
                node,
                message: '`propSatisfies(equals(_))` should be simplified to `propEq(_)`'
            });
        }
    }
});

module.exports = {
    create,
    meta: {
        docs: {
            description: '`propSatisfies` simplifications, like `propSatisfies(equals(_))` to `propEq(_)`',
            recommended: 'error'
        }
    }
};
