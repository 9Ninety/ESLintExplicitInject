import type { TSESLint } from "@typescript-eslint/utils";
import { requireInjectDecorator } from "./rules/require-inject-decorator.js";

interface PluginConfig {
  name?: string;
  files?: string[];
  plugins?: Record<string, unknown>;
  rules?: Record<string, unknown>;
}

const plugin = {
  meta: {
    name: "eslint-plugin-explicit-inject",
    version: "1.1.3",
  },
  rules: {
    "require-inject-decorator": requireInjectDecorator,
  },
  configs: {} as Record<string, PluginConfig>,
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
