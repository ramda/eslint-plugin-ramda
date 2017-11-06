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

ruleTester.run('reject-simplification', rule, {
    valid: [
        'reject(condition)'
    ],
    invalid: [
        {
            code: 'reject(complement(even))',
            errors: [{
                ruleId: 'reject-simplification',
                message: '`reject(complement(_))` should be simplified to `filter(_)`'
            }]
        }
    ]
});
