/* global describe, it, xit */
/* jslint node: true, esnext: true */

'use strict';

const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should(),
  events = require('events'),
  util = require('util'),
  rgm = require('../RegistryMixin');

class Interceptor {
  static get name() {
    return 't1';
  }

  constructor(arg1, arg2) {
    if (arg2) {
      this.arg1 = arg2;
    } else
      this.arg1 = arg1;
  }
}

class Interceptor2 {
  static get name() {
    return 't1';
  }
}

const InterceptorFactory = {
  name: 't1',
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
  name: 't1',
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
util.inherits(MyEmitter, events);

describe('RegistrarMixin', () => {

  describe('empty', () => {
    const object = new MyEmitter();

    rgm.defineRegistryProperties(object, 'interceptor', {
      withCreateInstance: true,
      factoryType: 'new'
    });

    it('no entries', () => assert.deepEqual(object.interceptors, {}));
  });

  testRegistry('class', Interceptor, Interceptor2, {
    withEvents: true,
    withCreateInstance: true,
    factoryType: 'new',
    hasBeenRegistered: i => {
      i.hasBeenRegisteredCalled = true;
      return Promise.resolve();
    },
    willBeUnregistered: i => {
      i.willBeUnregisteredCalled = true;
      return Promise.resolve();
    }
  });

  testRegistry('function', InterceptorFactory, InterceptorFactory2, {
    withEvents: true,
    withCreateInstance: true,
    factoryType: 'object',
    factoryMethod: 'createInstance'
  });

  testRegistry('function', InterceptorFactory, InterceptorFactory2, {
    withEvents: false,
    withCreateInstance: true,
    factoryType: 'object',
    factoryMethod: 'createInstance'
  });
});


function testRegistry(name, factory, factory2, registryOptions) {
  describe(`${name} entries`, () => {
    const object = new MyEmitter();

    rgm.defineRegistryProperties(object, 'interceptor', registryOptions);

    let registered;
    object.addListener('interceptorRegistered', r => registered = r);

    object.registerInterceptorAs(factory, 'some other name').then(f => {
      it('is registered', () => assert.equal(object.interceptors['some other name'], factory));

      describe('register delivers', () => it('fullfilled promise', () => assert.equal(f, factory)));

      object.registerInterceptor(factory).then(f => {
        it('is registered', () => assert.equal(object.interceptors[factory.name], factory));

        describe('register delivers', () => it('fullfilled promise', () => assert.equal(f, factory)));

        if (registryOptions.withEvents) {
          describe('registered event', () => {
            it('send', () => assert.equal(registered, factory));
          });
        }

        if (registryOptions.hasBeenRegistered) {
          describe('hasBeenRegistered', () => {
            it('is called', () => assert.equal(factory.hasBeenRegisteredCalled, true));
          });
        }

        it('has one entry', () => assert.equal(object.interceptors.t1, factory));
        describe('create instance', () => {
          const inst1 = object.createInterceptorInstance('t1', 'arg1');
          it('created', () => assert.equal(inst1.arg1, 'arg1'));
        });

        describe('create instance from config', () => {
          const inst1 = object.createInterceptorInstanceFromConfig({
            type: 't1',
            someOtherArgs: 1
          }, 'arg1');
          it('created', () => assert.equal(inst1.arg1, 'arg1'));
        });

        describe('unregister', () => {
          it('nonexisting entry', done => {
            object.unregisterInterceptor('txyz').then(done, () => done());
          });

          it('entry removed', done => {
            let unregistered;
            object.addListener('interceptorUnregistered', ur => unregistered = ur);
            object.unregisterInterceptor('t1').then(() => {
              assert.equal(object.interceptors.t1, undefined);
              if (registryOptions.withEvents) {
                assert.equal(unregistered, factory);
              }
              done();
            });
          });

          if (registryOptions.willBeUnregistered) {
            describe('willBeUnregistered', () => {
              it('is called', done => {
                assert.equal(factory.willBeUnregisteredCalled, true);
                done();
              });
            });
          }
        });

        describe('2. time registration', () => {
          it('one entry still there', done => {
            object.registerInterceptor(factory).then(f => {
              assert.equal(object.interceptors.t1, factory);
              object.registerInterceptor(factory2).then(f => {
                done();
              }).catch(done);
            });
          });
        });
      });
    });
  });
}
