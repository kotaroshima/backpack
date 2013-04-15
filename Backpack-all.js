// Generated by CoffeeScript 1.4.0
(function() {
  var Backpack, Clazz, cleanup, extend, root, setup,
    __hasProp = {}.hasOwnProperty;

  root = this;

  Backpack = root.Backpack = {};

  Backpack.attach = function(context, method, callback) {
    var origFunc;
    origFunc = context[method];
    context[method] = function() {
      var ret;
      ret = origFunc.apply(context, arguments);
      if (callback) {
        callback.apply(this, arguments);
      }
      return ret;
    };
    return {
      detach: function() {
        context[method] = origFunc;
      }
    };
  };

  Backpack.defaultPlugins = [];

  setup = function(self, options) {
    var key, setups, value;
    if (options == null) {
      options = {};
    }
    for (key in options) {
      if (!__hasProp.call(options, key)) continue;
      value = options[key];
      if (key === 'plugins') {
        self[key] = _.clone(Backpack.defaultPlugins).concat(options.plugins);
      } else {
        self[key] = value;
      }
    }
    setups = [];
    _.each(self.plugins, function(pi) {
      for (key in pi) {
        if (!__hasProp.call(pi, key)) continue;
        value = pi[key];
        if (key !== 'setup' && key !== 'cleanup' && key !== 'staticProps') {
          self[key] = value;
        }
      }
      if (pi.setup) {
        setups.push(pi.setup);
      }
      if (pi.cleanup) {
        if (!self.cleanups) {
          self.cleanups = [];
        }
        self.cleanups.push(pi.cleanup);
      }
    });
    _.each(setups, function(su) {
      su.apply(self);
    });
  };

  cleanup = function(self) {
    _.each(self.cleanups, function(cu) {
      cu.apply(self);
    });
  };

  extend = function(protoProps, staticProps) {
    var child;
    child = Backbone.Model.extend.call(this, protoProps, staticProps);
    child.prototype.plugins = _.clone(Backpack.defaultPlugins).concat(protoProps.plugins || []);
    if (protoProps.plugins) {
      _.each(protoProps.plugins, function(pi) {
        if (pi.staticProps) {
          _.extend(child, pi.staticProps);
        }
      });
    }
    return child;
  };

  Clazz = Backpack.Class = function() {
    this.cid = _.uniqueId('obj');
    this.initialize.apply(this, arguments);
  };

  _.extend(Clazz.prototype, Backbone.Events, {
    initialize: function() {
      var options;
      options = arguments.length > 0 ? arguments[arguments.length - 1] : {};
      setup(this, options);
    },
    destroy: function() {
      cleanup(this);
    }
  });

  Clazz.extend = extend;

  Backpack.Model = Backbone.Model.extend({
    initialize: function(attributes, options) {
      Backbone.Model.prototype.initialize.apply(this, arguments);
      setup(this, options);
    },
    destroy: function(options) {
      cleanup(this);
      Backbone.Model.prototype.destroy.apply(this, arguments);
    }
  });

  Backpack.Model.extend = extend;

  Backpack.Collection = Backbone.Collection.extend({
    initialize: function(models, options) {
      Backbone.Collection.prototype.initialize.apply(this, arguments);
      setup(this, options);
    },
    destroy: function() {
      cleanup(this);
    }
  });

  Backpack.Collection.extend = extend;

  Backpack.View = Backbone.View.extend({
    initialize: function(options) {
      Backbone.View.prototype.initialize.apply(this, arguments);
      setup(this, options);
    },
    remove: function() {
      cleanup(this);
      Backbone.View.prototype.remove.apply(this, arguments);
    },
    destroy: function() {
      this.remove();
    }
  });

  Backpack.View.extend = extend;

  Backpack.Attachable = {
    setup: function() {
      this._attached = [];
    },
    attach: function(method, callback) {
      var handler;
      handler = Backpack.attach(this, method, callback);
      this._attached.push(handler);
      return handler;
    },
    cleanup: function() {
      _.invoke(this._attached, 'detach');
    }
  };

  Backpack.defaultPlugins.push(Backpack.Attachable);

  Backpack.Container = {
    setup: function() {
      this.children = [];
    },
    getChild: function(index) {
      return this.children[index];
    },
    addChild: function(view) {
      this.$el.append(view.$el);
      this.children.push(view);
    },
    clearChildren: function() {
      var i, _i, _ref;
      for (i = _i = _ref = this.children.length - 1; _i >= 0; i = _i += -1) {
        this.removeChild(i);
      }
    },
    removeChild: function(index) {
      this.children[index].remove();
      this.children.splice(index, 1);
    },
    filterChildren: function(options) {
      _.filter(this.children, function(view) {
        if (view.model.filter(options)) {
          view.$el.show();
        } else {
          view.$el.hide();
        }
      });
    },
    cleanup: function() {
      this.clearChildren();
    }
  };

  Backpack.Publishable = {
    setup: function() {
      var key, value, _ref;
      if (this.publishers) {
        _ref = this.publishers;
        for (key in _ref) {
          if (!__hasProp.call(_ref, key)) continue;
          value = _ref[key];
          this.attachTrigger(key, value);
        }
      }
    },
    attachTrigger: function(method, topic) {
      Backpack.attach(this, method, function() {
        var args;
        args = [].slice.call(arguments, 0);
        args.unshift(topic);
        Backbone.trigger.apply(Backbone, args);
      });
    }
  };

  Backpack.defaultPlugins.push(Backpack.Publishable);

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

  Backpack.Sortable = {
    setup: function() {
      if (this.sortable !== false) {
        this.setSortable(true);
      }
    },
    setSortable: function(isSortable) {
      var _this = this;
      if (isSortable) {
        if (this._sortableInit) {
          this.$el.sortable("enable");
        } else {
          this.$el.sortable({
            start: function(event, ui) {
              ui.item.startIndex = ui.item.index();
            },
            stop: function(event, ui) {
              var collection, model, newIndex;
              collection = _this.collection;
              model = collection.at(ui.item.startIndex);
              newIndex = ui.item.index();
              collection.remove(model);
              collection.add(model, {
                at: newIndex
              });
            }
          });
          this._sortableInit = true;
        }
      } else {
        if (this._sortableInit) {
          this.$el.sortable("disable");
        }
      }
    },
    cleanup: function() {
      if (this._sortableInit) {
        this.$el.sortable("destroy");
      }
    }
  };

  Backpack.Subscribable = {
    setup: function() {
      var cb, key, value, _ref;
      if (this.subscribers) {
        _ref = this.subscribers;
        for (key in _ref) {
          if (!__hasProp.call(_ref, key)) continue;
          value = _ref[key];
          cb = _.isString(value) ? this[value] : value;
          Backbone.on(key, cb, this);
        }
      }
    },
    cleanup: function() {
      var cb, key, value, _ref;
      if (this.subscribers) {
        _ref = this.subscribers;
        for (key in _ref) {
          if (!__hasProp.call(_ref, key)) continue;
          value = _ref[key];
          cb = _.isString(value) ? this[value] : value;
          Backbone.off(key, cb, this);
        }
      }
    }
  };

  Backpack.defaultPlugins.push(Backpack.Subscribable);

  Backpack.ListView = Backpack.View.extend({
    plugins: [Backpack.Container],
    itemClass: Backbone.View,
    initialize: function(options) {
      Backpack.View.prototype.initialize.apply(this, arguments);
      if (options.itemClass) {
        this.itemClass = options.itemClass;
      }
      this.collection.on("add remove reset", this.render, this);
      this.render();
    },
    render: function() {
      var models,
        _this = this;
      models = this.collection.models;
      this.clearChildren();
      if (models.length > 0) {
        _.each(models, function(model) {
          var child;
          child = _this.createChild(model);
          _this.addChild(child);
        });
      } else {
        this.$el.html("No Items");
      }
      return this;
    },
    createChild: function(model) {
      var view;
      view = new this.itemClass({
        model: model
      });
      return view.render();
    },
    remove: function() {
      this.collection.off("add remove reset", this.render);
      Backpack.View.prototype.remove.call(this);
    }
  });

}).call(this);