import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    languageOptions: {
      globals: {
        ...globals.node, // Keep Node.js globals
        ...globals.browser, // Add browser globals
      },
    },
  },
  pluginJs.configs.recommended,
];
