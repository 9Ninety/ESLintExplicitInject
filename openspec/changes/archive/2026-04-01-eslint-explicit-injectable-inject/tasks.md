## 1. Project Setup

- [x] 1.1 Initialize pnpm project with `package.json` (name: `eslint-plugin-explicit-inject`, type: module, ESLint 10 + typescript-eslint as peer deps, tsup + typescript as dev deps)
- [x] 1.2 Create `tsconfig.json` targeting ES2024, strict mode, ESM module resolution
- [x] 1.3 Create `tsup.config.ts` for ESM-only build from `src/index.ts`
- [x] 1.4 Install dependencies with pnpm

## 2. Rule Implementation

- [x] 2.1 Create `src/rules/require-inject-decorator.ts` implementing the rule: visit ClassDeclaration, check for @Injectable decorator, report undecorated constructor parameters with `missingInject` message ID
- [x] 2.2 Create `src/index.ts` plugin entry point exporting `meta` (name, version), `rules`, and `configs.recommended` (targets `**/*.ts`, sets parser, enables rule at error)

## 3. Build & Manual Verify

- [x] 3.1 Build with tsup and verify output
- [x] 3.2 Create a sample `.ts` file with test cases and run ESLint against it to manually verify the rule works
