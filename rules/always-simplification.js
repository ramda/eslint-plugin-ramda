'use strict';
const R = require('ramda');
const ast = require('../ast-helper');

const isCalling = ast.isCalling;
const isBooleanLiteral = ast.isBooleanLiteral;

const report = (instead, prefer) => `\`always(${instead})\` should be simplified to \`${prefer}\``;
const getAlternative = R.applyTo(R.__, R.compose(R.toUpper, R.head, R.toString));

const create = context => ({
    CallExpression(node) {
        const match = isCalling({
            name: 'always',
            arguments: R.both(
                R.propEq('length', 1),
                R.where({
                    0: isBooleanLiteral
                })
            )
        });

        if (match(node)) {
            const instead = node.arguments[0].value;

            context.report({
                node,
                message: report(instead, getAlternative(instead))
            });
        }
    }
});

module.exports = {
    create,
    meta: {
        docs: {
            description: 'Detects cases where `always` is redundant',
            recommended: 'error'
        }
    }
};
