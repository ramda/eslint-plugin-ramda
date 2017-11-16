'use strict';

const R = require('ramda');

const getPropertyName = R.pipe(R.prop('property'), R.either(R.prop('name'), R.prop('value')));

const isIdentifierEqualsToReference = R.curry((identifierNode, reference) => {
    return R.equals(reference.identifier, identifierNode);
});

const isTypeOf = R.propEq('type');
const isCallExpression = isTypeOf('CallExpression');
const isIdentifier = isTypeOf('Identifier');
const isMemberExpression = isTypeOf('MemberExpression');

function findReference(scope, node) {
    const findReferenceByRange = R.find(isIdentifierEqualsToReference(node));
    return findReferenceByRange(scope.references);
}

function isStaticRequireCallOf(node, module) {
    const callee = node.callee;
    const firstArgument = R.head(node.arguments);

    return callee.name === 'require' &&
        node.arguments.length === 1 &&
        firstArgument.type === 'Literal' &&
        firstArgument.value === module;
}

function isImportSourceOf(node, module) {
    return node.source.value === module;
}

function hasAlias(importSpecifierNode) {
    return importSpecifierNode.imported.name !== importSpecifierNode.local.name;
}

function isResolved(reference) {
    return reference && Boolean(reference.resolved);
}

function isResolvedToRamda(scope, reference) {
    if (!isResolved(reference)) {
        return false;
    }

    const lastDefinition = R.last(reference.resolved.defs);

    if (lastDefinition.node.type === 'VariableDeclarator' && lastDefinition.node.init) {
        if (isCallExpression(lastDefinition.node.init)) {
            return isStaticRequireCallOf(lastDefinition.node.init, 'ramda');
        } else if (lastDefinition.node.init.type === 'Identifier') {
            const ref = findReference(scope, lastDefinition.node.init);
            return isResolvedToRamda(scope, ref);
        }
    } else if (lastDefinition.node.type === 'ImportSpecifier') {
        if (!hasAlias(lastDefinition.node)) {
            return isImportSourceOf(lastDefinition.node.parent, 'ramda');
        }
    } else if (lastDefinition.node.type === 'ImportDefaultSpecifier') {
        return isImportSourceOf(lastDefinition.node.parent, 'ramda');
    }

    return false;
}

function isGlobalReference(scope, node) {
    const name = node.name;

    if (node.type === "Identifier" && (name === 'window' || name === 'global')) {
        const ref = findReference(scope, node);
        return !isResolved(ref);
    }

    return false;
}

const isRamdaMethod = R.curry((methodName, scope, callee) => {
    if (isMemberExpression(callee)) {
        const object = callee.object;
        const possibleRamdaMethodName = getPropertyName(callee);

        if (possibleRamdaMethodName === methodName) {
            if (isIdentifier(object) || (isMemberExpression(object) && isGlobalReference(scope, object.object))) {
                const reference = findReference(scope, object);

                return isResolvedToRamda(scope, reference) || !isResolved(reference);
            }
        }
    }

    if (callee.type === 'Identifier') {
        const reference = findReference(scope, callee);
        return isResolvedToRamda(scope, reference);
    }

    return false;
});

const isRamdaFilterCall = R.propSatisfies(isRamdaMethod('filter'), 'callee');

module.exports = {
    isRamdaMethod,
    isCallExpression
};
