import globals from "globals";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "script",
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      "no-unused-vars": ["error", { 
        argsIgnorePattern: "^(next|req|res|err)$" 
      }],
    },
  },
  // Add this for test files
  {
    files: ["test/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.mocha,  // Adds describe, it, before, etc.
      },
    },
  },
];