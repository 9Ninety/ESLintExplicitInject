## ADDED Requirements

### Requirement: Report undecorated constructor parameters in Injectable classes
The rule SHALL report an error on every constructor parameter that has no decorators in a class decorated with `@Injectable()`.

#### Scenario: Injectable class with bare constructor parameter
- **WHEN** a class has `@Injectable()` decorator and a constructor parameter with no decorators
- **THEN** the rule reports an error on that parameter with message "Constructor parameter '{name}' in @Injectable class must have an explicit @Inject() decorator."

#### Scenario: Injectable class with multiple bare parameters
- **WHEN** a class has `@Injectable()` decorator and 3 constructor parameters, none decorated
- **THEN** the rule reports 3 separate errors, one per parameter

#### Scenario: Injectable class with no constructor
- **WHEN** a class has `@Injectable()` decorator but no constructor
- **THEN** the rule reports no errors

#### Scenario: Injectable class with empty constructor
- **WHEN** a class has `@Injectable()` decorator and a constructor with zero parameters
- **THEN** the rule reports no errors

### Requirement: Skip parameters that have any decorator
The rule SHALL NOT report an error on constructor parameters that already have one or more decorators.

#### Scenario: Parameter with @Inject decorator
- **WHEN** a constructor parameter has `@Inject(SomeToken)` decorator
- **THEN** the rule does not report an error on that parameter

#### Scenario: Parameter with @Optional decorator
- **WHEN** a constructor parameter has `@Optional()` decorator
- **THEN** the rule does not report an error on that parameter

#### Scenario: Parameter with custom decorator
- **WHEN** a constructor parameter has any decorator (e.g., `@MyCustom()`)
- **THEN** the rule does not report an error on that parameter

#### Scenario: Mix of decorated and undecorated parameters
- **WHEN** a constructor has 3 parameters: first with `@Inject()`, second bare, third with `@Optional()`
- **THEN** the rule reports an error only on the second parameter

### Requirement: Only apply to classes with @Injectable decorator
The rule SHALL NOT report errors on classes that do not have the `@Injectable()` decorator.

#### Scenario: Plain class without decorators
- **WHEN** a class has no decorators and constructor parameters without `@Inject()`
- **THEN** the rule reports no errors

#### Scenario: Class with other NestJS decorators but not @Injectable
- **WHEN** a class has `@Controller()` decorator but not `@Injectable()` and has bare constructor parameters
- **THEN** the rule reports no errors

### Requirement: Detect @Injectable regardless of call syntax
The rule SHALL detect `@Injectable()` whether called with or without parentheses, and with or without arguments.

#### Scenario: @Injectable with parentheses and no args
- **WHEN** a class is decorated with `@Injectable()`
- **THEN** the rule applies to this class

#### Scenario: @Injectable with scope argument
- **WHEN** a class is decorated with `@Injectable({ scope: Scope.REQUEST })`
- **THEN** the rule applies to this class

### Requirement: Plugin exports recommended flat config
The plugin SHALL export a `recommended` config that enables the `require-inject-decorator` rule at `error` severity.

#### Scenario: User applies recommended config
- **WHEN** user spreads `plugin.configs.recommended` into their ESLint flat config
- **THEN** the rule `explicit-inject/require-inject-decorator` is enabled at "error" level
- **THEN** the config targets `**/*.ts` files
- **THEN** the config sets the parser to `@typescript-eslint/parser`

### Requirement: Rule metadata
The rule SHALL have correct metadata for ESLint tooling.

#### Scenario: Rule meta properties
- **WHEN** the rule is loaded by ESLint
- **THEN** `meta.type` is `"problem"`
- **THEN** `meta.docs.description` explains the rule's purpose
- **THEN** `meta.schema` is an empty array (no options)
- **THEN** `meta.messages` contains a `missingInject` message ID
