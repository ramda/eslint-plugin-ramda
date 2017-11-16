import test from 'ava';
import avaRuleTester from 'eslint-ava-rule-tester';
import rule from '../rules/no-redundant-or';

const ruleTester = avaRuleTester(test, {
    env: {
        es6: true
    },
    parserOptions: {
        sourceType: 'module'
    }
});

const error = {
    ruleId: 'no-redundant-or',
    message: 'No redundant use of `or`. Use `||` in this case'
};

ruleTester.run('no-redundant-or', rule, {
    valid: [
        'true || false',
        'or(true)',
        'or',
        'R.or(true)',
        'R.or'
    ],
    invalid: [
        {
            code: 'or(true, false)',
            errors: [error]
        },
        {
            code: 'R.or(true, false)',
            errors: [error]
        }
    ]
});
