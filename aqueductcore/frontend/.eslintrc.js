module.exports = {
  env: {
    node: true,
    browser: true,
    es2021: true,
    "jest/globals": true
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint", "jest"],
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/no-unescaped-entities": "off",
    "@typescript-eslint/no-non-null-assertion": "off"
  },
  "overrides": [
    {
      "files": [
        "**/*.stories.*"
      ],
      "rules": {
        "import/no-anonymous-default-export": "off"
      }
    }
  ]
};
