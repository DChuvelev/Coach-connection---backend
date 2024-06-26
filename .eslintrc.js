module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["standard-with-typescript", "prettier"],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "@typescript-eslint/no-misused-promises": "off",
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "variable",
        format: ["camelCase", "UPPER_CASE", "PascalCase"],
        filter: {
          regex: "^__v$", // Allow variables named __v
          match: false,
        },
        leadingUnderscore: "allow", // Allow leading underscores
      },
    ],
  },
  ignorePatterns: ["dist", ".eslintrc.js"],
  plugins: ["prettier"],
};
