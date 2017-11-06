'use strict';

const create = context => ({
    CallExpression(node) {
        if (node.callee.type === 'Identifier'
            && node.callee.name === 'when'
            && node.arguments.length > 0
            && node.arguments[0].type === 'CallExpression'
            && node.arguments[0].callee.type === 'Identifier'
            && node.arguments[0].callee.name === 'complement') {
            context.report({
                node,
                message: '`when(complement(_))` should be simplified to `unless(_)`'
            });
        }
    }
});

module.exports = {
    create,
    meta: {
        docs: {
            description: '`when` simplifications, like `when(complement(_))` to `unless(_)`',
            recommended: 'error'
        }
    }
};
