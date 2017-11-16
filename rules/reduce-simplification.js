'use strict';
const R = require('ramda');
const ast = require('../ast-helper');

const isCalling = ast.isCalling;
const isName = ast.isName;
const getName = ast.getName;

const create = context => ({
    CallExpression(node) {
        const match = isCalling({
            name: 'reduce',
            arguments: R.propSatisfies(R.lt(0), 'length')
        });

        if (match(node)) {
            const canSimplify = R.either(isName('add'), isName('multiply'));
            const reporters = {
                add: 'sum',
                multiply: 'product'
            };

            if (canSimplify(node.arguments[0])) {
                const callee = getName(node.arguments[0]);
                context.report({
                    node,
                    message: '`reduce(' + callee + ')` should be simplified to `' + reporters[callee] + '`'
                });
            }
        }
    }
});

module.exports = {
    create,
    meta: {
        docs: {
            description: '`reduce` simplifications, like `reduce(add)` to `sum`',
            recommended: 'error'
        }
    }
};
