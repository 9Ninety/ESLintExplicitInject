## Why

NestJS silently fails when `@Injectable` classes have constructor parameters without explicit `@Inject()` decorators. The DI container can't resolve the dependency, causing the application to hang indefinitely with no error message. This just cost us days of debugging.

An ESLint rule that statically catches missing `@Inject()` on constructor parameters of `@Injectable()` classes eliminates this class of bugs at lint time.

## What Changes

- New ESLint plugin package `eslint-plugin-explicit-inject` built for ESLint 10 flat config
- Single rule `require-inject-decorator` that reports an error when any constructor parameter of an `@Injectable()` class lacks an `@Inject()` decorator
- Ships with a `recommended` config preset for easy adoption
- TypeScript-first: uses `@typescript-eslint/utils` for AST traversal and rule creation
- Built with pnpm, vitest for testing

## Capabilities

### New Capabilities
- `require-inject-decorator`: ESLint rule that enforces explicit `@Inject()` on all constructor parameters within `@Injectable()` decorated classes

### Modified Capabilities

## Impact

- New npm package to publish and maintain
- Requires `@typescript-eslint/parser` and `@typescript-eslint/utils` as peer dependencies
- Users add it to their ESLint flat config alongside their existing typescript-eslint setup
