import test from 'ava';
import avaRuleTester from 'eslint-ava-rule-tester';
import rule from '../rules/if-else-simplification';

const ruleTester = avaRuleTester(test, {
    env: {
        es6: true
    },
    parserOptions: {
        sourceType: 'module'
    }
});

const error = {
    when: {
        ruleId: 'if-else-simplification',
        message: '`ifElse(_, _, identity)` should be simplified to `when(_, _)`'
    },
    unless: {
        ruleId: 'if-else-simplification',
        message: '`ifElse(_, identity, _)` should be simplified to `unless(_, _)`'
    }
};

ruleTester.run('if-else-simplification', rule, {
    valid: [
        'ifElse(condition, whenTrue, whenFalse)',
        'ifElse(condition)',
        'R.ifElse(condition, whenTrue, whenFalse)',
        'R.ifElse(condition)'
    ],
    invalid: [
        {
            code: 'ifElse(condition, action, identity)',
            errors: [error.when]
        },
        {
            code: 'ifElse(condition, identity, action)',
            errors: [error.unless]
        },
        {
            code: 'ifElse(condition, identity, identity)',
            errors: [error.unless, error.when]
        },
        {
            code: 'R.ifElse(condition, action, R.identity)',
            errors: [error.when]
        },
        {
            code: 'R.ifElse(condition, action, identity)',
            errors: [error.when]
        },
        {
            code: 'R.ifElse(condition, R.identity, action)',
            errors: [error.unless]
        },
        {
            code: 'R.ifElse(condition, identity, action)',
            errors: [error.unless]
        },
        {
            code: 'R.ifElse(condition, R.identity, identity)',
            errors: [error.unless, error.when]
        }
    ]
});
