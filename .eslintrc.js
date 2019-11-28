module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
    "prettier"
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    "import/extensions": "off",
    "no-console": "off",
    "no-useless-constructor": "off",
    "@typescript-eslint/no-useless-constructor": "error",
    "no-param-reassign": [0],
    "no-underscore-dangle":[0],
    "no-use-before-define": [0],
    "no-unused-vars": [0],
    "class-methods-use-this": [0],
    "max-classes-per-file": 'off',
    "camelcase":[0],
    "max-len": ["error", { "code": 200 }],
    "radix": [0],
    "no-plusplus":[0],
    "import/no-unresolved": 'off'
  },
  "settings": {
    "import/resolver": {
      "node": {
        "extensions": [".js",".ts",]
      }
    }
};
