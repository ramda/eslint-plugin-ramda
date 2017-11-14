'use strict';

const create = context => ({
    CallExpression(node) {
        if (node.callee.type === 'Identifier'
            && node.callee.name === 'anyPass'
            && node.arguments.length > 0
            && node.arguments[0].type === 'ArrayExpression') {
            const [{ elements }] = node.arguments
            const negated = elements
                .filter(element =>
                    element.type === 'CallExpression'
                    && element.callee.type === 'Identifier'
                    && element.callee.name === 'complement'
                );
            if (elements.length === negated.length) {
                context.report({
                    node,
                    message: '`anyPass` containing only complement functions should be a complement of `allPass`'
                });
            }
        }
    }
});

module.exports = {
    create,
    meta: {
        docs: {
            description: 'Detects when `anyPass` with complements can be replaced by complement of `allPass`',
            recommended: 'error'
        }
    }
};
