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
    prop: {
        ruleId: 'map-simplification',
        message: '`map(prop(_))` should be simplified to `pluck(_)`'
    },
    project: {
        ruleId: 'map-simplification',
        message: '`map(pickAll(_))` should be simplified to `project(_)`'
    }
};

ruleTester.run('map-simplification', rule, {
    valid: [
        'map(transformer, list)',
        'map(doubleMe, [1, 2, 3])',
        'R.map(transformer, list)',
        'R.map(R.inc, [1, 2, 3])',
        'project([\'name\', \'age\'])',
        'map(prop(__, {}))',
        'map(pickAll(__, items))'
    ],
    invalid: [
        {
            code: 'map(prop(\'name\'))',
            errors: [error.prop]
        },
        {
            code: 'R.map(R.prop(\'name\'))',
            errors: [error.prop]
        },
        {
            code: 'map(R.prop(\'name\'))',
            errors: [error.prop]
        },
        {
            code: 'map(R.pickAll(values))',
            errors: [error.project]
        },
        {
            code: 'R.map(R.pickAll([]))',
            errors: [error.project]
        },
        {
            code: 'R[\'map\'](pickAll([]))',
            errors: [error.project]
        }
    ]
});
