(function() {
  var Backpack, CLS_LISTVIEW_EDIT, CLS_REMOVE_CONFIRM, Clazz, EditableItemView, applyOptions, cleanup, extend, root, setup,
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

  /**
  * A plugin to make a view container
  */


  Backpack.ContainerPlugin = {
    /**
    * Setup containerNode and add child views on initialize
    */

    setup: function() {
      var containerNode;
      containerNode = this.containerNode;
      if (!containerNode) {
        this.containerNode = this.$el;
      }
      if (!this.children) {
        this.children = [];
      }
      if (this.autoRender !== false) {
        this.renderContainer();
      }
    },
    renderContainer: function() {
      var _this = this;
      _.each(this.children, function(child) {
        _this.addView(child);
      });
      return this;
    },
    /**
    * Get child view at specified index
    * @param {Backbone.View|Integer|String} child Child view instance, or child index, or 'name' property of child
    * @return {Backbone.View}
    */

    getChild: function(child) {
      if (child && child.cid) {
        return _.find(this.children, function(view) {
          return view === child;
        });
      } else if (_.isNumber(child)) {
        return this.children[child];
      } else if (_.isString(child)) {
        return _.find(this.children, function(view) {
          return view.name === child;
        });
      } else {
        return null;
      }
    },
    /**
    * Add view to container node
    * @param {Backbone.View} view A view to add
    * @param {Object} options optional parameters
    * @param {integer} options.at index to insert at. If not specified, will be appended at the end.
    * @return {Backbone.View} view that has been added
    */

    addView: function(view, options) {
      var childNodes, index;
      index = options != null ? options.at : void 0;
      childNodes = this.containerNode.find('>*');
      if (0 <= index && index < childNodes.length) {
        view.$el.insertBefore(childNodes.eq(index));
      } else {
        this.containerNode.append(view.$el);
      }
      return view;
    },
    /**
    * Add view as child
    * @param {Backbone.View} view A view to add
    * @param {Object} options optional parameters
    * @param {integer} options.at index to insert at. If not specified, will be appended at th end.
    * @return {Backbone.View} view that has been added
    */

    addChild: function(view, options) {
      var index;
      index = options != null ? options.at : void 0;
      if (0 <= index && index < this.children.length) {
        this.children.splice(index, 0, view);
      } else {
        this.children.push(view);
      }
      return this.addView(view, options);
    },
    /**
    * Remove child view at specified index
    * @param {Backbone.View|Integer} view A view to remove or child index
    * @param {Object} options optional parameters
    * @param {boolean} options.silent If true, it will not animate
    * @return {Backbone.View} a removed view
    */

    removeChild: function(view, options) {
      var child, index;
      if (_.isNumber(view)) {
        index = view;
      } else {
        index = _.indexOf(this.children, view);
      }
      if (index >= 0) {
        child = this.children[index];
        child.remove();
        this.children.splice(index, 1);
        this.onChildRemoved(child);
      }
      return child;
    },
    /**
    * A hook to notify that child view has been removed
    * @param {Backbone.View} view A view which is removed
    */

    onChildRemoved: function(view) {},
    /**
    * Clear all children
    */

    clearChildren: function() {
      var i, _i, _ref;
      for (i = _i = _ref = this.children.length - 1; _i >= 0; i = _i += -1) {
        this.removeChild(i, {
          silent: true
        });
      }
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
    /**
    * Clear children on destroy
    */

    cleanup: function() {
      this.clearChildren();
    }
  };

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

  /**
  * A plugin to use jQuery UI Sortable
  * options :
  *   sortable {Boolean} pass `false` if you don't want to make it sortable on initialization (default `true`)
  *   sortableOptions {Object} initialization option to pass when initializing sortable
  */


  Backpack.SortablePlugin = {
    /**
    * Set sortable on initialize
    * By default, sets sortable. If `sortable` property is given `false`, it doesn't make it sortable.
    */

    setup: function() {
      if (this.sortable !== false) {
        this.setSortable(true);
      }
    },
    _getSortableContainer: function() {
      return this.containerNode || this.$el;
    },
    /**
    * Set this view sortable
    * @param {Boolean} true to enable sortable, false to disable sortable
    */

    setSortable: function(isSortable) {
      var containerNode, options,
        _this = this;
      containerNode = this._getSortableContainer();
      if (isSortable) {
        if (this._sortableInit) {
          containerNode.sortable('enable');
        } else {
          options = {
            start: function(event, ui) {
              ui.item.startIndex = ui.item.index();
            },
            stop: function(event, ui) {
              var collection, model, models, newIndex;
              collection = _this.collection;
              model = collection.at(ui.item.startIndex);
              newIndex = ui.item.index();
              models = collection.models;
              models.splice(ui.item.startIndex, 1);
              models.splice(newIndex, 0, model);
              collection.reset(models);
              event.stopPropagation();
            }
          };
          if (this.sortableOptions) {
            options = _.extend(options, this.sortableOptions);
          }
          containerNode.sortable(options);
          this._sortableInit = true;
        }
      } else {
        if (this._sortableInit) {
          containerNode.sortable('disable');
        }
      }
    },
    /**
    * Cleanup sortable on destroy
    */

    cleanup: function() {
      if (this._sortableInit) {
        this._getSortableContainer().sortable('destroy');
      }
    }
  };

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

  /**
  * A plugin to render HTML templates for views
  */


  Backpack.TemplatePlugin = {
    setup: function() {
      var key, val, _ref;
      if (this.model) {
        this.model.on('change', this.renderTemplate, this);
      }
      this.renderTemplate();
      /* cache jQuery objects of HTML nodes to be referenced later*/

      if (this.templateNodes) {
        _ref = this.templateNodes;
        for (key in _ref) {
          if (!__hasProp.call(_ref, key)) continue;
          val = _ref[key];
          this[key] = this.$(val);
        }
      }
    },
    /**
    * Renders template HTML
    * If model is specified, interpolates model attributes.
    * Otherwise, interpolates view options
    */

    renderTemplate: function() {
      var template;
      template = this.template;
      if (_.isFunction(template)) {
        template = template(this.model ? this.model.attributes : this.options);
      }
      this.$el.html(template);
    },
    cleanup: function() {
      if (this.model) {
        this.model.off('change', this.renderTemplate);
      }
    }
  };

  /**
  * A view that has action buttons in the left/right
  */


  Backpack.ActionView = Backpack.View.extend({
    plugins: [Backpack.TemplatePlugin],
    template: _.template('<%= leftActionHtml %><span class="main-cell"><%= text %></span><%= rightActionHtml %>'),
    templateNodes: {
      mainCell: '.main-cell'
    },
    initialize: function(options) {
      var actions, leftActionHtml, leftActions, rightActionHtml, rightActions;
      this.$el.addClass('action-view');
      if (!this.events) {
        this.events = {};
      }
      actions = options.actions || this.actions;
      if (actions) {
        leftActions = actions.left;
        if (leftActions) {
          leftActionHtml = this._processActions(leftActions, true);
        }
        rightActions = _.isArray(actions) ? actions : actions.right;
        if (rightActions) {
          rightActionHtml = this._processActions(rightActions, false);
        }
      }
      _.defaults(this.options, {
        leftActionHtml: leftActionHtml || '',
        rightActionHtml: rightActionHtml || '',
        text: ''
      });
      Backpack.View.prototype.initialize.apply(this, arguments);
      this.delegateEvents(this.events);
      if (options.itemView) {
        this.itemView = options.itemView;
      }
      if (options.itemOptions) {
        this.itemOptions = options.itemOptions;
      }
    },
    _buttonTemplate: _.template('<<%- tagName %> class="<%- iconClass %>" title="<%- title %>"><%- text %></<%- tagName %>>'),
    _processActions: function(actions, isLeft) {
      var html,
        _this = this;
      html = '<span class="' + (isLeft ? 'left-cell' : 'right-cell') + '">';
      _.each(actions, function(action) {
        var iconClass, onClick;
        iconClass = action.iconClass;
        onClick = action.onClick;
        if (onClick) {
          if (_.isString(onClick)) {
            onClick = _this[onClick];
          }
          if (onClick && _.isFunction(onClick)) {
            _this.events['click .' + iconClass] = _.bind(onClick, _this);
          }
        }
        action = _.defaults(action, {
          tagName: onClick ? 'button' : 'span',
          iconClass: '',
          title: '',
          text: ''
        });
        html += _this._buttonTemplate(action);
      });
      return html += '</span>';
    },
    render: function(options) {
      var view;
      if (this.itemView) {
        if (!this.child) {
          view = this.child = new this.itemView(this.itemOptions);
          this.mainCell.append(view.$el);
        }
        view.render();
      } else {
        this.mainCell.text(options ? options.text : '');
      }
      return this;
    },
    destroy: function() {
      if (this.itemView && this.itemView.destroy) {
        this.child.destroy();
      }
      Backpack.View.prototype.destroy(this, arguments);
    }
  });

  /**
  * A view that stacks its children
  */


  Backpack.StackView = Backpack.View.extend({
    plugins: [Backpack.ContainerPlugin],
    effects: {
      HIDE_BACKWARD: [
        "slide", {
          direction: "right"
        }, "slow"
      ],
      HIDE_FORWARD: [
        "slide", {
          direction: "left"
        }, "slow"
      ],
      SHOW_BACKWARD: [
        "slide", {
          direction: "left"
        }, "slow"
      ],
      SHOW_FORWARD: [
        "slide", {
          direction: "right"
        }, "slow"
      ]
    },
    /**
    * Constructor
    * @param {Object} [options={}] Initialization option
    * @param {Backpack.View[]} [options.children] Child views
    * @param {integer} [options.showIndex=0] Index of child view to show on init
    * @param {Object} [options.navigationEvents] Map to define event handler to show child.
    *    key is child view's 'name' property, and value is child view's method name to trigger selection
    */

    initialize: function(options) {
      var showIndex,
        _this = this;
      if (options == null) {
        options = {};
      }
      Backpack.View.prototype.initialize.apply(this, arguments);
      this.$el.css({
        position: "relative"
      });
      this.attach('addView', function(view, options) {
        if ((options != null ? options.showOnAdd : void 0) === true) {
          _this.showChild(view, true);
        }
      });
      showIndex = options.showIndex || 0;
      if (this.children && ((0 <= showIndex && showIndex < this.children.length))) {
        this._currentView = this.children[showIndex];
        this._previousView = this._currentView;
      }
      this.render();
    },
    /**
    * Select only one of its children and hide others
    * @returns {Backpack.View} this instance
    */

    render: function() {
      this.showChild(this._currentView, true);
      return this;
    },
    /**
    * Override Backpack.ContainerPlugin to attach navigation events
    * @param {Backbone.View} view A view to add
    * @param {Object} options optional parameters
    * @param {boolean} options.showOnAdd if true, this view will be shown when added
    */

    addView: function(view, options) {
      var eventDef, navigationEvents, stackEvent,
        _this = this;
      view.$el.css({
        position: "absolute",
        width: "99%"
      });
      Backpack.ContainerPlugin.addView.apply(this, arguments);
      navigationEvents = this.navigationEvents;
      if (navigationEvents) {
        stackEvent = navigationEvents[view.name];
        if (stackEvent) {
          eventDef = _.isArray(stackEvent) ? stackEvent : [stackEvent];
          _.each(eventDef, function(def) {
            _this.attachNavigationEvent(view, def);
          });
        }
      }
      view.$el.hide();
    },
    /**
    * Override Backpack.ContainerPlugin to show added view if this is the only child
    */

    addChild: function(view, options) {
      if (this.children.length === 0) {
        if (!options) {
          options = {};
        }
        options.showOnAdd = true;
      }
      return Backpack.ContainerPlugin.addChild.apply(this, [view, options]);
    },
    /**
    * Override Backpack.ContainerPlugin to show different child if selected child has been removed
    */

    removeChild: function(view) {
      var child, index;
      view = this.getChild(view);
      if (view === this._currentView) {
        index = _.indexOf(this.children, view);
        if (this.children.length > 1) {
          if (index > 0) {
            child = this.getChild(index - 1, true);
          } else if (index === 0) {
            child = this.getChild(1, true);
          }
        } else {
          child = null;
        }
        this.showChild(child, true);
      }
      return Backpack.ContainerPlugin.removeChild.apply(this, arguments);
    },
    /**
    * Attaches event of child view to show that view
    * @param {Backpack.View} view Child view
    * @param {Object} navigationDef map to define navigation event
    * @param {String} navigationDef.event Method name to trigger navigation event
    * @param {String} [navigationDef.target] `name` property of target view
    * @param {boolean} [navigationDef.back] if true, shows previously shown child view
    */

    attachNavigationEvent: function(view, navigationDef) {
      var targetView,
        _this = this;
      if (navigationDef.back === true) {
        view.attach(view, navigationDef.event, function() {
          _this.onBack();
        });
      } else if (navigationDef.target) {
        targetView = _.find(this.children, function(child) {
          return child.name === navigationDef.target;
        });
        view.attach(view, navigationDef.event, function() {
          _this.showChild(targetView);
        });
      }
    },
    onBack: function() {
      this.showPreviousChild();
    },
    /**
    * Hides previously shown child view and shows another child view
    * @param {Backbone.View|Integer|String} child Child view instance or child index or 'name' property of child view
    * @param {boolean} bNoAnimation if true, show child without animation
    * @return {Backbone.View} shown child view
    */

    showChild: function(child, bNoAnimation) {
      var bBack, hideEffect, hideKey, showEffect, showKey;
      child = this.getChild(child);
      bBack = _.indexOf(this.children, child) < _.indexOf(this.children, this._currentView);
      if (this._currentView) {
        hideKey = bBack ? 'HIDE_BACKWARD' : 'HIDE_FORWARD';
        if (!bNoAnimation) {
          hideEffect = this.effects[hideKey];
        }
        this._currentView.$el.hide.apply(this._currentView.$el, hideEffect);
      }
      if (child) {
        showKey = bBack ? 'SHOW_BACKWARD' : 'SHOW_FORWARD';
        if (!bNoAnimation) {
          showEffect = this.effects[showKey];
        }
        child.$el.show.apply(child.$el, showEffect);
      }
      this._previousView = this._currentView;
      return this._currentView = child;
    },
    /**
    * Shows previously shown child view again and hides currently shown child view
    */

    showPreviousChild: function() {
      if (this._previousView) {
        this.showChild(this._previousView);
      }
    }
  });

  /**
  * A view that that displays view specified in `itemView`
  */


  Backpack.ListView = Backpack.View.extend({
    plugins: [Backpack.TemplatePlugin, Backpack.ContainerPlugin],
    messages: {
      NO_ITEMS: 'No Items'
    },
    template: '<div class="main-node"><div class="container-node"></div><div class="message-node"></div></div><div class="loading-node">Loading...</div>',
    templateNodes: {
      containerNode: '.container-node',
      messageNode: '.message-node',
      mainNode: '.main-node',
      loadingNode: '.loading-node'
    },
    itemView: Backpack.View,
    initialize: function(options) {
      var collection,
        _this = this;
      this.$el.addClass('list-view');
      if (options.itemView) {
        this.itemView = options.itemView;
      }
      Backpack.View.prototype.initialize.apply(this, arguments);
      this.setLoading(false);
      collection = this.collection;
      collection.on('reset', this.render, this);
      collection._onAddModel = function() {
        _this.renderModel(arguments[0], arguments[2]);
      };
      collection.on('add', collection._onAddModel);
      this.render();
    },
    render: function() {
      var _this = this;
      this.toggleContainerNode(this.collection.models.length > 0, this.messages.NO_ITEMS);
      this.clearChildren();
      _.each(this.collection.models, function(model) {
        _this.renderModel(model, {
          silent: true
        });
      });
      return this;
    },
    /**
    * Show list items if collection has one or more model
    * and show "No items" message instead if collection includes no models
    * @param {boolean} bShow specify true to show container node, false to hide container node and show message node instead
    * @param {String} message a message to show for bShow=false
    */

    toggleContainerNode: function(bShow, message) {
      var containerNode, messageNode;
      messageNode = this.messageNode;
      containerNode = this.containerNode;
      if (bShow) {
        messageNode.hide();
        containerNode.show();
      } else {
        messageNode.html(message);
        messageNode.show();
        containerNode.hide();
      }
    },
    /**
    * Render model
    * @param {Backbone.Model} model
    * @param {Object} options optional parameters
    * @param {integer} options.at index to insert at. If not specified, will be appended at th end.
    * @return {Backbone.View}
    */

    renderModel: function(model, options) {
      var child,
        _this = this;
      child = this.createChild(model);
      model._onModelDestroy = function() {
        _this.removeChild(child);
        model.off('destroy');
      };
      model.on('destroy', model._onModelDestroy);
      this.addChild(child, options);
      if (!(options != null ? options.silent : void 0)) {
        this.toggleContainerNode(this.collection.models.length > 0, this.messages.NO_ITEMS);
      }
      return child;
    },
    /**
    * Creates view to add to this list view as a child
    * @param {Backbone.Model} model
    * @return {Backbone.View}
    */

    createChild: function(model) {
      var child, options;
      options = this.itemOptions || {};
      child = new this.itemView(_.extend(options, {
        model: model
      }));
      return child.render();
    },
    /**
    * Override Backpack.ContainerPlugin to add animation
    */

    removeChild: function(child, options) {
      var _this = this;
      child = this.getChild(child);
      if ((options != null ? options.silent : void 0) === true) {
        Backpack.ContainerPlugin.removeChild.call(this, child);
      } else {
        child.$el.hide('slide', {
          direction: 'left'
        }, 'fast', function() {
          Backpack.ContainerPlugin.removeChild.call(_this, child);
          _this.toggleContainerNode(_this.collection.models.length > 0, _this.messages.NO_ITEMS);
        });
      }
      return child;
    },
    clearChildren: function() {
      _.each(this.collection.models, function(model) {
        if (model._onModelDestroy) {
          model.off('destroy', model._onModelDestroy);
        }
      });
      Backpack.ContainerPlugin.clearChildren.apply(this, arguments);
    },
    /**
    * Toggle show/hide loading node
    * @param {boolean} bLoading true to show loading node, false to hide
    */

    setLoading: function(bLoading) {
      if (bLoading) {
        this.loadingNode.show();
        this.mainNode.hide();
      } else {
        this.loadingNode.hide();
        this.mainNode.show();
      }
    },
    destroy: function() {
      var collection;
      this.clearChildren();
      collection = this.collection;
      collection.off('reset', this.render);
      collection.off('add', collection._onAddModel);
      Backpack.View.prototype.destroy.apply(this, arguments);
    }
  });

  CLS_LISTVIEW_EDIT = 'listview-edit';

  CLS_REMOVE_CONFIRM = 'remove-confirm';

  EditableItemView = Backpack.ActionView.extend({
    actions: {
      left: [
        {
          iconClass: 'delete-icon',
          title: 'Confirm delete',
          onClick: 'onRemoveConfirmButtonClick'
        }
      ],
      right: [
        {
          iconClass: 'reorder-handle',
          title: 'Reorder'
        }, {
          iconClass: 'delete-button',
          title: 'Delete',
          text: 'Delete',
          onClick: 'onRemoveButtonClick'
        }
      ]
    },
    /**
    * Click event handler for remove confirm icon
    * switches to remove confirm mode
    */

    onRemoveConfirmButtonClick: function(e) {
      var isRemoveConfirm;
      isRemoveConfirm = this.$el.hasClass(CLS_REMOVE_CONFIRM);
      this.$el.toggleClass(CLS_REMOVE_CONFIRM, !isRemoveConfirm);
      e.stopPropagation();
    },
    /**
    * Click event handler for [Remove] button
    * removes this item from play list
    */

    onRemoveButtonClick: function(e) {
      this.child.model.destroy();
      e.stopPropagation();
    }
  });

  /**
  * An editable list view which can :
  * - Remove child views
  * - Reorder child views with drag & drop
  * By default, list is non editable, and should call `setEditable` to enable editing
  * Needs jQueryUI JS file and css/EditableListView.css included
  */


  Backpack.EditableListView = Backpack.ListView.extend({
    plugins: [Backpack.SortablePlugin],
    sortableOptions: {
      handle: ".reorder-handle"
    },
    initialize: function(options) {
      this.$el.addClass('editable-list-view');
      Backpack.ListView.prototype.initialize.apply(this, arguments);
      this.setEditable((options.editable === true) || false);
    },
    /**
    * Turn on/off edit mode
    * When in edit mode, allows deleting/drag & drop play list items
    * @param {Boolean} isEdit If true, turns on edit mode. If false, turns off edit mode.
    */

    setEditable: function(isEdit) {
      this.setSortable(isEdit);
      this.containerNode.toggleClass(CLS_LISTVIEW_EDIT, isEdit);
    },
    /**
    * Override ListView to use EditableItemView as direct child
    * @param {Backbone.Model} model
    * @return {Backbone.View}
    */

    createChild: function(model) {
      var itemOptions, view;
      itemOptions = this.itemOptions || {};
      view = new EditableItemView({
        itemView: this.itemView,
        itemOptions: _.extend(itemOptions, {
          model: model
        })
      });
      return view.render();
    }
  });

  /*
  * Tab panel view
  */


  /*
  * Tab button view
  */


  Backpack.TabButtonView = Backpack.View.extend({
    tagName: 'a',
    attributes: {
      href: '#',
      "class": 'tab-button'
    },
    plugins: [Backpack.TemplatePlugin],
    template: _.template('<%- text %>')
  });

  /*
  * A tab panel view that contains tab button view and tab content view
  */


  Backpack.TabView = Backpack.StackView.extend({
    allPlugins: [Backpack.TemplatePlugin, Backpack.ContainerPlugin],
    template: '<div class="tab-button-container"></div><div class="tab-content-container"></div>',
    templateNodes: {
      buttonContainerNode: '.tab-button-container',
      containerNode: '.tab-content-container'
    },
    autoRender: false,
    render: function() {
      /* setup tab buttons*/

      this._buttonMap = {};
      this.buttonContainer = new Backpack.View({
        plugins: [Backpack.ContainerPlugin]
      });
      this.buttonContainerNode.append(this.buttonContainer.$el);
      /*
      * When autoRender=false, need to explicitly call renderContainer
      * This needs to be after tab buttons have been setup
      */

      this.renderContainer();
      Backpack.StackView.prototype.render.apply(this, arguments);
      return this;
    },
    /**
    * Override Backpack.ContainerPlugin to add tab button
    */

    addView: function(view, options) {
      var clazz, tabButtonView;
      Backpack.StackView.prototype.addView.apply(this, arguments);
      options = {
        text: view.title || view.name,
        tabView: this,
        onClick: function() {
          /**
          * If tab button view is clicked, show corresponding content view
          * `this` points to a TabButtonView instance in this scope
          */

          this.tabView.showChild(this._tabContentView);
        }
      };
      _.extend(options, this.tabButtonOptions);
      if (!options.events) {
        options.events = {};
      }
      options.events.click = 'onClick';
      clazz = this.tabButtonView || Backpack.TabButtonView;
      tabButtonView = new clazz(options);
      this.buttonContainer.addChild(tabButtonView);
      this._buttonMap[view.cid] = tabButtonView;
      tabButtonView._tabContentView = view;
    },
    /**
    * Override Backpack.StackView to remove/destroy tab button
    */

    removeChild: function(view) {
      var child, tabButtonView;
      child = Backpack.StackView.prototype.removeChild.apply(this, arguments);
      if (child) {
        tabButtonView = this._buttonMap[child.cid];
        this.buttonContainer.removeChild(tabButtonView);
        delete this._buttonMap[child.cid];
      }
      return child;
    },
    /*
    * Override Backpack.StackView to change styles of selected tab button
    */

    showChild: function(child) {
      var CLS_SELECTED, map;
      child = Backpack.StackView.prototype.showChild.apply(this, [child, true]);
      if (child) {
        CLS_SELECTED = 'selected';
        map = this._buttonMap;
        if (this._previousView) {
          map[this._previousView.cid].$el.removeClass(CLS_SELECTED);
        }
        map[child.cid].$el.addClass(CLS_SELECTED);
      }
      return child;
    },
    /**
    * Get tab content view for a tab button view
    */

    getTabContent: function(tabButtonView) {
      return tabButtonView._tabContentView;
    }
  });

  Backpack.CloseTabButtonPlugin = {
    tabButtonView: Backpack.ActionView,
    tabButtonOptions: {
      attributes: {
        "class": 'tab-button'
      },
      actions: [
        {
          iconClass: 'tab-close',
          onClick: function(e) {
            var contentView;
            contentView = this.tabView.getTabContent(this);
            this.tabView.removeChild(contentView);
            /* stopPropagation so that it doesn't try to select removed tab*/

            e.stopPropagation();
          }
        }
      ]
    }
  };

  /**
  * A view that that displays Google map
  */


  Backpack.GoogleMapView = Backpack.View.extend({
    apiKey: '',
    defaultLocation: {
      lat: -34.397,
      lng: 150.644
    },
    subscribers: {
      GOOGLE_MAP_SCRIPT_LOADED: '_onScriptLoaded'
    },
    initialize: function(options) {
      Backpack.View.prototype.initialize.apply(this, arguments);
      if (!options.el) {
        this.$el.css({
          width: '100%',
          height: '100%'
        });
      }
    },
    /**
    * Need to call this after being added to the DOM tree
    */

    initMap: function() {
      var script;
      if (!this.apiKey || this.apiKey.length === 0) {
        throw new Error('You need Google Map API key to use this widget');
      }
      if (this._mapInit) {
        return;
      }
      script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'http://maps.googleapis.com/maps/api/js?sensor=true&callback=Backpack.GoogleMapView.onScriptLoaded&key=' + this.apiKey;
      document.body.appendChild(script);
      this._mapInit = true;
    },
    _onScriptLoaded: function() {
      this.map = new google.maps.Map(this.$el.get(0), {
        zoom: 8,
        center: new google.maps.LatLng(this.defaultLocation.lat, this.defaultLocation.lng),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });
      this.removeSubscriber('GOOGLE_MAP_SCRIPT_LOADED', this._onScriptLoaded);
    },
    /**
    * Move center of map
    * @param {Object} location
    * @param {Number} location.lat latitude
    * @param {Number} location.lng longitude
    */

    setLocation: function(location) {
      this.map.panTo(new google.maps.LatLng(location.lat, location.lng));
    },
    /**
    * Add marker to map
    * @param {Object} option
    * @param {Number} option.lat latitude
    * @param {Number} option.lng longitude
    * @param {String} option.title title of marker
    */

    addMarker: function(option) {
      var marker;
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(option.lat, option.lng),
        title: option.title
      });
      marker.setMap(this.map);
    }
  });

  Backpack.GoogleMapView.onScriptLoaded = function() {
    Backbone.trigger('GOOGLE_MAP_SCRIPT_LOADED');
  };

}).call(this);
