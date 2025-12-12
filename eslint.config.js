import { FlatCompat } from "@eslint/eslintrc";

// FlatCompat converts classic `.eslintrc` style configs to flat config
const compat = new FlatCompat({
  baseDirectory: new URL(".", import.meta.url).pathname,
});

export default [
  // Top-level ignores (replaces globalIgnores)
  {
    ignores: ["dist", "build", "node_modules"],
  },

  // Convert classic configs into flat config
  ...compat.config({
    extends: [
      "plugin:react/recommended",
      "plugin:react-hooks/recommended",
      "plugin:@typescript-eslint/recommended"
    ],
  }),

  // Files-specific overrides
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: new URL(".", import.meta.url).pathname,
      },
    },
    rules: {
      // example overrides
      "react/prop-types": "off", // TypeScript handles props
      "@typescript-eslint/explicit-function-return-type": "off",
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
];
