'use strict';

const R = require('ramda');
const utils = require('../lib/utils');


const create = context => ({
    CallExpression(node) {
        const currentScope = context.getScope();
        const isRamdaFilterCall = R.propSatisfies(utils.isRamdaMethod('filter', currentScope), 'callee');
        const isRamdaFilterCallExpression = R.allPass([ utils.isCallExpression, isRamdaFilterCall ]);

        if (utils.isRamdaMethod('complement', currentScope, node.callee) && isRamdaFilterCallExpression(node.parent)) {
            context.report({
                node,
                message: '`filter(complement(_))` should be simplified to `reject(_)`'
            });
        }
    }
});

module.exports = {
    create,
    meta: {
        docs: {
            description: '`filter` simplifications, like `filter(complement(_))` to `reject(_)`',
            recommended: 'error'
        }
    }
};
