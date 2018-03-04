'use strict';
const R = require('ramda');
const ast = require('../ast-helper');

const isCalling = ast.isCalling;
const getName = ast.getName;

const prefer = {
    allPass: 'both',
    anyPass: 'either'
}

const match = name => isCalling({
    name,
    arguments: R.where({
        0: R.both(
            R.propEq('type', 'ArrayExpression'),
            R.pathEq(['elements', 'length'], 2)
        ),
    })
})

const elementsToString = R.pipe(
    R.prop('elements'),
    R.map(getName),
    R.join(', ')
);

const report = instead => `Instead of \`${instead}\`, prefer \`${prefer[instead]}\` when there are only two predicates`

const create = context => ({
    CallExpression(node) {
        if (match('allPass')(node) || match('anyPass')(node)) {
            const callee = getName(node.callee);
            context.report({
                node,
                message: report(callee)
            });
        }
    }
});

module.exports = {
    create,
    meta: {
        docs: {
            description: 'Enforces using `both`/`either` instead of `allPass`/`anyPass` with a list of only two predicates',
            recommended: 'off'
        }
    }
};
