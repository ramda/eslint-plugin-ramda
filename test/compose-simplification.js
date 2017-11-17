import test from 'ava';
import avaRuleTester from 'eslint-ava-rule-tester';
import rule from '../rules/compose-simplification';

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
        ruleId: 'compose-simplification',
        message: '`compose(flatten, map)` should be simplified to `chain`'
    }
};

ruleTester.run('compose-simplification', rule, {
    valid: [
        'compose(map, flatten)',
        'compose()',
        'compose(left, right)'
    ],
    invalid: [
        {
            code: 'compose(flatten, map)',
            errors: [error.chain]
        },
        {
            code: 'R[\'compose\'](R.flatten, map)',
            errors: [error.chain]
        }
    ]
});
