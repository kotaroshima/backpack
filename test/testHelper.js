(function() {
  Backpack.testDefs = [
    {
      "class": Backpack.Model,
      name: 'Backpack.Model',
      createInstance: function(options, clazz) {
        if (clazz == null) {
          clazz = Backpack.Model;
        }
        return new clazz(null, options);
      }
    }, {
      "class": Backpack.Collection,
      name: 'Backpack.Collection',
      createInstance: function(options, clazz) {
        if (clazz == null) {
          clazz = Backpack.Collection;
        }
        return new clazz(null, options);
      }
    }, {
      "class": Backpack.View,
      name: 'Backpack.View',
      createInstance: function(options, clazz) {
        if (clazz == null) {
          clazz = Backpack.View;
        }
        return new clazz(options);
      }
    }, {
      "class": Backpack.Class,
      name: 'Backpack.Class',
      createInstance: function(options, clazz) {
        if (clazz == null) {
          clazz = Backpack.Class;
        }
        return new clazz(options);
      }
    }
  ];

}).call(this);
