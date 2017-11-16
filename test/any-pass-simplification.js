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

const error = {
    ruleId: 'any-pass-simplification',
    message: '`anyPass` containing only complement functions should be a complement of `allPass`'
};

ruleTester.run('any-pass-simplification', rule, {
    valid: [
        'anyPass',
        'anyPass([complement(a), b, complement(c)])',
        'anyPass([complement(a), complement(b), some(c)])',
        'R.anyPass',
        'R.anyPass([complement(a), b, R.complement(c)])',
        'R.anyPass([R.complement(a), R.complement(b), some(c)])',
        'R.anyPass(1)'
    ],
    invalid: [
        {
            code: 'anyPass([complement(a), complement(b), complement(c)])',
            errors: [error]
        },
        {
            code: 'anyPass([complement(a), complement(isNil)])',
            errors: [error]
        },
        {
            code: 'R.anyPass([R.complement(a), R.complement(b), R.complement(c)])',
            errors: [error]
        },
        {
            code: 'R.anyPass([R.complement(a), R.complement(R.isNil)])',
            errors: [error]
        }
    ]
});
