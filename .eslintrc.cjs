module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime" // Add this for React 17+ JSX transform
  ],
  settings: {
    react: {
      version: "detect", // Automatically detect React version
    },
  },
  rules: {
    "react/react-in-jsx-scope": "off", // Disable rule requiring 'React' in scope
  },
};
