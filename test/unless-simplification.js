import test from 'ava';
import avaRuleTester from 'eslint-ava-rule-tester';
import rule from '../rules/unless-simplification';

const ruleTester = avaRuleTester(test, {
    env: {
        es6: true
    },
    parserOptions: {
        sourceType: 'module'
    }
});

ruleTester.run('unless-simplification', rule, {
    valid: [
        'unless(condition, action)',
        'unless(condition)'
    ],
    invalid: [
        {
            code: 'unless(complement(condition), action)',
            errors: [{
                ruleId: 'unless-simplification',
                message: '`unless(complement(_))` should be simplified to `when(_)`'
            }]
        }
    ]
});
