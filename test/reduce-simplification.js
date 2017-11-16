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

const error = {
    sum: {
        ruleId: 'reduce-simplification',
        message: '`reduce(add)` should be simplified to `sum`'
    },
    product: {
        ruleId: 'reduce-simplification',
        message: '`reduce(multiply)` should be simplified to `product`'
    }
};

ruleTester.run('reduce-simplification', rule, {
    valid: [
        'sum([1, 2, 3])',
        'reduce(some)',
        'R.sum([1, 2, 3])',
        'R.reduce(some)'
    ],
    invalid: [
        {
            code: 'reduce(add)(0, [1, 2, 3])',
            errors: [error.sum]
        },
        {
            code: 'reduce(multiply)(1, [2, 3, 4])',
            errors: [error.product]
        },
        {
            code: 'R.reduce(R.add)(0, [1, 2, 3])',
            errors: [error.sum]
        },
        {
            code: 'R.reduce(add)(0, [1, 2, 3])',
            errors: [error.sum]
        },
        {
            code: 'R.reduce(R.multiply)(1, [2, 3, 4])',
            errors: [error.product]
        }
    ]
});
