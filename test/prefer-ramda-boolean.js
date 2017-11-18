import test from 'ava';
import avaRuleTester from 'eslint-ava-rule-tester';
import rule from '../rules/prefer-ramda-boolean';

const ruleTester = avaRuleTester(test, {
    env: {
        es6: true
    },
    parserOptions: {
        sourceType: 'module'
    }
});

const error = (instead, prefer) => ({
    ruleId: 'prefer-ramda-boolean',
    message: `Instead of \`() => ${instead}\`, prefer \`${prefer}\``
});

ruleTester.run('prefer-ramda-boolean', rule, {
    valid: [
        'true',
        'R.T',
        'R.F',
        '() => computation',
        '() => { return 1; }',
        '(function () { return 1; })',
        '(function() { return; })',
        '() => {}',
        '() => { return; }'
    ],
    invalid: [
        {
            code: '(function () { return false; })',
            errors: [error('false', 'F')]
        },
        {
            code: '(function () { return true; })',
            errors: [error('true', 'T')]
        },
        {
            code: '() => false',
            errors: [error('false', 'F')]
        },
        {
            code: '() => true',
            errors: [error('true', 'T')]
        },
        {
            code: '() => { return true; }',
            errors: [error('true', 'T')]
        },
        {
            code: '() => { return false; }',
            errors: [error('false', 'F')]
        }
    ]
});
