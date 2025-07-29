const {
    defineConfig,
} = require("eslint/config");

const globals = require("globals");
const js = require("@eslint/js");

const {
    FlatCompat,
} = require("@eslint/eslintrc");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

module.exports = defineConfig([{
    extends: compat.extends("airbnb-typescript-prettier"),

    rules: {
        "react/require-default-props": 0,
        "no-console": "warn",
        "@typescript-eslint/no-unused-vars": ["warn"],

        "import/no-extraneous-dependencies": ["error", {
            devDependencies: true,
        }],

        "prettier/prettier": ["error", {
            endOfLine: "auto",
        }],

        "import/extensions": [0, {
            tsx: "always",
        }, {
                ts: "always",
            }],
    },

    languageOptions: {
        globals: Object.fromEntries(
            Object.entries(globals.browser).map(([key, value]) => [key.trim(), value])
        ),
    },
}]);
