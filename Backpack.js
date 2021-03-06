(function() {
  var Backpack, Clazz, applyOptions, cleanup, extend, root, setup,
    __hasProp = {}.hasOwnProperty;

  root = this;

  Backpack = root.Backpack = {};

  /**
  * Attach event handler
  * if 3 arguments
  * @param {Object} obj Object to which attach event
  * @param {String} method Name of this object's method to which attach event
  * @param {Function} callback Callback function
  * if 4 arguments
  * @param {Object} obj Object to which attach event
  * @param {String} method Name of this object's method to which attach event
  * @param {Object} context Context for callback function
  * @param {Function|String} callback Callback function or callback function name within context
  */


  Backpack.attach = function() {
    var callback, context, method, obj, origFunc;
    obj = arguments[0];
    method = arguments[1];
    switch (arguments.length) {
      case 3:
        callback = arguments[2];
        break;
      case 4:
        context = arguments[2];
        if (_.isString(arguments[3])) {
          callback = context[arguments[3]];
        } else {
          callback = arguments[3];
        }
    }
    origFunc = obj[method];
    obj[method] = function() {
      var ret;
      ret = origFunc.apply(obj, arguments);
      if (!context) {
        context = this;
      }
      if (callback) {
        callback.apply(context, arguments);
      }
      return ret;
    };
    return {
      detach: function() {
        obj[method] = origFunc;
      }
    };
  };

  Backpack.defaultPlugins = [];

  applyOptions = function(self, options) {
    var key, mixins, plugins, value;
    if (options == null) {
      options = {};
    }
    if (options.allPlugins) {
      plugins = options.allPlugins;
    } else {
      plugins = self.allPlugins || [];
      if (options.plugins) {
        plugins = plugins.concat(options.plugins);
      }
    }
    plugins = _.clone(Backpack.defaultPlugins).concat(plugins);
    self.setups = [];
    self.cleanups = [];
    mixins = {};
    _.each(plugins, function(pi) {
      var key, value;
      for (key in pi) {
        if (!__hasProp.call(pi, key)) continue;
        value = pi[key];
        if (key !== 'setup' && key !== 'cleanup' && key !== 'staticProps') {
          mixins[key] = value;
        }
      }
      if (pi.setup) {
        self.setups.push(pi.setup);
      }
      if (pi.cleanup) {
        self.cleanups.push(pi.cleanup);
      }
    });
    for (key in mixins) {
      if (!__hasProp.call(mixins, key)) continue;
      value = mixins[key];
      if (!self[key]) {
        self[key] = value;
      }
    }
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
    var child, plugins;
    child = Backbone.Model.extend.call(this, protoProps, staticProps);
    if (protoProps) {
      plugins = protoProps.allPlugins;
      if (plugins) {
        /* Override superclass plugins with subclass plugins*/

        child.prototype.allPlugins = plugins;
      } else {
        plugins = protoProps.plugins;
        if (plugins) {
          if (child.prototype.allPlugins) {
            child.prototype.allPlugins = child.prototype.allPlugins.concat(plugins);
          } else {
            child.prototype.allPlugins = plugins;
          }
        }
      }
      /* apply static props*/

      if (plugins) {
        _.each(plugins, function(pi) {
          if (pi.staticProps) {
            _.extend(child, pi.staticProps);
          }
        });
      }
    }
    if (!child.prototype.plugins) {
      child.prototype.plugins = [];
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
      setup(this);
      if (options != null ? options.initialize : void 0) {
        options.initialize.apply(this, arguments);
      }
    },
    destroy: function() {
      cleanup(this);
    }
  });

  Clazz.extend = extend;

  Backpack.Model = Backbone.Model.extend({
    initialize: function(attributes, options) {
      applyOptions(this, options);
      setup(this);
      if (options != null ? options.initialize : void 0) {
        options.initialize.apply(this, arguments);
      }
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
      setup(this);
      if (options != null ? options.initialize : void 0) {
        options.initialize.apply(this, arguments);
      }
    },
    reset: function() {
      Backbone.Collection.prototype.reset.apply(this, arguments);
      this.trigger("Backpack.Collection:reset");
    },
    destroy: function() {
      cleanup(this);
    }
  });

  Backpack.Collection.extend = extend;

  Backpack.View = Backbone.View.extend({
    initialize: function(options) {
      applyOptions(this, options);
      setup(this);
      if (options != null ? options.initialize : void 0) {
        options.initialize.apply(this, arguments);
      }
    },
    /**
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
        if ((!this[methodName] || !_.isFunction(this[methodName])) && !_.isFunction(methodName)) {
          continue;
        }
        match = key.match(/^(\S+)\s*(.*)$/);
        eventName = match[1];
        selector = match[2];
        if (_.isFunction(methodName)) {
          method = methodName;
        } else {
          method = bindMethod(methodName);
        }
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

  Backpack.AttachPlugin = {
    setup: function() {
      this._attached = [];
    },
    /**
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
    /**
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

  Backpack.defaultPlugins.push(Backpack.AttachPlugin);

  Backpack.SubscribePlugin = {
    /**
    * Sets up subscribers from `subscribers` property
    * `subscribers` property takes key-value pair of:
    * - key : topic name of events to subscribe
    * - value : method name of callback function
    */

    setup: function() {
      var key, value, _ref;
      this._subscribers = [];
      if (this.subscribers) {
        _ref = this.subscribers;
        for (key in _ref) {
          if (!__hasProp.call(_ref, key)) continue;
          value = _ref[key];
          this.addSubscriber(key, value);
        }
      }
    },
    /**
    * Subscribe to topic
    * @param {String} topic Topic name of events to subscribe
    * @param {String|Function} cb Callback function to be called
    */

    addSubscriber: function(topic, cb) {
      if (_.isString(cb)) {
        cb = this[cb];
      }
      this._subscribers.push({
        topic: topic,
        callback: cb
      });
      return Backbone.on(topic, cb, this);
    },
    /**
    * Unsubscribe to topic
    * @param {String} topic Topic name to unsubscribe
    * @param {String|Function} cb Callback function
    * @return {Boolean} true if publisher has been removed, false if not
    */

    removeSubscriber: function(topic, cb) {
      var found, index, subscriber, _i, _ref;
      if (_.isString(cb)) {
        cb = this[cb];
      }
      found = -1;
      _ref = this._subscribers;
      for (index = _i = _ref.length - 1; _i >= 0; index = _i += -1) {
        subscriber = _ref[index];
        if (topic === subscriber.topic && cb === subscriber.callback) {
          found = index;
          break;
        }
      }
      if (found >= 0) {
        if (found !== -1) {
          this._subscribers.splice(found, 1);
        }
        Backbone.off(topic, cb, this);
        return true;
      }
      return false;
    },
    /**
    * Remove all subscribers on destroy
    */

    cleanup: function() {
      var _this = this;
      _.each(this._subscribers, function(subscriber) {
        return Backbone.off(subscriber.topic, subscriber.callback, _this);
      });
      this._subscribers = [];
    }
  };

  Backpack.defaultPlugins.push(Backpack.SubscribePlugin);

  Backpack.PublishPlugin = {
    /**
    * Sets up publishers from `publishers` property
    * `publishers` property takes key-value pair of:
    * - key : method name to trigger the event
    * - value : topic name of events to be published
    */

    setup: function() {
      var key, value, _ref;
      this._publishers = [];
      if (this.publishers) {
        _ref = this.publishers;
        for (key in _ref) {
          if (!__hasProp.call(_ref, key)) continue;
          value = _ref[key];
          this.addPublisher(key, value);
        }
      }
    },
    /**
    * Add publisher
    * @param {String} method Method name to trigger the event
    * @param {String} topic Topic name of events to be published
    * @return {Object} handler object (return value of Backpack.attach)
    */

    addPublisher: function(method, topic) {
      var handler;
      handler = Backpack.attach(this, method, function() {
        var args;
        args = [].slice.call(arguments, 0);
        args.unshift(topic);
        Backbone.trigger.apply(Backbone, args);
      });
      this._publishers.push({
        handler: handler,
        method: method,
        topic: topic
      });
      return handler;
    },
    /**
    * Remove publisher
    * If 1 argument
    * @param {Object} handler Handler object to detach (return value of Backpack.attach)
    * If 2 arguments
    * @param {String} method Method name to trigger the event
    * @param {String} topic Topic name of events to be published
    * @return {Boolean} true if publisher has been removed, false if not
    */

    removePublisher: function() {
      var found, index, publisher, _i, _ref;
      found = -1;
      _ref = this._publishers;
      for (index = _i = _ref.length - 1; _i >= 0; index = _i += -1) {
        publisher = _ref[index];
        if (arguments.length > 1 && _.isString(arguments[0])) {
          if (arguments[0] === publisher.method && arguments[1] === publisher.topic) {
            found = index;
            break;
          }
        } else {
          if (arguments[0] === publisher.handler) {
            found = index;
            break;
          }
        }
      }
      if (found >= 0) {
        this._publishers[found].handler.detach();
        this._publishers.splice(found, 1);
        return true;
      }
      return false;
    },
    /**
    * Remove all publishers on destroy
    */

    cleanup: function() {
      _.each(this._publishers, function(publisher) {
        publisher.handler.detach();
      });
      this._publishers = [];
    }
  };

  Backpack.defaultPlugins.push(Backpack.PublishPlugin);

}).call(this);
