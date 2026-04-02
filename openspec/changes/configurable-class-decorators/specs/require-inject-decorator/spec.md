## ADDED Requirements

### Requirement: Accept a configurable list of class decorator names
The rule SHALL accept an optional `decorators` option: an array of strings specifying which class decorator names trigger the rule. The default value SHALL be `["Injectable"]`.

#### Scenario: Custom decorators option with Controller
- **WHEN** the rule is configured with `{ decorators: ["Injectable", "Controller"] }`
- **AND** a class has `@Controller()` decorator with a bare constructor parameter
- **THEN** the rule reports an error on that parameter

#### Scenario: Custom decorators option excludes unmatched classes
- **WHEN** the rule is configured with `{ decorators: ["Injectable"] }`
- **AND** a class has `@Controller()` decorator (not in the list) with a bare constructor parameter
- **THEN** the rule reports no errors

#### Scenario: No options provided uses default
- **WHEN** the rule is enabled with no options (just `"error"`)
- **AND** a class has `@Injectable()` decorator with a bare constructor parameter
- **THEN** the rule reports an error (same as current behavior)

#### Scenario: Multiple configured decorators each trigger independently
- **WHEN** the rule is configured with `{ decorators: ["Injectable", "Controller", "Resolver"] }`
- **AND** there are three classes, one with each decorator, each with a bare constructor parameter
- **THEN** the rule reports one error per class (3 total)

## MODIFIED Requirements

### Requirement: Report undecorated constructor parameters in Injectable classes
The rule SHALL report an error on every constructor parameter that has no decorators in a class decorated with any of the configured decorator names (defaulting to `@Injectable()`).

#### Scenario: Injectable class with bare constructor parameter
- **WHEN** a class has a decorator matching the configured list and a constructor parameter with no decorators
- **THEN** the rule reports an error on that parameter with message "Constructor parameter '{name}' in @{decorator} class must have an explicit @Inject() decorator." where `{decorator}` is the matched class decorator name

#### Scenario: Injectable class with multiple bare parameters
- **WHEN** a class has a decorator matching the configured list and 3 constructor parameters, none decorated
- **THEN** the rule reports 3 separate errors, one per parameter

#### Scenario: Injectable class with no constructor
- **WHEN** a class has a decorator matching the configured list but no constructor
- **THEN** the rule reports no errors

#### Scenario: Injectable class with empty constructor
- **WHEN** a class has a decorator matching the configured list and a constructor with zero parameters
- **THEN** the rule reports no errors

### Requirement: Only apply to classes with @Injectable decorator
The rule SHALL NOT report errors on classes that do not have any of the configured decorator names.

#### Scenario: Plain class without decorators
- **WHEN** a class has no decorators and constructor parameters without `@Inject()`
- **THEN** the rule reports no errors

#### Scenario: Class with non-configured decorators
- **WHEN** a class has a decorator not in the configured list and has bare constructor parameters
- **THEN** the rule reports no errors

### Requirement: Detect @Injectable regardless of call syntax
The rule SHALL detect configured decorators whether called with or without parentheses, and with or without arguments.

#### Scenario: Configured decorator with parentheses and no args
- **WHEN** a class is decorated with `@Controller()`
- **AND** `Controller` is in the configured decorators list
- **THEN** the rule applies to this class

#### Scenario: Configured decorator with arguments
- **WHEN** a class is decorated with `@Controller('/api')`
- **AND** `Controller` is in the configured decorators list
- **THEN** the rule applies to this class

### Requirement: Rule metadata
The rule SHALL have correct metadata for ESLint tooling.

#### Scenario: Rule meta properties
- **WHEN** the rule is loaded by ESLint
- **THEN** `meta.type` is `"problem"`
- **THEN** `meta.docs.description` explains the rule's purpose
- **THEN** `meta.schema` defines a single object with a `decorators` array property
- **THEN** `meta.messages` contains a `missingInject` message ID
