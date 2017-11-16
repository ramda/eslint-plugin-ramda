import test from 'ava';
import avaRuleTester from 'eslint-ava-rule-tester';
import rule from '../rules/filter-simplification';

const ruleTester = avaRuleTester(test, {
    env: {
        es6: true
    },
    parserOptions: {
        sourceType: 'module'
    }
});

const error = {
    ruleId: 'filter-simplification',
    message: '`filter(complement(_))` should be simplified to `reject(_)`'
};

ruleTester.run('filter-simplification', rule, {
    valid: [
        'filter(condition)',
        'R.filter(condition)'
    ],
    invalid: [
        {
            code: 'filter(complement(even))',
            errors: [error]
        },
        {
            code: 'R.filter(R.complement(even))',
            errors: [error]
        },
        {
            code: 'R[\'filter\'](R.complement(even))',
            errors: [error]
        },
        {
            code: 'filter(R[\'complement\'](even))',
            errors: [error]
        }
    ]
});
