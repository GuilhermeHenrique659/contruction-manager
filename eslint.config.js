import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

export default [
  {
    ignores: ["node_modules/", "dist/", "client/dist/", "**/*.d.ts"]
  },
  {
    files: ["server/**/*.ts", "server/**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module"
      }
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "import": importPlugin
    },
    rules: {
      "indent": ["error", 4],
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": ["warn", { "fixToUnknown": true }],
      "@typescript-eslint/consistent-type-imports": ["error", { "prefer": "type-imports", "fixStyle": "inline-type-imports" }],
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "import/no-restricted-paths": [
        "error",
        {
          "zones": [
            {
              "target": "./server/src/modules/*/domain/",
              "from": "./server/src/modules/*/domain/",
              "message": "Domain modules cannot import from other domain modules"
            },
            {
              "target": "./server/src/modules/*/repository/",
              "from": "./server/src/modules/*/repository/",
              "message": "Repository modules cannot import from other repository modules"
            }
          ]
        }
      ],
      "no-restricted-imports": [
        "error",
        {
          "paths": [
            {
              "name": "./server/src/modules/*/application/*",
              "message": "Application layer use cases (read) should not import repository"
            }
          ]
        }
      ],

    }
  },
  {
    files: ["client/**/*.ts", "client/**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        ecmaFeatures: { jsx: true }
      }
    },
    plugins: {
      "react": reactPlugin,
      "react-hooks": reactHooksPlugin
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn"
    }
  }
];
