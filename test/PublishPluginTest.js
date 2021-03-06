(function() {
  module('Backpack.PublishPlugin', {
    setup: function() {
      var _this = this;
      this.prop1 = null;
      this.prop2 = null;
      Backbone.on('TEST_EVENT', function(arg1, arg2) {
        _this.prop1 = arg1;
        _this.prop2 = arg2;
      });
    },
    teardown: function() {
      Backbone.off('TEST_EVENT');
      this.prop1 = null;
      this.prop2 = null;
    }
  });

  _.each(Backpack.testDefs, function(def) {
    test(_.template('<%-name%> publishes with inheritance', def), 2, function() {
      var TestClass, instance;
      TestClass = def["class"].extend({
        publishers: {
          onTestEvent: 'TEST_EVENT'
        },
        onTestEvent: function(arg1, arg2) {}
      });
      instance = new TestClass();
      instance.onTestEvent('x', 2);
      equal(this.prop1, 'x', 'callback function called and 1st argument passed');
      equal(this.prop2, 2, 'callback function called and 2nd argument passed');
    });
    test(_.template('<%-name%> publishes with initialization parameter', def), 2, function() {
      var instance;
      instance = def.createInstance({
        publishers: {
          onTestEvent: 'TEST_EVENT'
        },
        onTestEvent: function(arg1, arg2) {}
      });
      instance.onTestEvent('x', 2);
      equal(this.prop1, 'x', 'callback function called and 1st argument passed');
      equal(this.prop2, 2, 'callback function called and 2nd argument passed');
    });
    test(_.template('<%-name%> add publisher after initialize', def), 2, function() {
      var instance;
      instance = def.createInstance({
        onTestEvent: function(arg1, arg2) {}
      });
      instance.addPublisher('onTestEvent', 'TEST_EVENT');
      instance.onTestEvent('x', 2);
      equal(this.prop1, 'x', 'callback function called and 1st argument passed');
      equal(this.prop2, 2, 'callback function called and 2nd argument passed');
    });
    test(_.template('<%-name%> remove publisher with method name, topic name', def), 3, function() {
      var instance, ret;
      instance = def.createInstance({
        publishers: {
          onTestEvent: 'TEST_EVENT'
        },
        onTestEvent: function(arg1, arg2) {}
      });
      ret = instance.removePublisher('onTestEvent', 'TEST_EVENT');
      this.prop1 = 'z';
      this.prop2 = 1;
      instance.onTestEvent('y', 3);
      equal(ret, true, 'publisher removed successfully');
      equal(this.prop1, 'z', 'callback function not called');
      equal(this.prop2, 1, 'callback function not called');
    });
    test(_.template('<%-name%> remove publisher with attach handler', def), 3, function() {
      var handler, instance, ret;
      instance = def.createInstance({
        onTestEvent: function(arg1, arg2) {}
      });
      handler = instance.addPublisher('onTestEvent', 'TEST_EVENT');
      ret = instance.removePublisher(handler);
      this.prop1 = 'z';
      this.prop2 = 1;
      instance.onTestEvent('y', 3);
      equal(ret, true, 'publisher removed successfully');
      equal(this.prop1, 'z', 'callback function not called');
      equal(this.prop2, 1, 'callback function not called');
    });
    test(_.template('<%-name%> all publishers removed on destroy', def), 2, function() {
      var instance;
      instance = def.createInstance({
        publishers: {
          onTestEvent: 'TEST_EVENT'
        },
        onTestEvent: function(arg1, arg2) {}
      });
      this.prop1 = 'z';
      this.prop2 = 1;
      instance.destroy();
      instance.onTestEvent('y', 3);
      equal(this.prop1, 'z', 'callback function not called');
      equal(this.prop2, 1, 'callback function not called');
    });
  });

}).call(this);
