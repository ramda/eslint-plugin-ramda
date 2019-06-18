import test from 'ava';
import avaRuleTester from 'eslint-ava-rule-tester';
import rule from '../rules/complement-simplification';

const ruleTester = avaRuleTester(test, {
    env: {
        es6: true
    },
    parserOptions: {
        sourceType: 'module'
    }
});

const error = (from, to) => ({
    ruleId: 'complement-simplification',
    message: `\`complement(${from})\` should be simplified to \`${to}\``
});

ruleTester.run('complement-simplification', rule, {
    valid: [
        'complement(equals)',
        'complement(and)',
        'complement(or)',
        'complement(odd())',
        'R.complement(equals)'
    ],
    invalid: [
        {
            code: 'complement(T)',
            errors: [error('T', 'F')]
        },
        {
            code: 'complement(F)',
            errors: [error('F', 'T')]
        },
        {
            code: 'R.complement(R.T)',
            errors: [error('T', 'F')]
        }
    ]
});
