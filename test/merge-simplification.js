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

ruleTester.run('merge-simplification', rule, {
    valid: [
        'merge(__, { x: 1, y: 2 })',
        'merge({ x: 1 }, { y: 2 })',
        'merge({ x: 1 })',
        'merge(__, {})'
    ],
    invalid: [
        {
            code: 'merge(__, { x: 1 })',
            errors: [{
                ruleId: 'merge-simplification',
                message: '`merge(__, { key: value })` should be simplified to `assoc(key, value)`'
            }]
        }
    ]
});
