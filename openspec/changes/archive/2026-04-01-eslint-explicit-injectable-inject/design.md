## Context

NestJS uses TypeScript's `emitDecoratorMetadata` to infer constructor parameter types for dependency injection. When this metadata is missing or incorrect (e.g., circular dependencies, interface injection, barrel file re-exports), NestJS silently fails to resolve the dependency, causing the application to hang at startup with no error.

Explicit `@Inject()` decorators bypass `emitDecoratorMetadata` entirely, making DI resolution deterministic and debuggable. This plugin enforces that pattern via static analysis at lint time.

We're building a greenfield ESLint plugin targeting ESLint 10 (flat config only, no eslintrc) with TypeScript-first tooling.

## Goals / Non-Goals

**Goals:**
- Catch missing `@Inject()` on constructor parameters of `@Injectable()` classes at lint time
- Support ESLint 10 flat config natively
- Ship a `recommended` config for zero-config adoption
- Provide clear error messages pointing to the exact parameter

**Non-Goals:**
- Supporting ESLint 9 or earlier
- Auto-fixing (adding `@Inject()` requires knowing the injection token, which is a design decision)
- Validating that the injection token is correct or resolvable
- Handling non-constructor injection (`@Inject()` on properties)
- Supporting JavaScript (TypeScript only)

## Decisions

### 1. Use `@typescript-eslint/utils` for rule authoring

`ESLintUtils.RuleCreator` and `TSESTree` provide type-safe AST node types and standard rule scaffolding. This is the canonical way to write TypeScript ESLint rules.

Alternative: Raw ESLint rule API. Rejected because we'd lose type safety on AST nodes and have to hand-roll the decorator node shapes.

### 2. AST traversal strategy: ClassDeclaration visitor with decorator checks

Visit `ClassDeclaration` nodes, check if the class has an `@Injectable()` decorator (from `@nestjs/common`), then inspect each constructor parameter for an `@Inject()` decorator.

The AST structure for decorators in typescript-eslint:
- `ClassDeclaration.decorators[]` contains `Decorator` nodes
- Each `Decorator.expression` is typically a `CallExpression` with `Identifier` callee
- Constructor is a `MethodDefinition` with `kind: "constructor"`
- Constructor params have `.decorators[]` array

### 3. Detect `@Injectable()` by decorator name, not import source

Check that the class has a decorator whose callee name is `Injectable`. We do NOT trace imports back to `@nestjs/common` because:
- It would require type-aware linting (`requiresTypeChecking: true`), making setup heavier
- In practice, no one names a decorator `Injectable` unless it's the NestJS one
- Keeps the rule fast and simple

### 4. Parameters that already have ANY decorator are exempt

If a parameter already has a decorator (like `@Inject()`, `@Optional()`, custom decorators), we skip it. The rule specifically targets bare, undecorated parameters.

Rationale: the goal is to force developers to be explicit. Any decorator is an explicit decision.

### 5. pnpm + TypeScript for project tooling

- pnpm: fast, strict, modern
- tsup: for building the package, ESM-only output
- ES2024 target
- No CJS output: ESLint 10 is ESM, typescript-eslint is ESM, NestJS projects are TypeScript/ESM

### 6. ESLint 10 only, flat config only

No compatibility shims for ESLint 9 or eslintrc. The plugin exports a flat config `recommended` preset directly.

## Risks / Trade-offs

**[False positives on parameter properties]** Constructor parameter properties (e.g., `private readonly foo: FooService`) without `@Inject()` will be flagged even though NestJS can sometimes resolve them via `emitDecoratorMetadata`. This is intentional: we want explicit `@Inject()` everywhere.

**[Decorator name collision]** Someone could have a custom `@Injectable()` decorator unrelated to NestJS. Low risk in practice, and can be addressed later with an option if needed.

**[No auto-fix]** Users must manually add `@Inject(Token)`. This is intentional because choosing the correct token is a design decision.
