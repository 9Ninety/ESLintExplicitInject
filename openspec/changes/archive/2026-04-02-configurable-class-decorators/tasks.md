## 1. Rule Schema & Options

- [x] 1.1 Add `decorators` option to rule schema in `src/rules/require-inject-decorator.ts`: object with `decorators` string array property, `minItems: 1`, `uniqueItems: true`
- [x] 1.2 Set `defaultOptions` to `[{ decorators: ["Injectable"] }]` and read `options[0].decorators` in `create()`

## 2. Core Logic

- [x] 2.1 Replace the single `hasDecorator(node.decorators, "Injectable")` check with a loop over configured decorators, finding the first match
- [x] 2.2 Update the `missingInject` message template to include `{{ decorator }}` placeholder and pass the matched decorator name in `context.report()` data

## 3. Test & Verify

- [x] 3.1 Add test cases to `test-sample/sample.ts`: `@Controller()` class that should error when configured, and verify default config still only catches `@Injectable()`
- [x] 3.2 Build and run `pnpm lint:sample` to verify backwards compatibility (default only catches Injectable)
- [x] 3.3 Update `README.md` with configuration example showing `decorators` option

## 4. Spec Alignment

- [x] 4.1 Update `openspec/specs/require-inject-decorator/spec.md` with the new and modified requirements from the delta spec
