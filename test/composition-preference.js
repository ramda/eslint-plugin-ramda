import test from 'ava';
import avaRuleTester from 'eslint-ava-rule-tester';
import dedent from 'dedent';
import rule from '../rules/composition-preference';

const ruleTester = avaRuleTester(test, {
    env: {
        es6: true,
    },
    parserOptions: {
        sourceType: 'module',
    },
});

const error = {
    pipeSingle: {
        ruleId: 'composition-preference',
        message: 'Prefer `pipe` over `compose` for single line expression',
    },
    composeSingle: {
        ruleId: 'composition-preference',
        message: 'Prefer `compose` over `pipe` for single line expression',
    },
    pipeMulti: {
        ruleId: 'composition-preference',
        message: 'Prefer `pipe` over `compose` for multiline expression',
    },
    composeMulti: {
        ruleId: 'composition-preference',
        message: 'Prefer `compose` over `pipe` for multiline expression',
    },
};

ruleTester.run('composition-preference', rule, {
    valid: [
        {
            code: 'R.compose(e, d, c, b, a => a * 2)',
            options: [{ singleLine: 'compose' }],
        },
        {
            code: 'compose(c, b)',
            options: [{ singleLine: 'compose' }],
        },
        {
            code: 'R.pipe(a => a * 2, b, c)',
            options: [{ singleLine: 'pipe' }],
        },
        {
            code: 'pipe(a => a * 2, b)',
            options: [{ singleLine: 'pipe' }],
        },
        {
            code: dedent`
                R.compose(
                    d, // sample
                    c,
                    b => b / 10,
                    a => a * 2
                )
            `,
            options: [{ multiline: 'compose' }],
        },
        {
            code: dedent`
                compose(
                    anotherFn,
                    a => a * 2
                )
            `,
            options: [{ multiline: 'compose' }],
        },
        {
            code: dedent`
                R.pipe(
                    a => a * 2,
                    b => b / 10,
                    c,
                    d // sample
                )
            `,
            options: [{ multiline: 'pipe' }],
        },
        {
            code: dedent`
                pipe(
                    a => a * 2,
                    anotherFn
                )
            `,
            options: [{ multiline: 'pipe' }],
        },
        {
            code: 'add(1, pipe(a => a * 2, anotherFn))',
            options: [{ singleLine: 'pipe' }],
        },
    ],
    invalid: [
        {
            code: 'compose(c, b, a)',
            options: [{ singleLine: 'pipe' }],
            errors: [error.pipeSingle],
            output: 'pipe(a, b, c)',
        },
        {
            code: 'R.compose(e, d, c, b, a => a * 2)',
            options: [{ singleLine: 'pipe' }],
            errors: [error.pipeSingle],
            output: 'R.pipe(a => a * 2, b, c, d, e)',
        },
        {
            code: 'pipe(a, b, c)',
            options: [{ singleLine: 'compose' }],
            errors: [error.composeSingle],
            output: 'compose(c, b, a)',
        },
        {
            code: 'R.pipe(a => a * 2, b, c, d, e)',
            options: [{ singleLine: 'compose' }],
            errors: [error.composeSingle],
            output: 'R.compose(e, d, c, b, a => a * 2)',
        },
        {
            code: dedent`
                R.compose(
                    d, // sample
                    c,
                    // comment for b => b /10
                    b => b / 10,
                    /**
                     * Some explanation
                     */
                    a => a * 2
                )
            `,
            options: [{ multiline: 'pipe' }],
            errors: [error.pipeMulti],
            output: dedent`
                R.pipe(
                    /**
                     * Some explanation
                     */
                    a => a * 2,
                    // comment for b => b /10
                    b => b / 10,
                    c,
                    d // sample
                )
            `,
        },
        {
            code: dedent`
                compose(
                    anotherFn, /* comment b */
                    a => a * 2 // comment a
                )
            `,
            options: [{ multiline: 'pipe' }],
            errors: [error.pipeMulti],
            output: dedent`
                pipe(
                    a => a * 2, // comment a
                    anotherFn /* comment b */
                )
            `,
        },
        {
            code: dedent`
                R.pipe(
                    /**
                     * Some explanation
                     */
                    a => a * 2,
                    // comment for b => b /10
                    b => b / 10,
                    c,
                    d // sample
                )
            `,
            options: [{ multiline: 'compose' }],
            errors: [error.composeMulti],
            output: dedent`
                R.compose(
                    d, // sample
                    c,
                    // comment for b => b /10
                    b => b / 10,
                    /**
                     * Some explanation
                     */
                    a => a * 2
                )
            `,
        },
        {
            code: dedent`
                pipe(
                    a => a * 2, // comment a
                    anotherFn /* comment b */
                )
            `,
            options: [{ multiline: 'compose' }],
            errors: [error.composeMulti],
            output: dedent`
                compose(
                    anotherFn, /* comment b */
                    a => a * 2 // comment a
                )
            `,
        },
    ]
});
