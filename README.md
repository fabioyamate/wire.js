# Require.js

This is a basic implementation of module definition and requiring it dynamically. It doesn't have
anything related to the [require.js](https://github.com/jrburke/requirejs) specification, it just
follow some [Node module require syntax](http://nodejs.org/api/modules.html).

It manages static modules defined for application and don't manage external resources from CDN.

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

## Development

It uses [QUnit](http://qunitjs.com/) for tests. Just open in browser the `test/index.html`.

## Support

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
