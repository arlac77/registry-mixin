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
              if (Clazz === undefined) {
                throw new Error(
                  `Could not find class '${name}' in registry '${ucFirstName}'`
                );
              }
              return new Clazz(...args);
            }
          : function(name, ...args) {
              const factory = registry[name];
              if (factory === undefined) {
                throw new Error(
                  `Could not find factory '${name}' in registry '${ucFirstName}'`
                );
              }
              return factory[options.factoryMethod](...args);
            }
    };

    properties['create' + ucFirstName + 'InstanceFromConfig'] = {
      value:
        options.factoryType === 'new'
          ? function(identifier, ...args) {
              const Clazz = registry[identifier.type];
              if (Clazz === undefined) {
                throw new Error(
                  `Could not find class '${identifier.type}' in registry '${ucFirstName}'`
                );
              }
              return new Clazz(identifier, ...args);
            }
          : function(identifier, ...args) {
              const factory = registry[identifier.type];
              if (factory === undefined) {
                throw new Error(
                  `Could not find factory '${identifier.type}' in registry '${ucFirstName}'`
                );
              }
              return factory[options.factoryMethod](identifier, ...args);
            }
    };
  }

  async function registerFunction(toBeRegistered, name) {
    const old = registry[name];
    let p;

    if (old === undefined) {
      await toBeRegistered;
    } else {
      if (old === toBeRegistered) {
        return toBeRegistered;
      }

      if (options.willBeUnregistered !== undefined) {
        await options.willBeUnregistered(old);
      }

      if (options.withEvents) {
        object.emit(eventNameUnRegistered, old);
      }
    }

    if (options.hasBeenRegistered) {
      options.hasBeenRegistered(toBeRegistered);
    }

    registry[name] = toBeRegistered;
    if (options.withEvents) {
      object.emit(eventNameRegistered, toBeRegistered);
    }

    return toBeRegistered;
  }

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
