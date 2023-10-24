module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: [
    'standard',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 11,
  },
  rules: {
    semi: [1, 'always'],
    'comma-dangle': [1, 'always-multiline'],
    'object-curly-newline': ['error', {
      ObjectPattern: {
        minProperties: 4,
      },
    }],
  },
};
