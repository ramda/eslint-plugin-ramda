import test from 'ava';
import avaRuleTester from 'eslint-ava-rule-tester';
import rule from '../rules/eq-by-simplification';

const ruleTester = avaRuleTester(test, {
    env: {
        es6: true
    },
    parserOptions: {
        sourceType: 'module'
    }
});

const error = {
    ruleId: 'eq-by-simplification',
    message: '`eqBy(prop(_))` should be simplified to `eqProps(_)`'
};

ruleTester.run('filter-simplification', rule, {
    valid: [
        'eqBy(trim, \'\')',
        'R.eqBy(R.pluck(key))',
        'eqBy(prop(\'name\', namedObj))'
    ],
    invalid: [
        {
            code: 'eqBy(prop(\'a\'))',
            errors: [error]
        },
        {
            code: 'R.eqBy(R.prop(\'b\'), value)',
            errors: [error]
        }
    ]
});
