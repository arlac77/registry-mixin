/**
 *
 * Register named factories
 * register<<Name>>(Factory)
 * unregister<<Name>>(Factory)
 * create<<Name>>InstanceNamed(name,...args)
 * create<<Name>>Instance(config,...args) // config.type is the name
 * <<Name>>[name] // lookup
 *
 * Format of the options
 * {
 *	'factoryType' : 'new'																// A key word which will call a constructor
 *                  '<functionName>'										// a function name to call
 *                  function(name, arg1, arg2, arg3){}  // A given function which will be called
 *  willBeUnregistered(object) // called before unregistering object
 *  hasBeenRegistered (object)  // called after registering object
 * }
 *
 */
export function defineRegistryProperties(object, name, options = {}) {
  const properties = {};

  const ucFirstName = name.charAt(0).toUpperCase() + name.slice(1);
  const pluralLowercaseName = options.pluralName
    ? options.pluralName
    : name + 's';
  const eventNameRegistered = name + 'Registered';
  const eventNameUnRegistered = name + 'Unregistered';

  const registry = {};

  properties[pluralLowercaseName] = {
    get: function() {
      return registry;
    }
  };

  if (options.withCreateInstance) {
    properties['create' + ucFirstName + 'Instance'] = {
      value:
        options.factoryType === 'new'
          ? function(name, ...args) {
              const Clazz = registry[name];
              if (Clazz) {
                return new Clazz(...args);
              } else {
                throw new Error(
                  `Could not find class '${name}' in registry '${ucFirstName}'`
                );
              }
            }
          : function(name, ...args) {
              const factory = registry[name];
              if (factory) {
                return factory[options.factoryMethod](...args);
              } else {
                throw new Error(
                  `Could not find factory '${name}' in registry '${ucFirstName}'`
                );
              }
            }
    };

    properties['create' + ucFirstName + 'InstanceFromConfig'] = {
      value:
        options.factoryType === 'new'
          ? function(identifier, ...args) {
              const Clazz = registry[identifier.type];
              if (Clazz) {
                return new Clazz(identifier, ...args);
              } else {
                throw new Error(
                  `Could not find class '${identifier.type}' in registry '${ucFirstName}'`
                );
              }
            }
          : function(identifier, ...args) {
              const factory = registry[identifier.type];
              if (factory) {
                return factory[options.factoryMethod](identifier, ...args);
              } else {
                throw new Error(
                  `Could not find factory '${identifier.type}' in registry '${ucFirstName}'`
                );
              }
            }
    };
  }

  const registerFunction = (toBeRegistered, name) => {
    const old = registry[name];
    let p;

    if (old) {
      if (old === toBeRegistered) {
        return Promise.resolve(toBeRegistered);
      }

      p = options.willBeUnregistered
        ? options.willBeUnregistered(old)
        : Promise.resolve();
      if (options.withEvents) {
        p = p.then(() => object.emit(eventNameUnRegistered, old));
      }
    } else {
      p = Promise.resolve(toBeRegistered);
    }

    if (options.hasBeenRegistered) {
      p = p.then(options.hasBeenRegistered(toBeRegistered));
    }

    return p.then(() => {
      registry[name] = toBeRegistered;
      if (options.withEvents) {
        object.emit(eventNameRegistered, toBeRegistered);
      }
      return toBeRegistered;
    });
  };

  properties['register' + ucFirstName + 'As'] = {
    value: registerFunction
  };

  properties['register' + ucFirstName] = {
    value: toBeRegistered =>
      registerFunction(toBeRegistered, toBeRegistered.name)
  };

  properties['unregister' + ucFirstName] = {
    value: function(name) {
      const old = registry[name];

      if (old !== undefined) {
        const cleanup = () => {
          delete registry[name];
          if (options.withEvents) {
            this.emit(eventNameUnRegistered, old);
          }
          return Promise.resolve(old);
        };

        return options.willBeUnregistered
          ? options.willBeUnregistered(old).then(cleanup)
          : cleanup();
      }

      return Promise.reject();
    }
  };

  Object.defineProperties(object, properties);
}
