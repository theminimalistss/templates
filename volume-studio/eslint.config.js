import js from "@eslint/js";
import ts from "typescript-eslint";
import hooks from "eslint-plugin-react-hooks";
import a11y from "eslint-plugin-jsx-a11y";
import globals from "globals";
export default ts.config(
  {
    ignores: [
      "dist/**",
      "dist-server/**",
      "node_modules/**",
      "coverage/**",
      "playwright-report/**",
      "test-results/**",
      ".cache/**",
    ],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    plugins: { "react-hooks": hooks, "jsx-a11y": a11y },
    rules: {
      ...hooks.configs.recommended.rules,
      ...a11y.configs.recommended.rules,
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/refs": "off",
    },
  },
  {
    files: ["src/ui/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/repositories/**", "**/services/**"],
              message:
                "UI consumes domain hooks; preserve repository → service → hooks → UI.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/hooks/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/repositories/**"],
              message: "Hooks consume services, not repositories.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["**/*.mjs", "**/*.js"],
    languageOptions: { globals: globals.node },
  },
);
