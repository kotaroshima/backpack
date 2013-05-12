// Generated by CoffeeScript 1.6.2
(function() {
  Backbone.sync = function() {};

  module('Backpack.attach');

  test('attach and detach', function() {
    var handler, obj;

    obj = {
      counter: 0,
      event: function() {}
    };
    handler = Backpack.attach(obj, 'event', function() {
      obj.counter++;
    });
    obj.event();
    equal(obj.counter, 1, 'counter should be incremented.');
    obj.event();
    obj.event();
    obj.event();
    obj.event();
    equal(obj.counter, 5, 'counter should be incremented five times.');
    handler.detach();
    obj.event();
    equal(obj.counter, 5, 'counter should not be incremented after detach.');
    obj.event();
    obj.event();
    obj.event();
    equal(obj.counter, 5, 'counter should not be incremented after detach.');
  });

  test('attach with arguments', function() {
    var obj;

    obj = {
      counter: 0,
      event: function(arg1, arg2) {}
    };
    Backpack.attach(obj, 'event', function(arg1, arg2) {
      equal(arg1, 'x', 'first argument should be passed in the callback function');
      equal(arg2, 2, 'second argument should be passed in the callback function');
    });
    obj.event('x', 2);
  });

  test('attach multiple events', function() {
    var handler1, handler2, obj;

    obj = {
      counter1: 0,
      counter2: 0,
      event: function() {}
    };
    handler1 = Backpack.attach(obj, 'event', function() {
      obj.counter1++;
    });
    handler2 = Backpack.attach(obj, 'event', function() {
      obj.counter2++;
    });
    obj.event();
    equal(obj.counter1, 1, 'counter1 should be incremented.');
    equal(obj.counter2, 1, 'counter2 should be incremented.');
    obj.event();
    obj.event();
    obj.event();
    obj.event();
    equal(obj.counter1, 5, 'counter1 should be incremented five times.');
    equal(obj.counter2, 5, 'counter2 should be incremented five times.');
    handler2.detach();
    obj.event();
    equal(obj.counter1, 6, 'counter1 should be incremented six times.');
    equal(obj.counter2, 5, 'counter2 should be incremented five times.');
    handler1.detach();
    obj.event();
    equal(obj.counter1, 6, 'counter1 should be incremented six times.');
    equal(obj.counter2, 5, 'counter2 should be incremented five times.');
  });

  _.each(Backpack.testDefs, function(def) {
    module(def.name);
    test('extend with plugins', function() {
      var TestClass, instance, testPlugin1, testPlugin2;

      testPlugin1 = {
        setup: function() {
          this.prop1 = 'hello';
        },
        cleanup: function() {
          this.prop1 = 'bye';
        }
      };
      testPlugin2 = {
        setup: function() {
          this.prop2 = 'konichiwa';
        },
        cleanup: function() {
          this.prop2 = 'sayonara';
        }
      };
      TestClass = def["class"].extend({
        plugins: [testPlugin1, testPlugin2]
      });
      instance = new TestClass();
      equal(instance.prop1, 'hello', 'setup called for first plugin');
      equal(instance.prop2, 'konichiwa', 'setup called for second plugin');
      instance.destroy();
      equal(instance.prop1, 'bye', 'cleanup called for first plugin');
      equal(instance.prop2, 'sayonara', 'cleanup called for second plugin');
    });
    test('initialize with plugins', function() {
      var instance, testPlugin1, testPlugin2;

      testPlugin1 = {
        setup: function() {
          this.prop1 = 'hello';
        },
        cleanup: function() {
          this.prop1 = 'bye';
        }
      };
      testPlugin2 = {
        setup: function() {
          this.prop2 = 'konichiwa';
        },
        cleanup: function() {
          this.prop2 = 'sayonara';
        }
      };
      instance = def.createInstance({
        plugins: [testPlugin1, testPlugin2]
      });
      equal(instance.prop1, 'hello', 'setup called for first plugin');
      equal(instance.prop2, 'konichiwa', 'setup called for second plugin');
      instance.destroy();
      equal(instance.prop1, 'bye', 'cleanup called for first plugin');
      equal(instance.prop2, 'sayonara', 'cleanup called for second plugin');
    });
    test('override extend plugins with initialize plugins', function() {
      var TestClass, instance, testPlugin1, testPlugin2;

      testPlugin1 = {
        setup: function() {
          this.prop1 = 'hello';
        },
        cleanup: function() {
          this.prop1 = 'bye';
        }
      };
      testPlugin2 = {
        setup: function() {
          this.prop2 = 'konichiwa';
        },
        cleanup: function() {
          this.prop2 = 'sayonara';
        }
      };
      TestClass = def["class"].extend({
        plugins: [testPlugin1]
      });
      instance = def.createInstance({
        plugins: [testPlugin2]
      });
      notEqual(instance.prop1, 'hello', 'setup not called for extend plugin');
      equal(instance.prop2, 'konichiwa', 'setup called for initialize plugin');
      instance.destroy();
      notEqual(instance.prop1, 'bye', 'cleanup not called for extend plugin');
      equal(instance.prop2, 'sayonara', 'cleanup called for initialize plugin');
    });
  });

}).call(this);
