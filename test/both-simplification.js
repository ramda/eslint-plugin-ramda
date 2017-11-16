import test from 'ava';
import avaRuleTester from 'eslint-ava-rule-tester';
import rule from '../rules/both-simplification';

const ruleTester = avaRuleTester(test, {
    env: {
        es6: true
    },
    parserOptions: {
        sourceType: 'module'
    }
});

const error = {
    ruleId: 'both-simplification',
    message: '`both(complement(_), complement(_))` should be simplified to `complement(either(_, _))`'
};

ruleTester.run('both-simplification', rule, {
    valid: [
        'both(first, second)',
        'both(first)',
        'R.both(first, second)',
        'R.both(first)'
    ],
    invalid: [
        {
            code: 'both(complement(a), complement(b))',
            errors: [error]
        },
        {
            code: 'R.both(R.complement(a), R.complement(b))',
            errors: [error]
        }
    ]
});
