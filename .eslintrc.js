module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: "babel-eslint",
    ecmaVersion: 2020,
  },
  extends: [
    "eslint:recommended",
    "airbnb-base",
  ],
  ignorePatterns: [
    "dist/**/*", // Ignore built files.
    "functions/test/*",
  ],
  rules: {
    quotes: ["error", "double"],
    "no-restricted-syntax": "off",
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "max-len": ["warn", { code: 100, ignoreStrings: true }],
    "prefer-const": "warn",
  },
};
