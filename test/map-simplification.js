import test from 'ava';
import avaRuleTester from 'eslint-ava-rule-tester';
import rule from '../rules/map-simplification';

const ruleTester = avaRuleTester(test, {
    env: {
        es6: true
    },
    parserOptions: {
        sourceType: 'module'
    }
});

const error = {
    ruleId: 'map-simplification',
    message: '`map(prop(_))` should be simplified to `pluck(_)`'
};

ruleTester.run('map-simplification', rule, {
    valid: [
        'map(transformer, list)',
        'map(doubleMe, [1, 2, 3])',
        'R.map(transformer, list)',
        'R.map(R.inc, [1, 2, 3])'
    ],
    invalid: [
        {
            code: 'map(prop(\'name\'))',
            errors: [error]
        },
        {
            code: 'R.map(R.prop(\'name\'))',
            errors: [error]
        },
        {
            code: 'map(R.prop(\'name\'))',
            errors: [error]
        }
    ]
});
