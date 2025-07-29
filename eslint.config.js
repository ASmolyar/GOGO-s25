const {
    defineConfig,
} = require("eslint/config");

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
        "no-console": "off",
        "@typescript-eslint/no-unused-vars": ["warn"],
        "import/no-extraneous-dependencies": 2,

        "prettier/prettier": ["error", {
            endOfLine: "auto",
        }],
    },
}]);
