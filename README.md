[![npm](https://img.shields.io/npm/v/registry-mixin.svg)](https://www.npmjs.com/package/registry-mixin)
[![License](https://img.shields.io/badge/License-0BSD-blue.svg)](https://spdx.org/licenses/0BSD.html)
[![bundlejs](https://deno.bundlejs.com/?q=registry-mixin\&badge=detailed)](https://bundlejs.com/?q=registry-mixin)
[![downloads](http://img.shields.io/npm/dm/registry-mixin.svg?style=flat-square)](https://npmjs.org/package/registry-mixin)
[![GitHub Issues](https://img.shields.io/github/issues/arlac77/registry-mixin.svg?style=flat-square)](https://github.com/arlac77/registry-mixin/issues)
[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Farlac77%2Fregistry-mixin%2Fbadge\&style=flat)](https://actions-badge.atrox.dev/arlac77/registry-mixin/goto)
[![Styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Known Vulnerabilities](https://snyk.io/test/github/arlac77/registry-mixin/badge.svg)](https://snyk.io/test/github/arlac77/registry-mixin)
[![Coverage Status](https://coveralls.io/repos/arlac77/registry-mixin/badge.svg)](https://coveralls.io/github/arlac77/registry-mixin)

# registry-mixin

Register objects and factories for later lookup

# API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

*   [defineRegistryProperties](#defineregistryproperties)
    *   [Parameters](#parameters)

## defineRegistryProperties

Register named factories
register<<Name>>(Factory)
unregister<<Name>>(Factory)
create<<Name>>InstanceNamed(name,...args)
create<<Name>>Instance(config,...args) // config.type is the name
<<Name>>\[name] // lookup

Format of the options
{
'factoryType' : 'new'																// A key word which will call a constructor
'<functionName>'										// a function name to call
function(name, arg1, arg2, arg3){}  // A given function which will be called
willBeUnregistered(object) // called before unregistering object
hasBeenRegistered (object)  // called after registering object
}

### Parameters

*   `object` &#x20;
*   `name` &#x20;
*   `options`   (optional, default `{}`)

# install

With [npm](http://npmjs.org) do:

```shell
npm install registry-mixin
```

# license

BSD-2-Clause
