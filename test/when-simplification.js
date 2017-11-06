import test from 'ava';
import avaRuleTester from 'eslint-ava-rule-tester';
import rule from '../rules/when-simplification';

const ruleTester = avaRuleTester(test, {
    env: {
        es6: true
    },
    parserOptions: {
        sourceType: 'module'
    }
});

ruleTester.run('when-simplification', rule, {
    valid: [
        'when(condition, action)',
        'when(condition)'
    ],
    invalid: [
        {
            code: 'when(complement(condition), action)',
            errors: [{
                ruleId: 'when-simplification',
                message: '`when(complement(_))` should be simplified to `unless(_)`'
            }]
        }
    ]
});
