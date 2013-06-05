module('define');

function moduleDefinition() {}

var foo = '[global bar]';
var globalObject = this;

test('lazy eval of module definition', function() {
  define('foo', function() {
    throw 'error';
  });
  ok(true);
});

test('fails if module already defined', function() {
  define('duplicate', moduleDefinition);
  throws(function() {
    define('duplicate', moduleDefinition);
  }, Error, "Module 'duplicate' already defined.");
});

module('require');

test('fails with undefined module', function() {
  throws(function() {
    require('some/module');
  }, Error, "Module 'some/module' undefined.");
});

test('returns undefined if nothing exported', function() {
  define('no/exports', moduleDefinition);
  var module = require('no/exports');
  equal(module, undefined);
});

test('can export an object', function() {
  define('config', function(module) {
    module.exports = { foo: 'bar' };
  });
  var config = require('config');
  equal(config.foo, 'bar');
});

test('can export a constructor', function() {
  define('hello.world', function(module) {
    function HelloWorld() {};

    HelloWorld.prototype.say = function() {
      return 'hello world';
    };

    module.exports = HelloWorld;
  });

  var HW = require('hello.world');
  var hello = new HW();

  equal(typeof HW, 'function');
  equal(hello.say(), 'hello world');
});

test('can require as any name', function() {
  function ExportedName() {}

  define('name', function(module) {
    module.exports = ExportedName;
  });

  var AnotherName = require('name');

  strictEqual(ExportedName, AnotherName);
});

test('fails with circular dependency', function() {
  define('chicken', function() {
    var egg = require('egg');
  });

  define('egg', function() {
    var chicken = require('chicken');
  });

  throws(function() {
    require('egg');
  }, Error, "Circular dependency, could not load 'egg' module.");
});

test('evals once the module definition', function() {
  var count = 0;
  define('my.module/definition', function() {
    count += 1;
  });

  require('my.module/definition');
  require('my.module/definition');
  require('my.module/definition');
  require('my.module/definition');

  equal(count, 1);
});

test('caller context is the module export', function() {
  define('context', function(module) {
    equal(module, this, 'the caller is the module');
  });

  require('context');
});

test('global object access', function() {
  define('global$object', function(module, global) {
    equal(global, globalObject, 'have access to the global object');
    equal('[global bar]', global.foo);
  });

  require('global$object');
});
