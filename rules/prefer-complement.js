'use strict';
const R = require('ramda');
const ast = require('../ast-helper');

const isCalling = ast.isCalling;
const isRamdaMethod = ast.isRamdaMethod;

const create = context => ({
    CallExpression(node) {
        const matchCompose = isCalling({
            name: 'compose',
            arguments: R.both(
                R.propEq('length', 2),
                R.where({
                    0: isRamdaMethod('not'),
                })
            )
        });

        const matchPipe = isCalling({
            name: 'pipe',
            arguments: R.both(
                R.propEq('length', 2),
                R.where({
                    1: isRamdaMethod('not'),
                })
            )
        });

        if (matchCompose(node)) {
            context.report({
                node,
                message: `Instead of \`compose(not, ...)\`, prefer \`complement(...)\``
            });
        }

        if (matchPipe(node)) {
            context.report({
                node,
                message: `Instead of \`pipe(..., not)\`, prefer \`complement(...)\``
            });
        }
    }
});

module.exports = {
    create,
    meta: {
        docs: {
            description: 'Enforces using `complement` instead of compositions using `not`',
            recommended: 'off'
        }
    }
};
