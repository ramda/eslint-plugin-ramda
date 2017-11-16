import test from 'ava';
import avaRuleTester from 'eslint-ava-rule-tester';
import rule from '../rules/merge-simplification';

const ruleTester = avaRuleTester(test, {
    env: {
        es6: true
    },
    parserOptions: {
        sourceType: 'module'
    }
});

const error = {
    ruleId: 'merge-simplification',
    message: '`merge(__, { key: value })` should be simplified to `assoc(key, value)`'
};

ruleTester.run('merge-simplification', rule, {
    valid: [
        'merge(__, { x: 1, y: 2 })',
        'merge({ x: 1 }, { y: 2 })',
        'merge({ x: 1 })',
        'merge(__, {})',
        'R.merge(R.__, {})',
        'R.merge(__, {})',
        'R.merge(R.__, { x: 1, y: 2 })',
        'R.merge(__)'
    ],
    invalid: [
        {
            code: 'merge(__, { x: 1 })',
            errors: [error]
        },
        {
            code: 'R.merge(R.__, { x: 1 })',
            errors: [error]
        },
        {
            code: 'merge(R.__, { x: 1 })',
            errors: [error]
        }
    ]
});
