# eslint-plugin-explicit-inject

ESLint rule that enforces explicit `@Inject()` on constructor parameters of DI-decorated classes.

## Setup

```bash
pnpm add -D eslint-plugin-explicit-inject
```

In your `eslint.config.js`:

```js
import explicitInjectPlugin from "eslint-plugin-explicit-inject";

export default [
  explicitInjectPlugin.configs.recommended,
  // ...your other configs
];
```

## What it catches

```ts
// Bad - will be flagged
@Injectable()
class MyService {
  constructor(private fooService: FooService) {}
}

// Good
@Injectable()
class MyService {
  constructor(@Inject(FooService) private fooService: FooService) {}
}
```

Any decorator on a parameter counts as explicit (not just `@Inject`), so `@Optional()`, `@Inject()`, custom decorators all pass.

By default, only `@Injectable()` classes are checked.

## Configuration

The rule accepts a `decorators` option to specify which class decorators trigger the check. This is useful for NestJS projects where `@Controller()`, `@Resolver()`, and other decorators also use constructor injection:

```js
import explicitInjectPlugin from "eslint-plugin-explicit-inject";

export default [
  {
    ...explicitInjectPlugin.configs.recommended,
    rules: {
      "explicit-inject/require-inject-decorator": ["error", {
        decorators: ["Injectable", "Controller", "Resolver"]
      }]
    }
  }
];
```

When no `decorators` option is provided, it defaults to `["Injectable"]`.

## Local development

```bash
pnpm install
pnpm build
pnpm lint:sample   # runs the rule against test-sample/
```

To test in another project before publishing, add to that project's `package.json`:

```json
{
  "devDependencies": {
    "eslint-plugin-explicit-inject": "file:/path/to/this/repo"
  }
}
```

Then `pnpm install` in that project. After making changes here, run `pnpm build`, then `pnpm install` again in the target project.

## Requirements

- ESLint 10+
- @typescript-eslint/parser 8+
