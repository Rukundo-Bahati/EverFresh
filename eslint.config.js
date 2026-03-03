// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = {
  settings: {
    "import/resolver": {
      node: {
        paths: ["app"],
        extensions: [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  },
};
