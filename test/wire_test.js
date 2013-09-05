module('wire.noConflict');

test('restore previous defined wire version', function() {
  wire.define('wire.noConflict', function(module, global) {
    module.exports = 'newWire';
  });

  var wirejs = wire.noConflict();

  equal('previous wire version', wire());
  equal('newWire', wirejs.require('wire.noConflict'));

  // restore back
  wire = wirejs;
});

module('wire.define');

function moduleDefinition() {}

var foo = '[global bar]';
var globalObject = this;

test('lazy eval of module definition', function() {
  wire.define('foo', function() {
    throw 'error';
  });
  ok(true);
});

test('fails if module already defined', function() {
  wire.define('duplicate', moduleDefinition);
  throws(function() {
    wire.define('duplicate', moduleDefinition);
  }, Error, "Module 'duplicate' already defined.");
});


module('wire.require');

test('fails with undefined module', function() {
  throws(function() {
    wire.require('some/module');
  }, Error, "Module 'some/module' undefined.");
});

test('returns undefined if nothing exported', function() {
  wire.define('no/exports', moduleDefinition);
  var module = wire.require('no/exports');
  equal(module, undefined);
});

test('can export an object', function() {
  wire.define('config', function(module) {
    module.exports = { foo: 'bar' };
  });
  var config = wire.require('config');
  equal(config.foo, 'bar');
});

test('can export a constructor', function() {
  wire.define('hello.world', function(module) {
    function HelloWorld() {};

    HelloWorld.prototype.say = function() {
      return 'hello world';
    };

    module.exports = HelloWorld;
  });

  var HW = wire.require('hello.world');
  var hello = new HW();

  equal(typeof HW, 'function');
  equal(hello.say(), 'hello world');
});

test('can require as any name', function() {
  function ExportedName() {}

  wire.define('name', function(module) {
    module.exports = ExportedName;
  });

  var AnotherName = wire.require('name');

  strictEqual(ExportedName, AnotherName);
});

test('fails with circular dependency', function() {
  wire.define('chicken', function() {
    var egg = wire.require('egg');
  });

  wire.define('egg', function() {
    var chicken = wire.require('chicken');
  });

  throws(function() {
    wire.require('egg');
  }, Error, "Circular dependency, could not load 'egg' module.");
});

test('evals once the module definition', function() {
  var count = 0;
  wire.define('my.module/definition', function() {
    count += 1;
  });

  wire.require('my.module/definition');
  wire.require('my.module/definition');
  wire.require('my.module/definition');
  wire.require('my.module/definition');

  equal(count, 1);
});

test('caller context is the module export', function() {
  wire.define('context', function(module) {
    equal(module, this, 'the caller is the module');
  });

  wire.require('context');
});

test('global object access', function() {
  wire.define('global$object', function(module, global) {
    equal(global, globalObject, 'have access to the global object');
    equal('[global bar]', global.foo);
  });

  wire.require('global$object');
});
