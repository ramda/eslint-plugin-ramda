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

const error = (instead, args) => ({
    ruleId: 'prefer-both-either',
    message: `Instead of \`${instead}([${args}])\`, prefer \`${prefer[instead]}(${args})\``
});

ruleTester.run('prefer-both-either', rule, {
    valid: [
        'both(foo, bar)',
        'either(foo, bar)',
        'allPass([foo, bar, baz])',
        'anyPass([foo, bar, baz])'
    ],
    invalid: [
        {
            code: 'allPass([foo, bar])',
            errors: [error('allPass', 'foo, bar')]
        },
        {
            code: 'allPass([foo, bar], baz)',
            errors: [error('allPass', 'foo, bar')]
        },
        {
            code: 'anyPass([foo, bar])',
            errors: [error('anyPass', 'foo, bar')]
        },
        {
            code: 'anyPass([foo, bar], baz)',
            errors: [error('anyPass', 'foo, bar')]
        }
    ]
});
