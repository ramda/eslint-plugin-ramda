'use strict';
const R = require('ramda');
const ast = require('../ast-helper');

const isCalling = ast.isCalling;
const isRamdaMethod = ast.isRamdaMethod;

const create = context => ({
    CallExpression(node) {
        const match = isCalling({
            name: 'pipe',
            arguments: R.both(
                R.propSatisfies(R.lte(2), 'length'),
                R.where({
                    0: isRamdaMethod('map'),
                    1: isRamdaMethod('flatten')
                })
            )
        });

        if (match(node)) {
            context.report({
                node,
                message: '`pipe(map, flatten)` should be simplified to `chain`'
            });
        }
    }
});

module.exports = {
    create,
    meta: {
        docs: {
            description: 'Detects when there are better functions that behave the same as `pipe`',
            recommended: 'off'
        }
    }
};
