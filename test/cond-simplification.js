import test from 'ava';
import avaRuleTester from 'eslint-ava-rule-tester';
import rule from '../rules/cond-simplification';

const ruleTester = avaRuleTester(test, {
    env: {
        es6: true
    },
    parserOptions: {
        sourceType: 'module'
    }
});

const error = {
    ruleId: 'when-simplification',
    message: '`cond` with too few parameters should be `ifElse`, `either` or `both`'
};

ruleTester.run('cond-simplification', rule, {
    valid: [
        'cond([[a, b], [c, d], [e, f]])',
        'R.cond([[a, b], [c, d], [e, f]])'
    ],
    invalid: [
        {
            code: 'cond([[a, b], [c, d]])',
            errors: [error]
        },
        {
            code: 'R.cond([[a, b], [c, d]])',
            errors: [error]
        }
    ]
});
