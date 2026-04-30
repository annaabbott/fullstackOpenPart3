import globals from "globals";
import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";

export default defineConfig([
  js.configs.recommended,
  stylistic.configs["flat/recommended"],
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: { globals: globals.node },
    rules: {
      "stylistic/indent": ["error", 2],
      "stylistic/quotes": ["error", "double"],
      "stylistic/semi": ["error", "always"],
      "no-trailing-spaces": "error",
      "object-curly-spacing": ["error", "always"],
      "arrow-spacing": ["error", { before: true, after: true }],
      "no-console": "off",
    },
    ignores: ["node_modules", "dist"],
  },
]);
