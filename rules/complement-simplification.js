'use strict';

const create = context => ({
    CallExpression(node) {
        if (node.callee.type === 'Identifier'
            && node.callee.name === 'complement'
            && node.arguments.length > 0
            && node.arguments[0].type === 'Identifier') {
            const name = node.arguments[0].name;
            const replacementTable = {
                or: 'and',
                and: 'or',
                T: 'F',
                F: 'T'
            };

            const expected = replacementTable[name];
            if (expected) {
                context.report({
                    node,
                    message: `\`complement(${name})\` should be simplified to \`${expected}\``
                });
            }
        }
    }
});

module.exports = {
    create,
    meta: {
        docs: {
            description: '`complement` simplifications, like when the negation should be replaced by an assertion',
            recommended: 'error'
        }
    }
};
