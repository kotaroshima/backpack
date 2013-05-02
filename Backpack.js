// Generated by CoffeeScript 1.6.2
(function() {
  var Backpack, Clazz, applyOptions, cleanup, extend, root, setup,
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

  applyOptions = function(self, options) {
    var key, plugins, value;

    if (options == null) {
      options = {};
    }
    self.plugins = options.plugins || self.plugins;
    plugins = _.clone(Backpack.defaultPlugins).concat(self.plugins || []);
    self.setups = [];
    self.cleanups = [];
    _.each(plugins, function(pi) {
      var key, value;

      for (key in pi) {
        if (!__hasProp.call(pi, key)) continue;
        value = pi[key];
        if (key !== 'setup' && key !== 'cleanup' && key !== 'staticProps' && !self[key]) {
          self[key] = value;
        }
      }
      if (pi.setup) {
        self.setups.push(pi.setup);
      }
      if (pi.cleanup) {
        self.cleanups.push(pi.cleanup);
      }
    });
    for (key in options) {
      if (!__hasProp.call(options, key)) continue;
      value = options[key];
      if (key !== 'plugins' && key !== 'initialize') {
        self[key] = value;
      }
    }
  };

  setup = function(self) {
    _.each(self.setups, function(su) {
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
    child.prototype.plugins = protoProps.plugins || [];
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
      applyOptions(this, options);
      if (options != null ? options.initialize : void 0) {
        options.initialize.apply(this, arguments);
      }
      setup(this);
    },
    destroy: function() {
      cleanup(this);
    }
  });

  Clazz.extend = extend;

  Backpack.Model = Backbone.Model.extend({
    initialize: function(attributes, options) {
      applyOptions(this, options);
      if (options != null ? options.initialize : void 0) {
        options.initialize.apply(this, arguments);
      }
      setup(this);
    },
    destroy: function(options) {
      cleanup(this);
      Backbone.Model.prototype.destroy.apply(this, arguments);
    }
  });

  Backpack.Model.extend = extend;

  Backpack.Collection = Backbone.Collection.extend({
    initialize: function(models, options) {
      applyOptions(this, options);
      if (options != null ? options.initialize : void 0) {
        options.initialize.apply(this, arguments);
      }
      setup(this);
    },
    destroy: function() {
      cleanup(this);
    }
  });

  Backpack.Collection.extend = extend;

  Backpack.View = Backbone.View.extend({
    initialize: function(options) {
      applyOptions(this, options);
      if (options != null ? options.initialize : void 0) {
        options.initialize.apply(this, arguments);
      }
      setup(this);
    },
    /*
    * Override so that event handler works even if method has been dynamically overwritten
    * TODO : submit a patch to Backbone
    */

    delegateEvents: function(events) {
      var bindMethod, eventName, key, match, method, methodName, selector,
        _this = this;

      if (!(events || (events = _.result(this, 'events')))) {
        return this;
      }
      this.undelegateEvents();
      bindMethod = function(methodName) {
        var method;

        method = function(e) {
          return _this[methodName](e);
        };
        return _.bind(method, _this);
      };
      for (key in events) {
        if (!__hasProp.call(events, key)) continue;
        methodName = events[key];
        if (!this[methodName] || !_.isFunction(this[methodName])) {
          continue;
        }
        match = key.match(/^(\S+)\s*(.*)$/);
        eventName = match[1];
        selector = match[2];
        method = bindMethod(methodName);
        eventName += '.delegateEvents' + this.cid;
        if (selector === '') {
          this.$el.on(eventName, method);
        } else {
          this.$el.on(eventName, selector, method);
        }
      }
      return this;
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
    /*
    * Attaches an event handler, which will be detached when this object is destroyed
    * if 2 arguments:
    * @param {String} method Name of this object's method to which attach event
    * @param {Function} cb Callback function
    * if 3 arguments:
    * @param {Object} object Object to which attach event
    * @param {String} method Method name of object to which attach event
    * @param {Function} cb Callback function
    */

    attach: function() {
      var handler;

      switch (arguments.length) {
        case 2:
          handler = Backpack.attach(this, arguments[0], arguments[1]);
          break;
        case 3:
          handler = Backpack.attach(arguments[0], arguments[1], arguments[2]);
      }
      this._attached.push(handler);
      return handler;
    },
    /*
    * Detaches an event and it will be removed from event handler list which will be cleaned up on destroy
    * @param {Object} handler Event handler
    */

    detach: function(handler) {
      var index, ret;

      index = _.indexOf(this._attached, handler);
      ret = false;
      if (index !== -1) {
        this._attached.splice(index, 1);
        handler.detach();
        ret = true;
      }
      return ret;
    },
    cleanup: function() {
      _.invoke(this._attached, 'detach');
      this._attached = [];
    }
  };

  Backpack.defaultPlugins.push(Backpack.Attachable);

  Backpack.Subscribable = {
    setup: function() {
      var key, value, _ref;

      this._subscribed = [];
      if (this.subscribers) {
        _ref = this.subscribers;
        for (key in _ref) {
          if (!__hasProp.call(_ref, key)) continue;
          value = _ref[key];
          this.subscribe(key, value);
        }
      }
    },
    /**
    * Subscribe to topic
    * @param {String} topic Topic name to subscribe
    * @param {String|Function} cb Callback function to be called
    */

    subscribe: function(topic, cb) {
      if (_.isString(cb)) {
        cb = this[cb];
      }
      this._subscribed.push([topic, cb]);
      return Backbone.on(topic, cb, this);
    },
    /**
    * Unsubscribe to topic
    * @param {String} topic Topic name to unsubscribe
    * @param {String|Function} cb Callback function
    */

    unsubscribe: function(topic, cb) {
      var found, index, subscribed, _i, _ref;

      if (_.isString(cb)) {
        cb = this[cb];
      }
      found = -1;
      _ref = this._subscribed;
      for (index = _i = _ref.length - 1; _i >= 0; index = _i += -1) {
        subscribed = _ref[index];
        if (topic === subscribed[0] && cb === subscribed[1]) {
          found = index;
          break;
        }
      }
      if (found !== -1) {
        this._subscribed.splice(found, 1);
      }
      return Backbone.off(topic, cb, this);
    },
    cleanup: function() {
      var cb, index, subscribed, _i, _ref;

      _ref = this._subscribed;
      for (index = _i = _ref.length - 1; _i >= 0; index = _i += -1) {
        subscribed = _ref[index];
        this._subscribed.splice(index, 1);
        if (_.isString(cb)) {
          cb = this[cb];
        }
        Backbone.off(topic, cb, this);
      }
    }
  };

  Backpack.defaultPlugins.push(Backpack.Subscribable);

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

}).call(this);
