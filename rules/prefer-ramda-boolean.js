'use strict';
const R = require('ramda');

const report = (instead, prefer) => `Instead of \`() => ${instead}\`, prefer \`${prefer}\``;
const isBooleanLiteral = R.both(
    R.propEq('type', 'Literal'),
    R.propSatisfies(R.is(Boolean), 'value')
);
const getAlternative = R.applyTo(R.__, R.compose(R.toUpper, R.head, R.toString));

const create = context => ({
    ArrowFunctionExpression(node) {
        if (isBooleanLiteral(node.body)) {
            const instead = node.body.value;
            context.report({
                node,
                message: report(instead, getAlternative(instead))
            });
        }
    },

    FunctionExpression(node) {
        const onlyReturnsBoolean = R.where({
            type: R.equals('BlockStatement'),
            body: R.both(
                R.propEq('length', 1),
                R.where({
                    0: R.where({
                        type: R.equals('ReturnStatement'),
                        argument: isBooleanLiteral
                    })
                })
            )
        });

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
