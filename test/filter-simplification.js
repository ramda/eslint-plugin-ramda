import test from 'ava';
import avaRuleTester from 'eslint-ava-rule-tester';
import rule from '../rules/filter-simplification';

const ruleTester = avaRuleTester(test, {
    env: {
        es6: true
    },
    parserOptions: {
        sourceType: 'module'
    }
});

ruleTester.run('filter-simplification', rule, {
    valid: [
        'filter(condition)',
        'R.filter(predicate)',
        'R.filter(predicate, [])',
        'R.filter(predicate, data)',
        'const Ramda = require("ramda"), R = { filter: "foo" }; R.filter(Ramda.complement(predicate));',
        'const R = { filter: "foo", complement: "bar" }; R.filter(R.complement(predicate));',
        'const R = require("ramda"); function foo() { const R = require("not-ramda"); R.filter(R.complement(predicate)); }',
        'let window; window.R.filter(window.R.complement(predicate));',
        'let global; global.R.filter(global.R.complement(predicate));',
        'foo.R.filter(foo.R.complement(predicate));',
        'window.R().filter(window.R().complement(predicate));',
        'const R = require("ramda", "invalidSecondArg"); R.filter(R.complement(predicate));',
        'const R = require(basePath + "/ramda"); R.filter(R.complement(predicate));',
        'import { filter as something, complement } from "ramda"; something(complement(predicate));',
        'import { filter, complement } from "not-ramda"; filter(complement(predicate));',
        'import R from "not-ramda"; R.filter(R.complement(predicate));',
        'function foo(filter, complement) { filter(complement(predicate)); }',
        'const R = notRequire("ramda"); R.filter(R.complement(predicate));'
    ],
    invalid: [
        {
            code: 'const { filter, complement } = require("ramda"); filter(complement(even))',
            errors: [{
                ruleId: 'filter-simplification',
                message: '`filter(complement(_))` should be simplified to `reject(_)`'
            }]
        },
        {
            code: 'const { filter, complement } = require("ramda"); filter(complement(even), data)',
            errors: [{
                ruleId: 'filter-simplification',
                message: '`filter(complement(_))` should be simplified to `reject(_)`'
            }]
        },
        {
            code: 'const R = require("ramda"); R.filter(R.complement(predicate))',
            errors: [{
                ruleId: 'filter-simplification',
                message: '`filter(complement(_))` should be simplified to `reject(_)`',
                line: 1,
                column: 38
            }]
        },
        {
            code: 'const R = require("ramda"); R["filter"](R["complement"](predicate))',
            errors: [{
                ruleId: 'filter-simplification',
                message: '`filter(complement(_))` should be simplified to `reject(_)`',
                line: 1,
                column: 41
            }]
        },
        {
            code: [
                'const R = require("ramda");',
                'function foo() {',
                '    const R = require("not-ramda");',
                '    R.filter(R.complement(predicate));',
                '}',
                'R.filter(R.complement(predicate));'
            ].join('\n'),
            errors: [{
                ruleId: 'filter-simplification',
                message: '`filter(complement(_))` should be simplified to `reject(_)`',
                line: 6,
                column: 10
            }]
        },
        {
            code: [
                'const R = require("ramda");',
                'function foo() {',
                '    R.filter(R.complement(predicate));',
                '}',
                'R.filter(R.complement(predicate));'
            ].join('\n'),
            errors: [
                {
                    ruleId: 'filter-simplification',
                    message: '`filter(complement(_))` should be simplified to `reject(_)`',
                    line: 3,
                    column: 14
                },
                {
                    ruleId: 'filter-simplification',
                    message: '`filter(complement(_))` should be simplified to `reject(_)`',
                    line: 5,
                    column: 10
                }
            ]
        },
        {
            code: 'R.filter(R.complement(predicate));',
            errors: [{
                ruleId: 'filter-simplification',
                message: '`filter(complement(_))` should be simplified to `reject(_)`',
                line: 1,
                column: 10
            }]
        },
        {
            code: 'window.R.filter(window.R.complement(predicate));',
            errors: [{
                ruleId: 'filter-simplification',
                message: '`filter(complement(_))` should be simplified to `reject(_)`',
                line: 1,
                column: 17
            }]
        },
        {
            code: 'global.R.filter(global.R.complement(predicate));',
            errors: [{
                ruleId: 'filter-simplification',
                message: '`filter(complement(_))` should be simplified to `reject(_)`',
                line: 1,
                column: 17
            }]
        },
        {
            code: [
                'const R = require("ramda");',
                'const foo = R;',
                'const bar = foo;',
                'bar.filter(bar.complement(predicate));'
            ].join('\n'),
            errors: [{
                ruleId: 'filter-simplification',
                message: '`filter(complement(_))` should be simplified to `reject(_)`',
                line: 4,
                column: 12
            }]
        },
        {
            code: [
                'import R from "ramda";',
                'R.filter(R.complement(predicate));'
            ].join('\n'),
            errors: [{
                ruleId: 'filter-simplification',
                message: '`filter(complement(_))` should be simplified to `reject(_)`',
                line: 2,
                column: 10
            }]
        },
        {
            code: [
                'import Ramda from "ramda";',
                'Ramda.filter(Ramda.complement(predicate));'
            ].join('\n'),
            errors: [{
                ruleId: 'filter-simplification',
                message: '`filter(complement(_))` should be simplified to `reject(_)`',
                line: 2,
                column: 14
            }]
        },
        {
            code: [
                'import { filter, complement } from "ramda";',
                'filter(complement(predicate));'
            ].join('\n'),
            errors: [{
                ruleId: 'filter-simplification',
                message: '`filter(complement(_))` should be simplified to `reject(_)`',
                line: 2,
                column: 8
            }]
        },
        {
            code: [
                'import { filter, complement } from "ramda";',
                'function foo() {',
                '    let filter, complement;',
                '    filter(complement(predicate));',
                '}',
                'filter(complement(predicate));'
            ].join('\n'),
            errors: [{
                ruleId: 'filter-simplification',
                message: '`filter(complement(_))` should be simplified to `reject(_)`',
                line: 6,
                column: 8
            }]
        }
    ]
});
