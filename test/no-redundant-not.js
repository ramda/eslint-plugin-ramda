import test from 'ava';
import avaRuleTester from 'eslint-ava-rule-tester';
import rule from '../rules/no-redundant-not';

const ruleTester = avaRuleTester(test, {
    env: {
        es6: true
    },
    parserOptions: {
        sourceType: 'module'
    }
});

const error = {
    ruleId: 'no-redundant-not',
    message: 'No redundant use of `not`. Use `!` in this case'
};

ruleTester.run('no-redundant-not', rule, {
    valid: [
        '!value',
        'complement(not)',
        'R.complement(R.not)',
    ],
    invalid: [
        {
            code: 'not(true)',
            errors: [error]
        },
        {
            code: 'R.not(true)',
            errors: [error]
        }
    ]
});
