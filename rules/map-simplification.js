'use strict';
const R = require('ramda');
const ast = require('../ast-helper');

const isCalling = ast.isCalling;
const getName = ast.getName;

const create = context => ({
    CallExpression(node) {
        const match = isCalling({
            name: 'map',
            arguments: R.both(
                R.propSatisfies(R.lt(0), 'length'),
                R.propSatisfies(R.either(
                    isCalling({ name: 'prop' }),
                    isCalling({ name: 'pickAll' })
                ), 0)
            )
        });

        if (match(node)) {
            const map = {
                prop: 'pluck',
                pickAll: 'project'
            };
            const callee =  getName(node.arguments[0].callee);
            context.report({
                node,
                message: `\`map(${callee}(_))\` should be simplified to \`${map[callee]}(_)\``
            });
        }
    }
});

module.exports = {
    create,
    meta: {
        docs: {
            description: '`map` simplifications, like `map(prop(_))` to `pluck(_)`',
            recommended: 'error'
        }
    }
};
