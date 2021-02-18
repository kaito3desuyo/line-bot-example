module.exports = {
    extends: ['eslint:recommended', 'prettier'],
    env: {
        node: true,
    },
    overrides: [
        {
            files: ['*.js'],
            parser: '@babel/eslint-parser',
            rules: {
                '@babel/new-cap': 'error',
                '@babel/no-invalid-this': 'error',
                '@babel/no-unused-expressions': 'error',
                '@babel/object-curly-spacing': 'error',
                '@babel/semi': 'error',
            },
            plugins: ['@babel'],
        },
        {
            files: ['**/*.test.ts'],
            env: {
                jest: true,
            },
        },
        {
            files: ['*.ts'],
            parser: '@typescript-eslint/parser',
            extends: [
                'eslint:recommended',
                'plugin:@typescript-eslint/eslint-recommended',
                'plugin:@typescript-eslint/recommended',
                'prettier',
                'prettier/@typescript-eslint',
            ],
            plugins: ['import', '@typescript-eslint'],
        },
    ],
};
