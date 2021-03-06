(function() {
  module('Backpack.SingletonPlugin');

  _.each(Backpack.testDefs, function(def) {
    test(_.template('only one instance of <%-name%> can be initialized', def), 2, function() {
      var TestSingleton, instance;
      TestSingleton = def["class"].extend({
        plugins: [Backpack.Singleton],
        initialize: function() {
          def["class"].prototype.initialize.apply(this, arguments);
          this.name = 'testSingleton';
        }
      });
      instance = new TestSingleton();
      equal(instance.name, 'testSingleton');
      raises(function() {
        new TestSingleton();
      }, Error, 'throws an error when trying to initialize 2nd instance');
    });
    test(_.template('get the same instance of <%-name%>', def), 1, function() {
      var TestSingleton, instance1, instance2;
      TestSingleton = def["class"].extend({
        plugins: [Backpack.Singleton]
      });
      instance1 = TestSingleton.getInstance();
      instance2 = TestSingleton.getInstance();
      equal(instance1, instance2);
    });
  });

}).call(this);
