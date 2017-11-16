import test from 'ava';
import avaRuleTester from 'eslint-ava-rule-tester';
import rule from '../rules/when-simplification';

const ruleTester = avaRuleTester(test, {
    env: {
        es6: true
    },
    parserOptions: {
        sourceType: 'module'
    }
});

const error = {
    ruleId: 'when-simplification',
    message: '`when(complement(_))` should be simplified to `unless(_)`'
};

ruleTester.run('when-simplification', rule, {
    valid: [
        'when(condition, action)',
        'when(condition)',
        'R.when(condition, action)',
        'R.when(condition)'
    ],
    invalid: [
        {
            code: 'when(complement(condition), action)',
            errors: [error]
        },
        {
            code: 'R.when(R.complement(condition), action)',
            errors: [error]
        },
        {
            code: 'R.when(complement(condition), action)',
            errors: [error]
        }
    ]
});
