# Require.js

This is a basic implementation of module definition and requiring it dynamically. It doesn't have
anything related to the require.js specification, it just follow some Node module require syntax.

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
// file foo.js
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

## Development

It uses QUnit for tests. Just open in browser the `test/index.html`.

## Support

## License
