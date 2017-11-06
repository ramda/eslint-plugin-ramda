import test from 'ava';
import avaRuleTester from 'eslint-ava-rule-tester';
import rule from '../rules/reduce-simplification';

const ruleTester = avaRuleTester(test, {
    env: {
        es6: true
    },
    parserOptions: {
        sourceType: 'module'
    }
});

ruleTester.run('reduce-add-simplification', rule, {
    valid: [
        'sum([1, 2, 3])',
        'reduce(some)'
    ],
    invalid: [
        {
            code: 'reduce(add)(0, [1, 2, 3])',
            errors: [{
                ruleId: 'reduce-simplification',
                message: '`reduce(add)` should be simplified to `sum`'
            }]
        },
        {
            code: 'reduce(multiply)(1, [2, 3, 4])',
            errors: [{
                ruleId: 'reduce-simplification',
                message: '`reduce(multiply)` should be simplified to `product`'
            }]
        }
    ]
});
