'use strict';

const create = context => ({
    CallExpression(node) {
        if (node.callee.type === 'Identifier'
            && node.callee.name === 'unless'
            && node.arguments.length > 0
            && node.arguments[0].type === 'CallExpression'
            && node.arguments[0].callee.type === 'Identifier'
            && node.arguments[0].callee.name === 'complement') {
            context.report({
                node,
                message: '`unless(complement(_))` should be simplified to `when(_)`'
            });
        }
    }
});

module.exports = {
    create,
    meta: {
        docs: {
            description: '`unless` simplifications, like `unless(complement(_))` to `when(_)`',
            recommended: 'error'
        }
    }
};
