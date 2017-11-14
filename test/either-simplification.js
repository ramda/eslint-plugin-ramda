import test from 'ava';
import avaRuleTester from 'eslint-ava-rule-tester';
import rule from '../rules/either-simplification';

const ruleTester = avaRuleTester(test, {
    env: {
        es6: true
    },
    parserOptions: {
        sourceType: 'module'
    }
});

ruleTester.run('either-simplification', rule, {
    valid: [
        'either(first, second)',
        'either(first)'
    ],
    invalid: [
        {
            code: 'either(complement(a), complement(b))',
            errors: [{
                ruleId: 'either-simplification',
                message: '`either(complement(_), complement(_))` should be simplified to `complement(both(_, _))`'
            }]
        }
    ]
});
