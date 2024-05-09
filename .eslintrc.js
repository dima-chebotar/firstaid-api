module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    "@typescript-eslint/no-var-requires": "error",
    "@typescript-eslint/promise-function-async": "error",
    "@typescript-eslint/require-await": "error",
    "@typescript-eslint/prefer-for-of": "error",
    "@typescript-eslint/no-for-in-array": "error",
    "curly": "error",
    "no-console": "error",

    "no-debugger": "error",
    "no-duplicate-case": "error",
    "no-return-await": "error",
    "no-shadow": "error",
    "prefer-const": "error",
    // "object-curly-spacing": "error",
    "max-len": [ "error", { "code": 120 }],
    "quotes": [ "error", "single"],
    "semi-style": ["error", "last"],
    // "indent": ["error", "tab"]


  },
};

