import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    languageOptions: {
      globals: { ...globals.browser, process: true }, // Add process as a global
    },
  },
  pluginJs.configs.recommended,
];
