## Why

The rule currently only checks `@Injectable()` classes, but NestJS (and other DI frameworks) have multiple decorators that participate in constructor injection: `@Controller()`, `@Module()`, `@Resolver()`, etc. Users need to configure which class decorators trigger the "missing @Inject()" check, rather than being locked to a hardcoded `Injectable`.

## What Changes

- Add a `decorators` option (string array) to the `require-inject-decorator` rule schema, defaulting to `["Injectable"]` for backwards compatibility
- The rule checks if the class has ANY of the configured decorators before inspecting constructor parameters
- Error messages include the matched decorator name (e.g., "in @Controller class" instead of always "in @Injectable class")
- No changes to the recommended config (default covers current behavior)

## Capabilities

### New Capabilities

### Modified Capabilities
- `require-inject-decorator`: Add configurable `decorators` option to control which class decorators trigger the rule, and update error message to reference the matched decorator

## Impact

- `src/rules/require-inject-decorator.ts`: schema, defaultOptions, create() logic, message template
- `openspec/specs/require-inject-decorator/spec.md`: new requirements for the option
- `README.md`: document the new option
- Fully backwards compatible: no options = same behavior as before
