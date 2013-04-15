// Generated by CoffeeScript 1.4.0
(function() {

  module('Backpack.Singleton');

  test('only one instance can be initialized', function() {
    var TestSingleton, instance;
    TestSingleton = Backpack.Class.extend({
      plugins: [Backpack.Singleton],
      initialize: function() {
        Backpack.Class.prototype.initialize.apply(this, arguments);
        this.name = 'testSingleton';
      }
    });
    instance = new TestSingleton();
    equal(instance.name, 'testSingleton');
    raises(function() {
      new TestSingleton();
    }, Error, 'throws an error when trying to initialize 2nd instance');
    console.log('Backpack._singletons2=' + Backpack._singletons);
  });

  test('get the same instance', function() {
    var TestSingleton, instance1, instance2;
    TestSingleton = Backpack.Class.extend({
      plugins: [Backpack.Singleton],
      count: 0,
      initialize: function() {
        Backpack.Class.prototype.initialize.apply(this, arguments);
        this.count++;
      }
    });
    instance1 = TestSingleton.getInstance();
    equal(instance1.count, 1);
    instance2 = TestSingleton.getInstance();
    equal(instance1.count, 1);
    equal(instance2.count, 1);
  });

}).call(this);
