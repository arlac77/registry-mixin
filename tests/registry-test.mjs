import test from "ava";
import { inherits } from "util";
import events from "events";
import { defineRegistryProperties } from "../src/registry-mixin.mjs";

class Interceptor {
  static get name() {
    return "t1";
  }

  constructor(arg1, arg2) {
    if (arg2) {
      this.arg1 = arg2;
    } else this.arg1 = arg1;
  }
}

class Interceptor2 {
  static get name() {
    return "t1";
  }
}

const InterceptorFactory = {
  name: "t1",
  createInstance(arg1, arg2) {
    if (arg2) {
      return {
        arg1: arg2
      };
    }

    return {
      arg1: arg1
    };
  }
};

const InterceptorFactory2 = {
  name: "t1",
  createInstance(arg1, arg2) {
    if (arg2) {
      return {
        arg1: arg2
      };
    }

    return {
      arg1: arg1
    };
  }
};

function MyEmitter() {
  events.call(this);
}

inherits(MyEmitter, events);

test("empty", t => {
  const object = new MyEmitter();

  defineRegistryProperties(object, "interceptor", {
    withCreateInstance: true,
    factoryType: "new"
  });

  t.deepEqual(object.interceptors, {});
});

test("class", t => {
  testRegistry(t, "class", Interceptor, Interceptor2, {
    withEvents: true,
    withCreateInstance: true,
    factoryType: "new",
    hasBeenRegistered: async i => {
      i.hasBeenRegisteredCalled = true;
    },
    willBeUnregistered: async i => {
      i.willBeUnregisteredCalled = true;
    }
  });
});

/*
describe("RegistrarMixin", () => {
  testRegistry("function", InterceptorFactory, InterceptorFactory2, {
    withEvents: true,
    withCreateInstance: true,
    factoryType: "object",
    factoryMethod: "createInstance"
  });

  testRegistry("function", InterceptorFactory, InterceptorFactory2, {
    withEvents: false,
    withCreateInstance: true,
    factoryType: "object",
    factoryMethod: "createInstance"
  });
});
*/

async function testRegistry(t, name, factory, factory2, registryOptions) {
  const object = new MyEmitter();

  defineRegistryProperties(object, "interceptor", registryOptions);

  let registered;
  object.addListener("interceptorRegistered", r => (registered = r));

  let f = await object.registerInterceptorAs(factory, "some other name");

  t.is(object.interceptors["some other name"], factory);
  t.is(f, factory);

  f = await object.registerInterceptor(factory);

  t.is(object.interceptors[factory.name], factory);
  t.is(f, factory);

  if (registryOptions.withEvents) {
    t.is(registered, factory);
  }

  if (registryOptions.hasBeenRegistered) {
    t.is(factory.hasBeenRegisteredCalled, true);
  }

  /*
      it("has one entry", () => assert.equal(object.interceptors.t1, factory));
      describe("create instance", () => {
        const inst1 = object.createInterceptorInstance("t1", "arg1");
        it("created", () => assert.equal(inst1.arg1, "arg1"));
      });

      describe("create instance from config", () => {
        const inst1 = object.createInterceptorInstanceFromConfig(
          {
            type: "t1",
            someOtherArgs: 1
          },
          "arg1"
        );
        it("created", () => assert.equal(inst1.arg1, "arg1"));
      });

      describe("unregister", () => {
        it("nonexisting entry", done => {
          object.unregisterInterceptor("txyz").then(done, () => done());
        });

        it("entry removed", done => {
          let unregistered;
          object.addListener(
            "interceptorUnregistered",
            ur => (unregistered = ur)
          );
          object.unregisterInterceptor("t1").then(() => {
            assert.equal(object.interceptors.t1, undefined);
            if (registryOptions.withEvents) {
              assert.equal(unregistered, factory);
            }
            done();
          });
        });

        if (registryOptions.willBeUnregistered) {
          describe("willBeUnregistered", () => {
            it("is called", done => {
              assert.equal(factory.willBeUnregisteredCalled, true);
              done();
            });
          });
        }
      });

      describe("2. time registration", () => {
        it("one entry still there", done => {
          object.registerInterceptor(factory).then(f => {
            assert.equal(object.interceptors.t1, factory);
            object
              .registerInterceptor(factory2)
              .then(f => {
                done();
              })
              .catch(done);
          });
        });
      });
    });
    */
}
