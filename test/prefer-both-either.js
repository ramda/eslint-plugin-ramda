import test from 'ava';
import avaRuleTester from 'eslint-ava-rule-tester';
import rule from '../rules/prefer-both-either';

const ruleTester = avaRuleTester(test, {
    env: {
        es6: true
    },
    parserOptions: {
        sourceType: 'module'
    }
});

const prefer = {
    allPass: 'both',
    anyPass: 'either'
}

const error = instead => ({
    ruleId: 'prefer-both-either',
    message: `Instead of \`${instead}\`, prefer \`${prefer[instead]}\` when there are only two predicates`
});

ruleTester.run('prefer-both-either', rule, {
    valid: [
        'both(foo, bar)',
        'either(foo, bar)',
        'allPass([foo, bar, baz])',
        'anyPass([foo, bar, baz])',
        'allPass(predicates)',
        'allPass(predicates, foo)',
        'anyPass(predicates)',
        'anyPass(predicates, foo)'
    ],
    invalid: [
        {
            code: 'allPass([foo, bar])',
            errors: [error('allPass')]
        },
        {
            code: 'allPass([foo, bar], baz)',
            errors: [error('allPass')]
        },
        {
            code: 'allPass([(foo) => !foo, function () { return false; }])',
            errors: [error('allPass')]
        },
        {
            code: 'allPass([complement(foo), complement(bar)])',
            errors: [error('allPass')]
        },
        {
            code: 'anyPass([foo, bar])',
            errors: [error('anyPass')]
        },
        {
            code: 'anyPass([foo, bar], baz)',
            errors: [error('anyPass')]
        },
        {
            code: 'anyPass([R.T, R.F])',
            errors: [error('anyPass')]
        }
    ]
});
