module.exports = {
  parser: "@babel/eslint-parser",  // Use Babel parser
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true  // Enable JSX support
    },
    requireConfigFile: false  // This avoids needing a separate Babel config
  },
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended",
    "airbnb"
  ],
  rules: {
    "react/react-in-jsx-scope": "off" // Next.js/React 17+ doesn’t require importing React
  },
  settings: {
    react: {
      version: "detect"  // Automatically detect React version
    }
  }
};
