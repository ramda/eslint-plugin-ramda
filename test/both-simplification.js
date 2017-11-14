import test from 'ava';
import avaRuleTester from 'eslint-ava-rule-tester';
import rule from '../rules/both-simplification';

const ruleTester = avaRuleTester(test, {
    env: {
        es6: true
    },
    parserOptions: {
        sourceType: 'module'
    }
});

ruleTester.run('both-simplification', rule, {
    valid: [
        'both(first, second)',
        'both(first)'
    ],
    invalid: [
        {
            code: 'both(complement(a), complement(b))',
            errors: [{
                ruleId: 'both-simplification',
                message: '`both(complement(_), complement(_))` should be simplified to `complement(either(_, _))`'
            }]
        }
    ]
});
