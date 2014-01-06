(function() {
  var TestPlugin1, TestPlugin2;

  Backbone.sync = function() {};

  module('Backpack.attach');

  test('attach and detach', 4, function() {
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

  test('attach with context and callback name', 1, function() {
    var source, target;
    source = {
      trigger: function() {}
    };
    target = {
      counter: 0,
      event: function() {
        return this.counter++;
      }
    };
    Backpack.attach(source, 'trigger', target, 'event');
    source.trigger();
    equal(target.counter, 1, 'counter should be incremented.');
  });

  test('attach multiple events', 8, function() {
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

  TestPlugin1 = {
    setup: function() {
      this.prop1 = 'hello';
    },
    hello: function() {
      this.prop = 'plugin1';
    },
    cleanup: function() {
      this.prop1 = 'bye';
    }
  };

  TestPlugin2 = {
    setup: function() {
      this.prop2 = 'konichiwa';
    },
    hello: function() {
      this.prop = 'plugin2';
    },
    cleanup: function() {
      this.prop2 = 'sayonara';
    }
  };

  _.each(Backpack.testDefs, function(def) {
    module(def.name);
    test('extend with plugins', 5, function() {
      var TestClass, instance;
      TestClass = def["class"].extend({
        plugins: [TestPlugin1, TestPlugin2]
      });
      instance = new TestClass();
      equal(instance.prop1, 'hello', 'setup called for first plugin');
      equal(instance.prop2, 'konichiwa', 'setup called for second plugin');
      instance.hello();
      equal(instance.prop, 'plugin2', 'later plugins should override previous plugins');
      instance.destroy();
      equal(instance.prop1, 'bye', 'cleanup called for first plugin');
      equal(instance.prop2, 'sayonara', 'cleanup called for second plugin');
    });
    test('initialize with plugins', 5, function() {
      var instance;
      instance = def.createInstance({
        plugins: [TestPlugin1, TestPlugin2]
      });
      equal(instance.prop1, 'hello', 'setup called for first plugin');
      equal(instance.prop2, 'konichiwa', 'setup called for second plugin');
      instance.hello();
      equal(instance.prop, 'plugin2', 'later plugins should override previous plugins');
      instance.destroy();
      equal(instance.prop1, 'bye', 'cleanup called for first plugin');
      equal(instance.prop2, 'sayonara', 'cleanup called for second plugin');
    });
    test('extend subclass with plugins', 5, function() {
      var TestSubClass, TestSubSubClass, instance;
      TestSubClass = def["class"].extend({
        plugins: [TestPlugin1]
      });
      TestSubSubClass = TestSubClass.extend({
        plugins: [TestPlugin2]
      });
      instance = new TestSubSubClass();
      equal(instance.prop1, 'hello', 'setup called for first plugin');
      equal(instance.prop2, 'konichiwa', 'setup called for second plugin');
      instance.hello();
      equal(instance.prop, 'plugin2', 'later plugins should override previous plugins');
      instance.destroy();
      equal(instance.prop1, 'bye', 'cleanup called for first plugin');
      equal(instance.prop2, 'sayonara', 'cleanup called for second plugin');
    });
    test('both extend plugins and initialize plugins', 5, function() {
      var TestClass, instance;
      TestClass = def["class"].extend({
        plugins: [TestPlugin1]
      });
      instance = def.createInstance({
        plugins: [TestPlugin2]
      }, TestClass);
      equal(instance.prop1, 'hello', 'setup called for extend plugin');
      equal(instance.prop2, 'konichiwa', 'setup called for initialize plugin');
      instance.hello();
      equal(instance.prop, 'plugin2', 'later plugins should override previous plugins');
      instance.destroy();
      equal(instance.prop1, 'bye', 'cleanup called for extend plugin');
      equal(instance.prop2, 'sayonara', 'cleanup called for initialize plugin');
    });
    test('superclass plugins enabled when subclassed without plugins', 2, function() {
      var TestSubClass, TestSubSubClass, instance;
      TestSubClass = def["class"].extend({
        plugins: [TestPlugin1]
      });
      TestSubSubClass = TestSubClass.extend();
      instance = new TestSubSubClass();
      equal(instance.prop1, 'hello', 'setup called for plugin');
      instance.destroy();
      equal(instance.prop1, 'bye', 'cleanup called for plugin');
    });
    test('allPlugins should override superclass plugins', 5, function() {
      var TestSubClass, TestSubSubClass, instance;
      TestSubClass = def["class"].extend({
        allPlugins: [TestPlugin1]
      });
      TestSubSubClass = TestSubClass.extend({
        allPlugins: [TestPlugin2]
      });
      instance = new TestSubSubClass();
      notEqual(instance.prop1, 'hello', 'setup not called for first plugin');
      equal(instance.prop2, 'konichiwa', 'setup called for second plugin');
      instance.hello();
      equal(instance.prop, 'plugin2', 'later plugins should override previous plugins');
      instance.destroy();
      notEqual(instance.prop1, 'bye', 'cleanup not called for first plugin');
      equal(instance.prop2, 'sayonara', 'cleanup called for second plugin');
    });
    test('both extend allPlugins and initialize allPlugins', 5, function() {
      var TestClass, instance;
      TestClass = def["class"].extend({
        allPlugins: [TestPlugin1]
      });
      instance = def.createInstance({
        allPlugins: [TestPlugin2]
      }, TestClass);
      notEqual(instance.prop1, 'hello', 'setup not called for extend plugin');
      equal(instance.prop2, 'konichiwa', 'setup called for initialize plugin');
      instance.hello();
      equal(instance.prop, 'plugin2', 'later plugins should override previous plugins');
      instance.destroy();
      notEqual(instance.prop1, 'bye', 'cleanup not called for extend plugin');
      equal(instance.prop2, 'sayonara', 'cleanup called for initialize plugin');
    });
    test('superclass allPlugins enabled when subclassed without plugins', 2, function() {
      var TestSubClass, TestSubSubClass, instance;
      TestSubClass = def["class"].extend({
        allPlugins: [TestPlugin1]
      });
      TestSubSubClass = TestSubClass.extend();
      instance = new TestSubSubClass();
      equal(instance.prop1, 'hello', 'setup called for plugin');
      instance.destroy();
      equal(instance.prop1, 'bye', 'cleanup called for plugin');
    });
  });

}).call(this);
