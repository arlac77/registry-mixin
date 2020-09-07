[![npm](https://img.shields.io/npm/v/registry-mixin.svg)](https://www.npmjs.com/package/registry-mixin)
[![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)
[![minified size](https://badgen.net/bundlephobia/min/registry-mixin)](https://bundlephobia.com/result?p=registry-mixin)
[![downloads](http://img.shields.io/npm/dm/registry-mixin.svg?style=flat-square)](https://npmjs.org/package/registry-mixin)
[![GitHub Issues](https://img.shields.io/github/issues/arlac77/registry-mixin.svg?style=flat-square)](https://github.com/arlac77/registry-mixin/issues)
[![Build Status](https://travis-ci.com/arlac77/registry-mixin.svg?branch=master)](https://travis-ci.com/arlac77/registry-mixin)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/arlac77/registry-mixin.git)
[![Styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Known Vulnerabilities](https://snyk.io/test/github/arlac77/registry-mixin/badge.svg)](https://snyk.io/test/github/arlac77/registry-mixin)

# registry-mixin

Register objects and factories for later lookup

# API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

-   [defineRegistryProperties](#defineregistryproperties)
    -   [Parameters](#parameters)

## defineRegistryProperties

Register named factories
register&lt;<Name>>(Factory)
unregister&lt;<Name>>(Factory)
create&lt;<Name>>InstanceNamed(name,...args)
create&lt;<Name>>Instance(config,...args) // config.type is the name
&lt;<Name>>[name] // lookup

Format of the options
{
'factoryType' : 'new'																// A key word which will call a constructor
                 '<functionName>'										// a function name to call
                 function(name, arg1, arg2, arg3){}  // A given function which will be called
 willBeUnregistered(object) // called before unregistering object
 hasBeenRegistered (object)  // called after registering object
}

### Parameters

-   `object`  
-   `name`  
-   `options`   (optional, default `{}`)

# install

With [npm](http://npmjs.org) do:

```shell
npm install registry-mixin
```

# license

BSD-2-Clause
