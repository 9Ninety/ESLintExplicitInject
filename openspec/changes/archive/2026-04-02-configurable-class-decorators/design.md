## Context

The `require-inject-decorator` rule currently hardcodes `"Injectable"` as the only class decorator that triggers constructor parameter checking. In NestJS (and other DI frameworks like Angular), multiple class decorators participate in constructor injection: `@Controller()`, `@Module()`, `@Resolver()`, etc. The rule was designed to be generic (name-based matching, no import tracing), but the single hardcoded decorator name limits its usefulness.

## Goals / Non-Goals

**Goals:**
- Allow users to configure which class decorator names trigger the rule
- Maintain full backwards compatibility (no options = current behavior)
- Include the matched decorator name in error messages for clarity

**Non-Goals:**
- Import-source tracing (e.g., verifying `@Injectable` comes from `@nestjs/common`). This was rejected in the original design and remains out of scope.
- Shipping a NestJS-specific preset config. Users configure their own decorator list.

## Decisions

### 1. Rule option shape: `{ decorators: string[] }`

A single `decorators` option containing an array of decorator name strings.

```ts
schema: [{
  type: "object",
  properties: {
    decorators: {
      type: "array",
      items: { type: "string" },
      minItems: 1,
      uniqueItems: true,
    }
  },
  additionalProperties: false,
}]
```

Alternative considered: per-decorator objects with `{ name, from }` for import matching. Rejected because it requires type-aware linting and adds complexity for minimal real-world benefit (decorator names are effectively unique).

### 2. Default value: `["Injectable"]`

`defaultOptions: [{ decorators: ["Injectable"] }]` preserves current behavior. Users who only use `@Injectable` change nothing. Users who need more decorators explicitly list them:

```js
"explicit-inject/require-inject-decorator": ["error", {
  decorators: ["Injectable", "Controller", "Resolver"]
}]
```

Alternative considered: a broader default like `["Injectable", "Controller"]`. Rejected because the plugin is generic, not NestJS-specific. Surprising defaults cause more harm than helpful ones.

### 3. Dynamic error message with matched decorator name

The message template changes from:
> Constructor parameter '{name}' in @Injectable class must have an explicit @Inject() decorator.

To:
> Constructor parameter '{name}' in @{decorator} class must have an explicit @Inject() decorator.

The `{decorator}` placeholder gets the actual matched decorator name. This makes errors immediately understandable when checking multiple decorator types.

### 4. Match-first semantics for multiple decorators

When iterating class decorators against the configured list, the rule uses the first matching decorator name for the error message. If a class somehow has both `@Injectable()` and `@Controller()`, the first match in the class's decorator list wins. In practice this is a non-issue since classes don't stack these decorators.

## Risks / Trade-offs

- [Low] Users must remember to add all relevant decorators to the config. Mitigation: clear README examples for NestJS, Angular, etc.
- [Low] The option key `decorators` could be confused with parameter decorators. Mitigation: the rule name and docs make it clear this refers to class-level decorators. `classDecorators` was considered but rejected as unnecessarily verbose.
