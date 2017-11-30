import test from 'ava';
import avaRuleTester from 'eslint-ava-rule-tester';
import rule from '../rules/compose-pipe-style';

const ruleTester = avaRuleTester(test, {
    env: {
        es6: true
    },
    parserOptions: {
        sourceType: 'module'
    }
});

const error = {
    compose: {
        ruleId: 'compose-pipe-style',
        message: 'Prefer `pipe` over `compose` for multiline expression'
    },
    pipe: {
        ruleId: 'compose-pipe-style',
        message: 'Prefer `compose` over `pipe` for single line expression'
    }
};

ruleTester.run('compose-pipe-style', rule, {
    valid: [
        'compose(a, b, c)',
        'R.compose(a, b, c)',
        'pipe(\na,\nb,\nc\n)',
        'R.pipe(\na,\nb,\nc\n)',
        'pipe(\na, b, c)', // not stylish but can be handled with function-paren-newline
        'pipe(a, b, c\n)' // not stylish but can be handled with function-paren-newline
    ],
    invalid: [
        {
            code: 'compose(\na,\nb,\nc\n)',
            errors: [error.compose]
        },
        {
            code: 'R.compose(\na,\nb,\nc)',
            errors: [error.compose]
        },
        {
            code: 'compose(\na, b, c\n)',
            errors: [error.compose]
        },
        {
            code: 'pipe(a, b, c)',
            errors: [error.pipe]
        },
        {
            code: 'R.pipe(a, b, c)',
            errors: [error.pipe]
        }
    ]
});
