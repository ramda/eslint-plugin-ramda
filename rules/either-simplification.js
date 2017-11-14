'use strict';

const create = context => ({
    CallExpression(node) {
        if (node.callee.type === 'Identifier'
            && node.callee.name === 'either'
            && node.arguments.length > 1
            && node.arguments[0].type === 'CallExpression'
            && node.arguments[1].type === 'CallExpression'
            && node.arguments[0].callee.type === 'Identifier'
            && node.arguments[1].callee.type === 'Identifier'
            && node.arguments[0].callee.name === 'complement'
            && node.arguments[1].callee.name === 'complement'
            && node.arguments) {
            context.report({
                node,
                message: '`either(complement(_), complement(_))` should be simplified to `complement(both(_, _))`'
            });
        }
    }
});

module.exports = {
    create,
    meta: {
        docs: {
            description: '`either` simplifications, like replacing negation by `both`',
            recommended: 'error'
        }
    }
};
