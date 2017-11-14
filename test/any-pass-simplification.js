import test from 'ava';
import avaRuleTester from 'eslint-ava-rule-tester';
import rule from '../rules/any-pass-simplification';

const ruleTester = avaRuleTester(test, {
    env: {
        es6: true
    },
    parserOptions: {
        sourceType: 'module'
    }
});

ruleTester.run('any-pass-simplification', rule, {
    valid: [
        'anyPass',
        'anyPass([complement(a), b, complement(c)])',
        'anyPass([complement(a), complement(b), some(c)])'
    ],
    invalid: [
        {
            code: 'anyPass([complement(a), complement(b), complement(c)])',
            errors: [{
                ruleId: 'any-pass-simplification',
                message: '`anyPass` containing only complement functions should be a complement of `allPass`'
            }]
        },
        {
            code: 'anyPass([complement(a), complement(isNil)])',
            errors: [{
                ruleId: 'any-pass-simplification',
                message: '`anyPass` containing only complement functions should be a complement of `allPass`'
            }]
        }
    ]
});
