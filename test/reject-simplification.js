import test from 'ava';
import avaRuleTester from 'eslint-ava-rule-tester';
import rule from '../rules/reject-simplification';

const ruleTester = avaRuleTester(test, {
    env: {
        es6: true
    },
    parserOptions: {
        sourceType: 'module'
    }
});

const error = {
    ruleId: 'reject-simplification',
    message: '`reject(complement(_))` should be simplified to `filter(_)`'
};

ruleTester.run('reject-simplification', rule, {
    valid: [
        'reject(condition)',
        'R.reject(condition)'
    ],
    invalid: [
        {
            code: 'reject(complement(even))',
            errors: [error]
        },
        {
            code: 'R.reject(complement(even))',
            errors: [error]
        },
        {
            code: 'R.reject(R.complement(even))',
            errors: [error]
        },
        {
            code: 'reject(R.complement(even))',
            errors: [error]
        }
    ]
});
