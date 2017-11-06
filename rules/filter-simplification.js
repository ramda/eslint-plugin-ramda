'use strict';

const create = context => ({
    CallExpression(node) {
        if (node.callee.type === 'Identifier'
            && node.callee.name === 'filter'
            && node.arguments.length > 0
            && node.arguments[0].type === 'CallExpression'
            && node.arguments[0].callee.type === 'Identifier'
            && node.arguments[0].callee.name === 'complement') {
            context.report({
                node,
                message: '`filter(complement(_))` should be simplified to `reject(_)`'
            });
        }
    }
});

module.exports = {
    create,
    meta: {
        docs: {
            description: '`filter` simplifications, like `filter(complement(_))` to `reject(_)`',
            recommended: 'error'
        }
    }
};
