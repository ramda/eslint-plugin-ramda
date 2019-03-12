'use strict';
const R = require('ramda');

// :: Node -> String
const getName = R.ifElse(
    R.propEq('type', 'MemberExpression'),
    R.path(['property', 'name']),
    R.prop('name')
);

// :: String -> Node -> Boolean
const isRamdaMethod = name => R.either(
    R.whereEq({
        type: 'Identifier',
        name
    }),
    R.where({
        type: R.equals('MemberExpression'),
        object: R.whereEq({ type: 'Identifier', name: 'R' }),
        property: R.either(
            R.whereEq({ type: 'Identifier', name }),
            R.whereEq({ type: 'Literal', value: name })
        )
    })
);

// :: { name :: String, arguments :: [Node] -> Boolean }
// -> Object
// -> Boolean
const isCalling = pattern => R.where({
    type: R.equals('CallExpression'),
    callee: isRamdaMethod(pattern.name),
    arguments: pattern.arguments || R.T
});

// :: Node -> Boolean
const isBooleanLiteral = R.both(
    R.propEq('type', 'Literal'),
    R.propSatisfies(R.is(Boolean), 'value')
);

// :: Node -> Boolean
const isLineComment = R.propEq('type', 'Line');
// :: Node -> Boolean
const isBlockComment = R.propEq('type', 'Block');
// :: Node -> Boolean
const isComment = R.anyPass([isLineComment, isBlockComment]);
// :: Node -> Number
const endLn = R.path(['loc', 'end', 'line']);
// :: Node -> Boolean
const notEmpty = R.complement(R.isEmpty);
// :: Node -> [ Number, Number ]
const identifierRange = R.ifElse(
    R.propEq('type', 'Identifier'),
    R.prop('range'),
    R.path(['property', 'range'])
);

// :: String, Number -> String
const repeatChar = (char, n) => R.join('', R.times(() => char, R.max(0, n)));

// :: SourceCode -> Array<ASTNodes> -> String
const joinNodes = sourceCode =>
    R.pipe(
        R.reduce((acc, curr) => {
            if (R.is(String, curr)) {
                return R.evolve({
                    text: R.flip(R.concat)(curr),
                })(acc);
            }

            const { end, start } = curr.loc;
            const text = sourceCode.getText(curr);

            if (!acc) return { text, end };

            if (acc.end.line === start.line) {
                const commaLength = isComment(curr) && sourceCode.getTokenBefore(curr).value === ',' ? 1 : 0;
                const strBetween = repeatChar(' ', start.column - acc.end.column - commaLength);

                return {
                    text: acc.text + strBetween + text,
                    end,
                };
            }

            const strBetween = repeatChar('\n', start.line - acc.end.line) + repeatChar(' ', start.column);
                
            return {
                text: acc.text + strBetween + text,
                end,
            };
        }, null),
        R.prop('text')
    );

// :: SourceCode, ASTArgumentNode, Array<ASTNodes> -> [ [ Number, Number ], String ]
const replaceArgument = (sourceCode, argToReplace, nodes) => {
    /**
     * In case if last node is comment we could potentially comment out comma that is needed.
     * To resolve that we are adding it before comment and removing the one after comment
     */
    const nextToken = sourceCode.getTokenAfter(argToReplace);
    if (isComment(R.last(nodes)) && nextToken.value === ',') {
        const nodesWithComma = R.insert(nodes.length - 1, ',', nodes);

        return [
            [argToReplace.start, nextToken.end],
            joinNodes(sourceCode)(nodesWithComma),
        ];
    }

    return [
        [argToReplace.start, argToReplace.end],
        joinNodes(sourceCode)(nodes),
    ];
};

// :: SourceCode, Array<ASTNodes> -> [ Number, Number ]
const commentsRanges = (sourceCode, node) => sourceCode.getCommentsInside(node).map(comment => {
    const prevToken = sourceCode.getTokenBefore(comment);
    const nextToken = sourceCode.getTokenAfter(comment);

    // basic [comment.start, comment.end] will leave whitespaces
    if (endLn(comment) === endLn(prevToken)) {
        return [
            prevToken.end,
            comment.end
        ];
    }

    return [
        comment.start,
        nextToken.start
    ];
});

// :: SourceCode -> Array<ASTNodes> -> Array<Array<ASTNodes>>
const getArgumentsWithComments = sourceCode => R.pipe(
    R.map(current => [
        ...sourceCode.getCommentsBefore(current),
        current,
        ...sourceCode.getCommentsAfter(current),
    ]),
    R.reduce((acc, curr) => {
        if (notEmpty(acc)) {
            /**
             * if you have comment at the end of line, eslint usually assagning that
             * comment to next token. That will move affected comments to their owners
             */
            const lastAcc = R.last(acc);
            const currHead = R.head(curr);
            if (isComment(currHead) && endLn(currHead) === endLn(R.last(lastAcc))) {
                return [
                    ...R.init(acc),
                    [...lastAcc, currHead],
                    R.tail(curr),
                ];
            }
        }

        return [...acc, curr];
    }, [])
);

module.exports = {
    isRamdaMethod,
    isCalling,
    getName,
    isBooleanLiteral,
    commentsRanges,
    identifierRange,
    replaceArgument,
    getArgumentsWithComments,
};