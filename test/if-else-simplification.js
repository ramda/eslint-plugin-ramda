import test from 'ava';
import avaRuleTester from 'eslint-ava-rule-tester';
import rule from '../rules/if-else-simplification';

const ruleTester = avaRuleTester(test, {
    env: {
        es6: true
    },
    parserOptions: {
        sourceType: 'module'
    }
});

ruleTester.run('if-else-simplification', rule, {
    valid: [
        'ifElse(condition, whenTrue, whenFalse)',
        'ifElse(condition)'
    ],
    invalid: [
        {
            code: 'ifElse(condition, action, identity)',
            errors: [{
                ruleId: 'if-else-simplification',
                message: '`ifElse(_, _, identity)` should be simplified to `when(_, _)`'
            }]
        },
        {
            code: 'ifElse(condition, identity, action)',
            errors: [{
                ruleId: 'if-else-simplification',
                message: '`ifElse(_, identity, _)` should be simplified to `unless(_, _)`'
            }]
        },
        {
            code: 'ifElse(condition, identity, identity)',
            errors: [{
                ruleId: 'if-else-simplification',
                message: '`ifElse(_, identity, _)` should be simplified to `unless(_, _)`'
            }, {
                ruleId: 'if-else-simplification',
                message: '`ifElse(_, _, identity)` should be simplified to `when(_, _)`'
            }]
        }
    ]
});
