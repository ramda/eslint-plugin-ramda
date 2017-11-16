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

const error = {
    ruleId: 'prop-satisfies-simplification',
    message: '`propSatisfies(equals(_))` should be simplified to `propEq(_)`'
};

ruleTester.run('prop-satisfies-simplification', rule, {
    valid: [
        'propSatisfies(lt(10))',
        'propSatisfies(T)',
        'R.propSatisfies(R.lt(10))',
        'R.propSatisfies(R.T)'
    ],
    invalid: [
        {
            code: 'propSatisfies(equals(1))',
            errors: [error]
        },
        {
            code: 'R.propSatisfies(R.equals(1))',
            errors: [error]
        },
        {
            code: 'propSatisfies(R.equals(1))',
            errors: [error]
        }
    ]
});
