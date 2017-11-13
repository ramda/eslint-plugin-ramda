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

ruleTester.run('complement-simplification', rule, {
    valid: [
        'complement(equals)',
        'complement(odd())'
    ],
    invalid: [
        {
            code: 'complement(T)',
            errors: [{
                ruleId: 'complement-simplification',
                message: '`complement(T)` should be simplified to `F`'
            }]
        },
        {
            code: 'complement(F)',
            errors: [{
                ruleId: 'complement-simplification',
                message: '`complement(F)` should be simplified to `T`'
            }]
        },
        {
            code: 'complement(or)',
            errors: [{
                ruleId: 'complement-simplification',
                message: '`complement(or)` should be simplified to `and`'
            }]
        },
        {
            code: 'complement(and)',
            errors: [{
                ruleId: 'complement-simplification',
                message: '`complement(and)` should be simplified to `or`'
            }]
        }
    ]
});
