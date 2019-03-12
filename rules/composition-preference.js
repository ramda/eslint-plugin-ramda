'use strict';
const R = require('ramda');
const {
    isCalling,
    commentsRanges,
    identifierRange,
    replaceArgument,
    getArgumentsWithComments,
} = require('../ast-helper');

const startLine = R.path(['loc', 'start', 'line']);
const endLine = R.path(['loc', 'end', 'line']);
const isSingleLine = R.converge(R.equals, [startLine, endLine]);

const matchCompose = isCalling({
    name: 'compose',
});

const matchPipe = isCalling({
    name: 'pipe',
});

const makeMsg = (is, should, when) =>
    `Prefer \`${should}\` over \`${is}\` for ${when} expression`;

const create = context => ({
    CallExpression(node) {
        const isPipe = matchPipe(node);
        const isCompose = matchCompose(node);

        if (isPipe || isCompose) {
            const {
                singleLine = 'compose',
                multiline = 'pipe',
            } = R.pathOr({}, ['options', 0], context);
            const sourceCode = context.getSourceCode();

            const fix = toMethod => fixer => {
                const args = R.reverse(getArgumentsWithComments(sourceCode)(node.arguments));

                return [
                    fixer.replaceTextRange(identifierRange(node.callee), toMethod),
                    ...R.map(fixer.removeRange, commentsRanges(sourceCode, node)),
                    ...node.arguments
                        .map((token, i) => replaceArgument(sourceCode, token, args[i]))
                        .map(x => fixer.replaceTextRange(...x)),
                ];
            };

            if (isSingleLine(node)) {
                if (singleLine === 'compose' && isPipe) {
                    context.report({
                        node,
                        message: makeMsg('pipe', 'compose', 'single line'),
                        fix: fix('compose'),
                    });
                } else if (singleLine === 'pipe' && isCompose) {
                    context.report({
                        node,
                        message: makeMsg('compose', 'pipe', 'single line'),
                        fix: fix('pipe'),
                    });
                }
            } else {
                if (multiline === 'compose' && isPipe) {
                    context.report({
                        node,
                        message: makeMsg('pipe', 'compose', 'multiline'),
                        fix: fix('compose'),
                    });
                } else if (multiline === 'pipe' && isCompose) {
                    context.report({
                        node,
                        message: makeMsg('compose', 'pipe', 'multiline'),
                        fix: fix('pipe'),
                    });
                }
            }
        }
    }
});

const compositionFn = ['compose', 'pipe'];
const schema = [{
    type: 'object',
    properties: {
        singleLine: {
            enum: compositionFn,
        },
        multiline: {
            enum: compositionFn,
        },
    },
}];

module.exports = {
    create,
    schema,
    meta: {
        docs: {
            description: 'Enforces prefered function composition for single and multiline expressions',
            recommended: 'off',
        },
        fixable: 'code',
    }
};
