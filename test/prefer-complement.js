import test from 'ava';
import avaRuleTester from 'eslint-ava-rule-tester';
import rule from '../rules/prefer-complement';

const ruleTester = avaRuleTester(test, {
    env: {
        es6: true
    },
    parserOptions: {
        sourceType: 'module'
    }
});

const instead = {
    compose: 'compose(not, ...)',
    pipe: 'pipe(..., not)'
};

const error = composition => ({
    ruleId: 'prefer-complement',
    message: `Instead of \`${instead[composition]}\`, prefer \`complement(...)\``
});

ruleTester.run('prefer-complement', rule, {
    valid: [
        'complement(isEmpty)',
        'complement(isNil)',
        'propSatisfies(complement(isNil))',
        'compose(foo, bar)',
        'pipe(bar, foo)',
        'compose(foo, not, bar)',
        'compose(not, foo, bar)',
        'pipe(bar, not, foo)',
        'pipe(bar, foo, not)'
    ],
    invalid: [
        {
            code: 'compose(not, isEmpty)',
            errors: [error('compose')]
        },
        {
            code: 'compose(not, xs => xs.length)',
            errors: [error('compose')]
        },
        {
            code: 'pipe(isEmpty, not)',
            errors: [error('pipe')]
        },
        {
            code: 'pipe(function (xs) { return xs.length === 0; }, not)',
            errors: [error('pipe')]
        },
        {
            code: 'compose(not, isNil)',
            errors: [error('compose')]
        },
        {
            code: 'compose(not, R.isNil)',
            errors: [error('compose')]
        },
        {
            code: 'pipe(isNil, not)',
            errors: [error('pipe')]
        },
        {
            code: 'pipe(R.isNil, not)',
            errors: [error('pipe')]
        },
        {
            code: 'compose(not, foo)',
            errors: [error('compose')]
        },
        {
            code: 'compose(not, foo(bar))',
            errors: [error('compose')]
        },
        {
            code: 'pipe(foo, not)',
            errors: [error('pipe')]
        },
        {
            code: 'pipe(foo(bar), not)',
            errors: [error('pipe')]
        },
        {
            code: 'propSatisfies(compose(not, isNil))',
            errors: [error('compose')]
        },
        {
            code: 'propSatisfies(pipe(isNil, not))',
            errors: [error('pipe')]
        }
    ]
});
