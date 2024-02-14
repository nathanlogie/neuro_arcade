module.exports = {
    root: true,
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: {
            jsx: true
        }
    },
    settings: {
        react: {
            version: "detect"
        }
    },
    env: {
        jest: true,
        browser: true,
        amd: true,
        node: true
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:prettier/recommended" //Makes sure prettier config overrules
    ],
    rules: {
        "no-unused-vars": ["error", {vars: "all", args: "after-used", ignoreRestSiblings: false}],
        "prettier/prettier": ["error", {}, {usePrettierrc: true}],
        "react/prop-types": 0
    }
};
