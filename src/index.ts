import type { TSESLint } from "@typescript-eslint/utils";
import { requireInjectDecorator } from "./rules/require-inject-decorator.js";

const plugin = {
  meta: {
    name: "eslint-plugin-explicit-inject",
    version: "0.1.0",
  },
  rules: {
    "require-inject-decorator": requireInjectDecorator,
  },
  configs: {} as Record<string, TSESLint.FlatConfig.Config>,
};

plugin.configs.recommended = {
  plugins: {
    "explicit-inject": plugin,
  },
  files: ["**/*.ts"],
  rules: {
    "explicit-inject/require-inject-decorator": "error",
  },
};

export default plugin;
