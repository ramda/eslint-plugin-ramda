'use strict';
const R = require('ramda');
const isCalling = require('../ast-helper').isCalling;

const startLine = R.path(['loc', 'start', 'line']);
const endLine = R.path(['loc', 'end', 'line']);
const isSingleLine = R.converge(R.equals, [startLine, endLine]);

const create = context => ({
    CallExpression(node) {
        const matchCompose = isCalling({
            name: 'compose'
        });

        const matchPipe = isCalling({
            name: 'pipe'
        });

        if (matchCompose(node)) {
            if (!isSingleLine(node)) {
                context.report({
                    node,
                    message: 'Prefer `pipe` over `compose` for multiline expression'
                });
            }
        }

        if (matchPipe(node)) {
            if (isSingleLine(node)) {
                context.report({
                    node,
                    message: 'Prefer `compose` over `pipe` for single line expression'
                });
            }
        }
    }
});

module.exports = {
    create,
    meta: {
        docs: {
            description: 'Prefer `compose` for single line expression and `pipe` for multiline.',
            recommended: 'off'
        }
    }
};
