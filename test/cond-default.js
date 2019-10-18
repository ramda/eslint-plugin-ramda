import test from 'ava';
import avaRuleTester from 'eslint-ava-rule-tester';
import rule from '../rules/cond-default';

const ruleTester = avaRuleTester(test, {
    env: {
        es6: true
    },
    parserOptions: {
        sourceType: 'module'
    }
});

const error = {
    ruleId: 'cond-default',
    message: '`cond` should finish with a `T` condition so it returns a default value'
};

ruleTester.run('cond-default', rule, {
    valid: [
        'cond([[a, b], [T, d]])',
        'R.cond([[a, b], [R.T, d]])',
        'cond([[a, b], [c, d], [T, f]])',
        'R.cond([[a, b], [c, d], [R.T, f]])',
        'cond(anything)'
    ],
    invalid: [
        {
            code: 'cond([[a, b], [c, d]])',
            errors: [error]
        },
        {
            code: 'cond([[a, b], [c, d], [e, f]])',
            errors: [error]
        }
    ]
});
