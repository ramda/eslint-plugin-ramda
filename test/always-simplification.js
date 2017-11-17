import test from 'ava';
import avaRuleTester from 'eslint-ava-rule-tester';
import rule from '../rules/always-simplification';

const ruleTester = avaRuleTester(test, {
    env: {
        es6: true
    },
    parserOptions: {
        sourceType: 'module'
    }
});

const error = (from, to) => ({
    ruleId: 'always-simplification',
    message: `\`always(${from})\` should be simplified to \`${to}\``
});

ruleTester.run('always-simplification', rule, {
    valid: [
        'always',
        'always(1)',
        'always(always)'
    ],
    invalid: [
        {
            code: 'always(true)',
            errors: [error('true', 'T')]
        },
        {
            code: 'always(false)',
            errors: [error('false', 'F')]
        }
    ]
});
