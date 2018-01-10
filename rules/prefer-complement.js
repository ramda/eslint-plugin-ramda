'use strict';
const R = require('ramda');
const ast = require('../ast-helper');

const isCalling = ast.isCalling;
const isRamdaMethod = ast.isRamdaMethod;
const getName = ast.getName;

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
            const fn = getName(node.arguments[1]);
            context.report({
                node,
                message: `Instead of \`compose(not, ${fn})\`, prefer \`complement(${fn})\``
            });
        }

        if (matchPipe(node)) {
            const fn = getName(node.arguments[0]);
            context.report({
                node,
                message: `Instead of \`pipe(${fn}, not)\`, prefer \`complement(${fn})\``
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
