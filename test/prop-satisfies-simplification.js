import test from 'ava';
import avaRuleTester from 'eslint-ava-rule-tester';
import rule from '../rules/prop-satisfies-simplification';

const ruleTester = avaRuleTester(test, {
    env: {
        es6: true
    },
    parserOptions: {
        sourceType: 'module'
    }
});

ruleTester.run('prop-satisfies-simplification', rule, {
    valid: [
        'propSatisfies(lt(10))',
        'propSatisfies(T)'
    ],
    invalid: [
        {
            code: 'propSatisfies(equals(1))',
            errors: [{
                ruleId: 'prop-satisfies-simplification',
                message: '`propSatisfies(equals(_))` should be simplified to `propEq(_)`'
            }]
        }
    ]
});
