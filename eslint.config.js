// ESLint configuration for Constructor Manager monorepo
const path = require('path');

module.exports = {
  root: true,
  overrides: [
    {
      files: ["server/**/*.ts", "server/**/*.tsx"],
      extends: [
        "eslint:recommended",
        "@typescript-eslint/recommended"
      ],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module"
      },
      plugins: [
        "@typescript-eslint",
        "import"
      ],
      settings: {
        "import/resolver": {
          typescript: {
            alwaysTryTypes: true,
            project: ["./server/tsconfig.json"]
          }
        }
      },
      rules: {
        // Core TypeScript rules
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": ["warn", { "fixToUnknown": true }],
        "@typescript-eslint/consistent-type-imports": ["error", { "prefer": "type-imports", "fixStyle": "inline-type-imports" }],
        "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
        
        // Custom architectural rules
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
        
        // Prevent repository usage in read models (application layer queries)
        "no-restricted-imports": [
          "error",
          {
            "paths": [
              {
                "name": "./server/src/modules/*/application/*",
                "importNames": [],
                "message": "Application layer use cases (read) should not import repository"
              }
            ]
          }
        ],
        
        // Custom rules from our tools
        "constructor-manager/no-cross-module-imports": "error",
        "constructor-manager/no-repository-in-read-model": "error",
        "constructor-manager/no-unitofwork-in-read-model": "error",
        "constructor-manager/require-input-output-types": "error",
        "constructor-manager/repository-method-naming": "error",
        "constructor-manager/no-process-env": "error",
        "constructor-manager/domain-service-no-side-effect": "warn"
      }
    },
    {
      files: ["client/**/*.ts", "client/**/*.tsx"],
      extends: [
        "eslint:recommended",
        "@typescript-eslint/recommended",
        "plugin:react/recommended",
        "plugin:react/jsx-runtime"
      ],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true
        }
      },
      plugins: [
        "@typescript-eslint",
        "react",
        "react-hooks"
      ],
      settings: {
        "import/resolver": {
          typescript: {
            alwaysTryTypes: true,
            project: ["./client/tsconfig.json"]
          }
        },
        "react": {
          version: "detect"
        }
      },
      rules: {
        // Core TypeScript rules
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": ["warn", { "fixToUnknown": true }],
        "@typescript-eslint/consistent-type-imports": ["error", { "prefer": "type-imports", "fixStyle": "inline-type-imports" }],
        "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
        
        // React rules
        "react/react-in-jsx-scope": "off",
        "react/prop-types": "off",
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn"
      }
    }
  ]
};