(function() {
  module('Backpack.AttachPlugin');

  _.each(Backpack.testDefs, function(def) {
    test(_.template('attach and detach <%-name%>', def), 6, function() {
      var TestClass, handler, instance, var1, var2;
      TestClass = def["class"].extend({
        onTestEvent: function(arg1, arg2) {}
      });
      instance = new TestClass();
      var1 = null;
      var2 = null;
      handler = instance.attach('onTestEvent', function(arg1, arg2) {
        var1 = arg1;
        var2 = arg2;
      });
      equal(instance._attached.length, 1);
      instance.onTestEvent('x', 2);
      equal(var1, 'x', 'callback called and 1st argument passed');
      equal(var2, 2, 'callback called and 2nd argument passed');
      instance.detach(handler);
      equal(instance._attached.length, 0);
      instance.onTestEvent('y', 5);
      equal(var1, 'x', "callback wasn't called");
      equal(var2, 2, "callback wasn't called");
    });
    test(_.template('attach and destroy <%-name%>', def), 6, function() {
      var TestClass, handler, instance, var1, var2;
      TestClass = def["class"].extend({
        onTestEvent: function(arg1, arg2) {}
      });
      instance = new TestClass();
      var1 = null;
      var2 = null;
      handler = instance.attach('onTestEvent', function(arg1, arg2) {
        var1 = arg1;
        var2 = arg2;
      });
      equal(instance._attached.length, 1);
      instance.onTestEvent('x', 2);
      equal(var1, 'x', 'callback called and 1st argument passed');
      equal(var2, 2, 'callback called and 2nd argument passed');
      instance.detach(handler);
      equal(instance._attached.length, 0);
      instance.onTestEvent('y', 5);
      equal(var1, 'x', "callback wasn't called");
      equal(var2, 2, "callback wasn't called");
    });
  });

}).call(this);
