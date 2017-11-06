'use strict';

const create = context => ({
    CallExpression(node) {
        if (node.callee.type === 'Identifier'
            && node.callee.name === 'reject'
            && node.arguments.length > 0
            && node.arguments[0].type === 'CallExpression'
            && node.arguments[0].callee.type === 'Identifier'
            && node.arguments[0].callee.name === 'complement') {
            context.report({
                node,
                message: '`reject(complement(_))` should be simplified to `filter(_)`'
            });
        }
    }
});

module.exports = {
    create,
    meta: {
        docs: {
            description: '`reject` simplifications, like `reject(complement(_))` to `filter(_)`',
            recommended: 'error'
        }
    }
};
