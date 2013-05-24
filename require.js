(function(undefined) {
  var root = this;

  var namespaces = {};

  var loadStack = [];

  var SUBREGEX = /\{\s*([^|}]+?)\s*(?:\|([^}]*))?\s*\}/g;

  /* Internal: string substitution template.
   *
   * Example:
   *
   *  sub('User name: {name}', { name: 'john' });
   *  // => 'User name: john'
   */
  function sub(s, o) {
    return s.replace ? s.replace(SUBREGEX, function (match, key) {
      return typeof(o) === 'undefined' ? match : o[key];
    }) : s;
  }

  var CIRCULAR_DEPENDENCY_ERROR = "Circular dependency, could not load '{name}' module.\n" +
                                  "Load stack:\n" +
                                  "{stackTrace}";

  var UNDEFINED_MODULE_ERROR = "Module '{name}' undefined."
  var MODULE_ALREADY_DEFINED_ERROR = "Module '{name}' already defined."

  var PENDING_STATE = 'pending',
      LOADING_STATE = 'loading',
      LOADED_STATE  = 'loaded';

  /* Defines a module */
  function Module(name, fn) {
    this.name  = name;
    this.fn    = fn;
    this.state = PENDING_STATE;
    this.m     = {};
  }

  /* Loads a module, if not loaded already:
   *
   * State transition:
   *
   * pending -> loading -> loaded
   *
   * The state is require to manage circular reference, if a lib
   * tries to laod a module in loading progress, it will fail.
   *
   * Once a module is loaded, it never loads again.
   */
  Module.prototype.load = function() {
    switch (this.state) {
      case LOADED_STATE:
        break;

      case LOADING_STATE:
        var errorLoadStack = loadStack.join("\n");
        var error = sub(CIRCULAR_DEPENDENCY_ERROR, { name: this.name, stackTrace: errorLoadStack });
        throw new Error(error);

      default:
        this.state = LOADING_STATE;
        this.fn.call(this.m, this.m);
        this.state = LOADED_STATE;
    }

    return this.m;
  };

  /* Private: returns the module.
   *
   * If the module does not exist, it throws an error.
   *
   * It store the load stack, in order to give better information when
   * a circular reference occurs.
   */
  function loadModule(name) {
    var m, module = namespaces[name];

    if (!module) {
      var error = sub(UNDEFINED_MODULE_ERROR, { name: name });
      throw new Error(error);
    }

    loadStack.push(module.name);
    m = module.load();
    loadStack.pop();

    return m;
  }

  /* Public: defines a module and associate with a given name.
   *
   * If the module name is already defined, it throws an error.
   *
   * Example:
   *
   *   define('model/user', function(module) {
   *     function User() {}
   *
   *     module.exports = User;
   *   });
   */
  root.define = function(name, fn) {
    if (namespaces[name]) {
      var error = sub(MODULE_ALREADY_DEFINED_ERROR, { name: name });
      throw new Error(error);
    }

    namespaces[name] = new Module(name, fn);
  };

  /* Public: requires a module name.
   *
   * If the module name doesn't exist, it throws an error.
   *
   * Example:
   *
   *   var UserModel = require('model/user');
   *   var client = require('http').Client;
   */
  root.require = function(name) {
    return loadModule(name).exports;
  };
}).call(this);
