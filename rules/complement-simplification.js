'use strict';
const R = require('ramda');
const ast = require('../ast-helper');

const isCalling = ast.isCalling;
const isRamdaMethod = ast.isRamdaMethod;
const getName = ast.getName;

const names = {
    T: 'F',
    F: 'T'
};

const create = context => ({
    CallExpression(node) {
        const match = isCalling({
            name: 'complement',
            arguments: R.both(
                R.propSatisfies(R.lt(0), 'length'),
                R.where({
                    0: R.anyPass(R.map(isRamdaMethod, R.keys(names)))
                })
            )
        });

        if (match(node)) {
            const name = getName(node.arguments[0]);
            const expected = names[name];
            context.report({
                node,
                message: `\`complement(${name})\` should be simplified to \`${expected}\``
            });
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
