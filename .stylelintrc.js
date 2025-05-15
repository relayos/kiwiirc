module.exports = {
    extends: ['stylelint-config-standard', 'stylelint-config-recommended-vue'],
    overrides: [
        {
            files: ['**/*.html'],
            customSyntax: 'postcss-html',
        },
        {
            files: ['**/*.scss'],
            customSyntax: 'postcss-scss',
        },
    ],
    rules: {
        'alpha-value-notation': null,
        'at-rule-empty-line-before': null,
        'at-rule-no-unknown': [
            true,
            {
                ignoreAtRules: [
                    'mixin',
                    'include',
                    'extend',
                    'if',
                    'else',
                    'for',
                    'each',
                    'while',
                    'use',
                    'forward',
                    'function',
                    'return',
                    'content'
                ]
            }
        ],
        'color-function-notation': null,
        'color-hex-case': null,
        'color-hex-length': null,
        'declaration-empty-line-before': null,
        'declaration-no-important': true,
        'function-no-unknown': null,
        'import-notation': null,
        'indentation': 4,
        'max-line-length': null,
        'no-descending-specificity': null,
        'no-empty-first-line': null,
        'property-no-vendor-prefix': null,
        'selector-class-pattern': null,
        'shorthand-property-no-redundant-values': null,
        'string-quotes': null,
        'value-keyword-case': null,
    },
};
