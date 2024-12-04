import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";

export default [
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      globals: { browser: true },
    },
    plugins: { "@typescript-eslint": ts, react },
    rules: {
      ...ts.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
    },
  },
];
