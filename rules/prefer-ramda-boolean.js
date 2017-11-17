'use strict';
const R = require('ramda');
const isBooleanLiteral = require('../ast-helper').isBooleanLiteral;

const report = (instead, prefer) => `Instead of \`() => ${instead}\`, prefer \`${prefer}\``;
const getAlternative = R.applyTo(R.__, R.compose(R.toUpper, R.head, R.toString));

// :: Node -> Boolean
const onlyReturnsBoolean = R.where({
    type: R.equals('BlockStatement'),
    body: R.both(
        R.propEq('length', 1),
        R.where({
            0: R.where({
                type: R.equals('ReturnStatement'),
                argument: R.both(
                    R.complement(R.isNil),
                    isBooleanLiteral
                )
            })
        })
    )
});

// Node -> String
const getRawReturn = R.ifElse(
    R.propEq('type', 'BlockStatement'),
    R.path(['body', 0, 'argument', 'value']),
    R.prop('value')
);

const create = context => ({
    ArrowFunctionExpression(node) {
        const match = R.either(isBooleanLiteral, onlyReturnsBoolean);

        if (match(node.body)) {
            const instead = getRawReturn(node.body);
            context.report({
                node,
                message: report(instead, getAlternative(instead))
            });
        }
    },

    FunctionExpression(node) {
        if (onlyReturnsBoolean(node.body)) {
            const instead = node.body.body[0].argument.value;
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
            description: 'Suggests using Ramda T and F functions instead of explicit versions',
            recommended: 'error'
        }
    }
};
