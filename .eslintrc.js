const sharedRules = {
  'consistent-return': 0,
  'no-underscore-dangle': 0,
  'import/prefer-default-export': 0,
  'import/extensions': ['error', 'never', { json: 'always' }],
  'func-names': 0,
  'no-param-reassign': 0,
  'prefer-destructuring': ['error', { object: true, array: false }],
  'max-classes-per-file': 0,
  'no-plusplus': 0,
  'sonarjs/cognitive-complexity': 0,
  'sonarjs/no-collapsible-if': 0,
  'sonarjs/no-duplicate-string': 0,
  'sonarjs/no-identical-functions': 0,
};

const settings = {
  'import/resolver': {
    node: { extensions: ['.js', '.ts'] },
  },
};

module.exports = {
  root: true,
  plugins: ['prettier', 'chai-friendly'],
  extends: [
    'airbnb-base',
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:sonarjs/recommended',
    'plugin:chai-friendly/recommended',
  ],
  parser: 'babel-eslint',
  env: {
    es6: true,
    browser: true,
    commonjs: true,
    mocha: true,
  },
  globals: {
    process: true,
  },
  settings,
  rules: sharedRules,
  overrides: [
    {
      files: ['**/*.ts'],
      plugins: ['prettier', '@typescript-eslint', 'typescript-sort-keys'],
      extends: [
        'airbnb-base',
        'eslint:recommended',
        'plugin:prettier/recommended',
        'prettier',
        'plugin:@typescript-eslint/recommended',
        'plugin:sonarjs/recommended',
      ],
      parser: '@typescript-eslint/parser',
      settings,
      rules: {
        ...sharedRules,
        camelcase: 0,
        'lines-between-class-members': 0,
        '@typescript-eslint/explicit-module-boundary-types': 0,
        '@typescript-eslint/ban-ts-comment': 0,
        'no-useless-constructor': 0,
        '@typescript-eslint/triple-slash-reference': 0,
        'typescript-sort-keys/interface': [
          'error',
          'asc',
          { caseSensitive: false, natural: true, requiredFirst: true },
        ],
        'typescript-sort-keys/string-enum': ['error', 'asc', { caseSensitive: false, natural: true }],
      },
    },
  ],
};
