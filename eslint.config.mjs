import globals from "globals";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "script",  // Use "script" for CommonJS (require/module.exports)
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
];