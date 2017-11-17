import test from 'ava';
import avaRuleTester from 'eslint-ava-rule-tester';
import rule from '../rules/pipe-simplification';

const ruleTester = avaRuleTester(test, {
    env: {
        es6: true
    },
    parserOptions: {
        sourceType: 'module'
    }
});

const error = {
    chain: {
        ruleId: 'pipe-simplification',
        message: '`pipe(map, flatten)` should be simplified to `chain`'
    }
};

ruleTester.run('pipe-simplification', rule, {
    valid: [
        'pipe(flatten, map)',
        'pipe()',
        'pipe(left, right)'
    ],
    invalid: [
        {
            code: 'pipe(map, flatten)',
            errors: [error.chain]
        },
        {
            code: 'R[\'pipe\'](R.map, flatten)',
            errors: [error.chain]
        }
    ]
});
