import test from 'ava';
import avaRuleTester from 'eslint-ava-rule-tester';
import rule from '../rules/no-redundant-and';

const ruleTester = avaRuleTester(test, {
    env: {
        es6: true
    },
    parserOptions: {
        sourceType: 'module'
    }
});

const error = {
    ruleId: 'no-redundant-and',
    message: 'No redundant use of `and`. Use `&&` in this case'
};

ruleTester.run('no-redundant-and', rule, {
    valid: [
        'true && false',
        'and(true)',
        'and',
        'R.and(true)',
        'R.and'
    ],
    invalid: [
        {
            code: 'and(true, false)',
            errors: [error]
        },
        {
            code: 'R.and(true, false)',
            errors: [error]
        }
    ]
});
