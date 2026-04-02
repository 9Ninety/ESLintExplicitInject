import tseslint from "typescript-eslint";
import plugin from "./dist/index.js";

export default tseslint.config(
  ...tseslint.configs.recommended,
  plugin.configs.recommended,
);
