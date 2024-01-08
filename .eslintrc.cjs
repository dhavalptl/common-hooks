module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
  ],
  overrides: [
    {
      files: ["*.js"],
      extends: ["plugin:@typescript-eslint/disable-type-checked"],
    },
    {
      files: ["**/*.test.tsx"],
      env: {
        "jest/globals": true,
      },
      plugins: ["jest", "jest-dom"],
      extends: ["plugin:jest/recommended", "plugin:jest-dom/recommended"],
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
  plugins: ["react", "react-hooks", "@typescript-eslint"],
  settings: {
    jest: {
      version: require("jest/package.json").version,
    },
    react: {
      version: "detect",
    },
  },
  root: true
};
