/* jslint node: true, esnext: true */
"use strict";

/**
 * TODO: withEvents, withPromises
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
 *	"factoryType" : "new"																// A key word which will call a constructor
 *                  "<functionName>"										// a function name to call
 *                  function(name, arg1, arg2, arg3){}  // A given function which will be called
 *  willBeUnregistered(object) // called before unregistering object
 *  hasBeenRegistered (object)  // called after registering object
 * }
 *
 */
exports.defineRegistryProperties = function (object, name, options) {
	const properties = {};

	if (options === undefined) {
		options = {};
	}

	const ucFirstName = name.charAt(0).toUpperCase() + name.slice(1);
	const pluralLowercaseName = options.pluralName ? options.pluralName : name + "s";
	const eventNameRegistered = name + 'Registered';
	const eventNameUnRegistered = name + 'Unregistered';

	const registry = {};

	properties[pluralLowercaseName] = {
		get: function () {
			return registry;
		}
	};

	if (options.withCreateInstance) {
		properties['create' + ucFirstName + 'Instance'] = {
			// TODO use ... if node supports it
			value: options.factoryType === 'new' ? function (name, arg1, arg2, arg3) {
				const Clazz = registry[name];
				return new Clazz(arg1, arg2, arg3);
			} : function (name, arg1, arg2, arg3) {
				const factory = registry[name];
				return factory[options.factoryMethod](arg1, arg2, arg3);
			}
		};

		properties['create' + ucFirstName + 'InstanceFromConfig'] = {
			// TODO use ... if node supports it
			value: options.factoryType === 'new' ? function (identifier, arg1, arg2, arg3) {
				const Clazz = registry[identifier.type];
				return new Clazz(identifier, arg1, arg2, arg3);
			} : function (identifier, arg1, arg2, arg3) {
				const factory = registry[identifier.type];
				return factory[options.factoryMethod](identifier, arg1, arg2, arg3);
			}
		};
	}

	properties['register' + ucFirstName] = {
		value: function (toBeRegistered) {
			const name = toBeRegistered.type || toBeRegistered.name;

			const old = registry[name];
			let p;

			if (old) {
				if (old === toBeRegistered) {
					return Promise.resolve(toBeRegistered);
				}

				p = options.willBeUnregistered ? options.willBeUnregistered(old) : Promise.resolve();
				p = p.then(() => this.emit(eventNameUnRegistered, old));
			} else {
				p = Promise.resolve(toBeRegistered);
			}

			if (options.hasBeenRegistered) {
				p = p.then(options.hasBeenRegistered(toBeRegistered));
			}

			return p.then(() => {
				registry[name] = toBeRegistered;
				this.emit(eventNameRegistered, toBeRegistered);
				return toBeRegistered;
			});
		}
	};

	properties['unregister' + ucFirstName] = {
		value: function (name) {
			const old = registry[name];

			if (old !== undefined) {
				let p = options.willBeUnregistered ?
					options.willBeUnregistered(old) :
					Promise.resolve();

				return p.then(() => {
					delete registry[name];
					this.emit(eventNameUnRegistered, old);
				});
			}

			return Promise.reject();
		}
	};

	Object.defineProperties(object, properties);
};
