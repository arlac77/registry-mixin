[![npm](https://img.shields.io/npm/v/registry-mixin.svg)](https://www.npmjs.com/package/registry-mixin)
[![Greenkeeper](https://badges.greenkeeper.io/arlac77/registry-mixin)](https://greenkeeper.io/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/arlac77/registry-mixin)
[![Build Status](https://secure.travis-ci.org/arlac77/registry-mixin.png)](http://travis-ci.org/arlac77/registry-mixin)
[![bithound](https://www.bithound.io/github/arlac77/registry-mixin/badges/score.svg)](https://www.bithound.io/github/arlac77/registry-mixin)
[![codecov.io](http://codecov.io/github/arlac77/registry-mixin/coverage.svg?branch=master)](http://codecov.io/github/arlac77/registry-mixin?branch=master)
[![Coverage Status](https://coveralls.io/repos/arlac77/registry-mixin/badge.svg)](https://coveralls.io/r/arlac77/registry-mixin)
[![Code Climate](https://codeclimate.com/github/arlac77/registry-mixin/badges/gpa.svg)](https://codeclimate.com/github/arlac77/registry-mixin)
[![Known Vulnerabilities](https://snyk.io/test/github/arlac77/registry-mixin/badge.svg)](https://snyk.io/test/github/arlac77/registry-mixin)
[![GitHub Issues](https://img.shields.io/github/issues/arlac77/registry-mixin.svg?style=flat-square)](https://github.com/arlac77/registry-mixin/issues)
[![Stories in Ready](https://badge.waffle.io/arlac77/registry-mixin.svg?label=ready&title=Ready)](http://waffle.io/arlac77/registry-mixin)
[![Dependency Status](https://david-dm.org/arlac77/registry-mixin.svg)](https://david-dm.org/arlac77/registry-mixin)
[![devDependency Status](https://david-dm.org/arlac77/registry-mixin/dev-status.svg)](https://david-dm.org/arlac77/registry-mixin#info=devDependencies)
[![docs](http://inch-ci.org/github/arlac77/registry-mixin.svg?branch=master)](http://inch-ci.org/github/arlac77/registry-mixin)
[![downloads](http://img.shields.io/npm/dm/registry-mixin.svg?style=flat-square)](https://npmjs.org/package/registry-mixin)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

registry-mixin
===
Register objects and factories for later lookup

# API Reference

* <a name="defineRegistryProperties"></a>

## defineRegistryProperties()
Register named factories
register<<Name>>(Factory)
unregister<<Name>>(Factory)
create<<Name>>InstanceNamed(name,...args)
create<<Name>>Instance(config,...args) // config.type is the name
<<Name>>[name] // lookup

Format of the options
{
	'factoryType' : 'new'																// A key word which will call a constructor
                 '<functionName>'										// a function name to call
                 function(name, arg1, arg2, arg3){}  // A given function which will be called
 willBeUnregistered(object) // called before unregistering object
 hasBeenRegistered (object)  // called after registering object
}

**Kind**: global function  

* * *

install
=======

With [npm](http://npmjs.org) do:

```shell
npm install registry-mixin
```

license
=======

BSD-2-Clause
