// These are fake decorators for testing - we only check by name, not import source
function Injectable() { return (target: any) => target; }
function Inject(token?: any) { return (target: any, key: string | symbol | undefined, index: number) => {}; }
function Optional() { return (target: any, key: string | symbol | undefined, index: number) => {}; }
function Controller() { return (target: any) => target; }

class FooService {}
class BarService {}
class BazService {}

// === SHOULD ERROR: bare params in @Injectable ===

@Injectable()
class ServiceA {
  constructor(
    private foo: FooService,          // ERROR: missing @Inject
    private bar: BarService,          // ERROR: missing @Inject
  ) {}
}

@Injectable()
class ServiceB {
  constructor(foo: FooService) {}     // ERROR: missing @Inject
}

// @Injectable with options
@Injectable({ scope: 'REQUEST' as any })
class ServiceC {
  constructor(foo: FooService) {}     // ERROR: missing @Inject
}

// === SHOULD NOT ERROR: decorated params ===

@Injectable()
class ServiceD {
  constructor(
    @Inject(FooService) private foo: FooService,    // OK
    @Inject(BarService) private bar: BarService,    // OK
  ) {}
}

@Injectable()
class ServiceE {
  constructor(
    @Optional() private foo: FooService,            // OK: has a decorator
  ) {}
}

// === SHOULD NOT ERROR: not @Injectable ===

class PlainClass {
  constructor(private foo: FooService) {}           // OK: no @Injectable
}

@Controller()
class MyController {
  constructor(private foo: FooService) {}           // OK: @Controller, not @Injectable
}

// === SHOULD NOT ERROR: no constructor / empty constructor ===

@Injectable()
class ServiceF {}

@Injectable()
class ServiceG {
  constructor() {}
}

// === MIXED: some decorated, some not ===

@Injectable()
class ServiceH {
  constructor(
    @Inject(FooService) private foo: FooService,    // OK
    private bar: BarService,                         // ERROR: missing @Inject
    @Optional() private baz: BazService,            // OK
  ) {}
}
