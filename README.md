# Require.js

This is a basic implementation of module definition and requiring it dynamically. It doesn't have
anything related to the [require.js](https://github.com/jrburke/requirejs) specification, it just
follow some [Node module require syntax](http://nodejs.org/api/modules.html).

It manages static modules defined for application and don't manage external resources from CDN.

## Why?

* simple definition
* lazy, the modules are eval only when required
* simple circular reference detection
* unordered module definition

Some of the common way of define modules is by define global variables like:

```javascript
var App = App || {};
App.Module = function() {};
App.Module.Submodule = {};
```

This is pretty common, but it needs to be evaluated in order. What I mean is, defining `App.Module`
before `App` definition, requires that you explicit define `App || {}`, the same occurs with
`App.Module.Submodule`. The more nesting you have, the worst it gets.

Another issue with this approach is that, if you don't manage the load order, you may override on
name definition with another.

```
// submodule.js
App.Module = App.Module || {};
App.Module.Submodule = function() {};

// module.js
App = App || {}
App.Module = function() {}; // fail, this will override the Module constant and then Submodule is lost
```

## Usage

Defining a module is pretty simple:

```javascript
// file foo.js
define('foo', function(module) {
  function Foo(message) {
    this.message = message;
  }

  Foo.prototype.say = function() {
    alert(this.message);
  };

  module.exports = Foo;
});
```

It can exports an object:

```javascript
// file config.js
define('config', function(module) {
  var CONFIG = {
    url: 'http://domain.com'
  };

  module.exports = CONFIG;
});
```

Requiring a module is pretty simple:

```javascript
var FooBar = require('foo');
foobar = new FooBar('hello world');
foobar.say(); // alerts 'hello world'
```

You also require a specific property of an object:

```javascript
var url = require('config').url;
console.log(url); // 'http://domain.com'
```

### Context module definition

The caller of the module is the module export itself, which means:

```javascript
define('m', function(module) {
  module === this;
});
```

### Access to the global object

```javascript
// file module.js
define('my.module', function(module, global) {
  var $ = global.jQuery;

  function A(selector) {
    this.$el = $(selector);
  };

  A.prototype.render = function() {
    this.$el.append('html');
  };

  module.exports = A;
});
```

### noConflict

```javascript
var myRequire = require.noConflict();
require();   // calls the old version
myRequire(); // calls the require.js version

var myDefine = define.noConflict();
define();   // calls the old version
myDefine(); // calls the require.js version
```

## Development

It uses [QUnit](http://qunitjs.com/) for tests. Just open in browser the `test/index.html`.

## Support

## Changelog

v0.0.2

* `noConflict` support for both `require` and `define`

v0.0.1

* supports global access into module definition
* initial release with `require` and `define` support

## License

Copyright 2013 Fabio Yamate <fabioyamate@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
