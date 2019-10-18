'use strict';
const R = require('ramda');
const ast = require('../ast-helper');

const isCalling = ast.isCalling;
const isRamdaMethod = ast.isRamdaMethod;

const create = context => ({
    CallExpression(node) {
        const match = isCalling({
            name: 'cond',
            arguments: R.tryCatch(
                R.pipe(
                    R.head,
                    R.prop('elements'),
                    R.last,
                    R.prop('elements'),
                    R.head,
                    isRamdaMethod('T'),
                    R.not
                ),
                R.F
            )
        });

        if (match(node)) {
            context.report({
                node,
                message: '`cond` should finish with a `T` condition so it returns a default value'
            });
        }
    }
});

module.exports = {
    create,
    meta: {
        docs: {
            description: '`cond` default, like suggesting returning a default value',
            recommended: 'error'
        }
    }
};
