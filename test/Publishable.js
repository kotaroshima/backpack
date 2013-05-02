// Generated by CoffeeScript 1.6.2
(function() {
  module('Backpack.Publishable');

  _.each(Backpack.testDefs, function(def) {
    test(_.template('<%-name%> publishes with inheritance', def), function() {
      var TestClass, instance;

      TestClass = def["class"].extend({
        publishers: {
          onTestEvent: 'TEST_EVENT'
        },
        onTestEvent: function(arg1, arg2) {}
      });
      instance = new TestClass();
      Backbone.on('TEST_EVENT', function(arg1, arg2) {
        equal(arg1, 'x', 'callback function called and 1st argument passed');
        equal(arg2, 2, 'callback function called and 2nd argument passed');
      });
      instance.onTestEvent('x', 2);
    });
    test(_.template('<%-name%> publishes with initialization parameter', def), function() {
      var instance;

      instance = def.createInstance({
        publishers: {
          onTestEvent: 'TEST_EVENT'
        },
        onTestEvent: function(arg1, arg2) {}
      });
      Backbone.on('TEST_EVENT', function(arg1, arg2) {
        equal(arg1, 'x', 'callback function called and 1st argument passed');
        equal(arg2, 2, 'callback function called and 2nd argument passed');
      });
      instance.onTestEvent('x', 2);
    });
  });

}).call(this);
