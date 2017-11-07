import test from 'ava';
import avaRuleTester from 'eslint-ava-rule-tester';
import rule from '../rules/set-simplification';

const ruleTester = avaRuleTester(test, {
    env: {
        es6: true
    },
    parserOptions: {
        sourceType: 'module'
    }
});

ruleTester.run('set-simplification', rule, {
    valid: [
        'set(lensIndex(0), 1)',
        'set(__, 2)'
    ],
    invalid: [
        {
            code: 'set(lensProp(\'name\', \'Haskell\'))',
            errors: [{
                ruleId: 'set-simplification',
                message: '`set(lensProp(_))` should be simplified to `assoc(_)`'
            }]
        }
    ]
});
