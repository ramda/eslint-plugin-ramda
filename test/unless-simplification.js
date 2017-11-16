import test from 'ava';
import avaRuleTester from 'eslint-ava-rule-tester';
import rule from '../rules/unless-simplification';

const ruleTester = avaRuleTester(test, {
    env: {
        es6: true
    },
    parserOptions: {
        sourceType: 'module'
    }
});

const error = {
    ruleId: 'unless-simplification',
    message: '`unless(complement(_))` should be simplified to `when(_)`'
};

ruleTester.run('unless-simplification', rule, {
    valid: [
        'unless(condition, action)',
        'unless(condition)',
        'R.unless(condition, action)',
        'R.unless(condition)'
    ],
    invalid: [
        {
            code: 'unless(complement(condition), action)',
            errors: [error]
        },
        {
            code: 'R.unless(R.complement(condition), action)',
            errors: [error]
        },
        {
            code: 'R.unless(complement(condition), action)',
            errors: [error]
        },
        {
            code: 'unless(R.complement(condition), action)',
            errors: [error]
        }
    ]
});
