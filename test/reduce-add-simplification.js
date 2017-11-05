import test from 'ava';
import avaRuleTester from 'eslint-ava-rule-tester';
import rule from '../rules/reduce-add-simplification';

const ruleTester = avaRuleTester(test, {
    env: {
        es6: true
    },
    parserOptions: {
        sourceType: 'module'
    }
});

const error = {
    ruleId: 'reduce-add-simplification',
    message: '`reduce(add)` should be simplified to `sum`'
};

ruleTester.run('reduce-add-simplification', rule, {
    valid: [
        'sum([1, 2, 3])',
        'reduce(some)'
    ],
    invalid: [
        {
            code: 'reduce(add)(0, [1, 2, 3])',
            errors: [error]
        }
    ]
});
