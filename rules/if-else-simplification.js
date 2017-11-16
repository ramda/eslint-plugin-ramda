'use strict';
const R = require('ramda');
const ast = require('../ast-helper');

const isCalling = ast.isCalling;
const isName = ast.isName;

const create = context => ({
    CallExpression(node) {
        const matchUnless = isCalling({
            name: 'ifElse',
            arguments: R.both(
                R.propSatisfies(R.lte(2), 'length'),
                R.propSatisfies(isName('identity'), 1)
            )
        });

        const matchWhen = isCalling({
            name: 'ifElse',
            arguments: R.both(
                R.propSatisfies(R.lte(3), 'length'),
                R.propSatisfies(isName('identity'), 2)
            )
        });

        if (matchUnless(node)) {
            context.report({
                node,
                message: '`ifElse(_, identity, _)` should be simplified to `unless(_, _)`'
            });
        }

        if (matchWhen(node)) {
            context.report({
                node,
                message: '`ifElse(_, _, identity)` should be simplified to `when(_, _)`'
            });
        }
    }
});

module.exports = {
    create,
    meta: {
        docs: {
            description: '`ifElse` simplifications, like replacing by `when` or `unless`',
            recommended: 'error'
        }
    }
};
