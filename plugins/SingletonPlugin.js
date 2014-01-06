(function() {
  Backpack.Singleton = {
    setup: function() {
      var singleton,
        _this = this;
      singleton = _.find(Backpack._singletons, function(s) {
        return s.constructor === _this.constructor;
      });
      if (singleton) {
        throw new Error('Only single instance can be initialized');
      } else {
        if (!Backpack._singletons) {
          Backpack._singletons = [];
        }
        Backpack._singletons.push(this);
      }
    },
    staticProps: {
      getInstance: function() {
        var singleton,
          _this = this;
        singleton = _.find(Backpack._singletons, function(s) {
          return s.constructor === _this;
        });
        if (!singleton) {
          singleton = new this();
        }
        return singleton;
      }
    }
  };

}).call(this);
