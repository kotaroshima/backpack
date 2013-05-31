// Generated by CoffeeScript 1.6.2
(function() {
  var Backpack, CLS_LISTVIEW_EDIT, CLS_REMOVE_CONFIRM, Clazz, EditableItemView, applyOptions, cleanup, extend, root, setup,
    __hasProp = {}.hasOwnProperty;

  root = this;

  Backpack = root.Backpack = {};

  /*
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

  Backpack.AttachPlugin = {
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

  Backpack.defaultPlugins.push(Backpack.AttachPlugin);

  /*
  * A plugin to make a view container
  */


  Backpack.ContainerPlugin = {
    /*
    * Setup containerNode and add child views on initialize
    */

    setup: function() {
      var _this = this;

      if (!this.containerNode) {
        this.containerNode = this.$el;
      }
      if (this.children) {
        _.each(this.children, function(child) {
          _this.addView(child);
        });
      } else {
        this.children = [];
      }
    },
    /*
    * Get child view at specified index
    * @param {Integer} index Child index
    * @return {Backbone.View}
    */

    getChild: function(index) {
      return this.children[index];
    },
    /*
    * Add view to container node
    * @param {Backbone.View} view A view to add
    */

    addView: function(view) {
      this.containerNode.append(view.$el);
    },
    /*
    * Add view as child
    * @param {Backbone.View} view A view to add
    */

    addChild: function(view) {
      this.addView(view);
      this.children.push(view);
    },
    /*
    * Remove child view at specified index
    * @param {Backbone.View|Integer} view A view to remove or child index
    */

    removeChild: function(view) {
      var index;

      if (_.isNumber(view)) {
        index = view;
      } else {
        index = _.indexOf(this.children, view);
      }
      if (index >= 0) {
        this.children[index].remove();
        this.children.splice(index, 1);
      }
    },
    /*
    * Clear all children
    */

    clearChildren: function() {
      var i, _i, _ref;

      for (i = _i = _ref = this.children.length - 1; _i >= 0; i = _i += -1) {
        this.removeChild(i);
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
    /*
    * Clear children on destroy
    */

    cleanup: function() {
      this.clearChildren();
    }
  };

  Backpack.PublishPlugin = {
    /*
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
    /*
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
    /*
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
    /*
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

  /*
  * A plugin to use jQuery UI Sortable
  * options :
  *   sortable {Boolean} pass `false` if you don't want to make it sortable on initialization (default `true`)
  *   sortableOptions {Object} initialization option to pass when initializing sortable
  */


  Backpack.SortablePlugin = {
    /*
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
    /*
    * Set this view sortable
    * @param {Boolean} true to enable sortable, false to disable sortable
    */

    setSortable: function(isSortable) {
      var containerNode, options,
        _this = this;

      containerNode = this._getSortableContainer();
      if (isSortable) {
        if (this._sortableInit) {
          containerNode.sortable("enable");
        } else {
          options = {
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
          containerNode.sortable("disable");
        }
      }
    },
    /*
    * Cleanup sortable on destroy
    */

    cleanup: function() {
      if (this._sortableInit) {
        this._getSortableContainer().sortable("destroy");
      }
    }
  };

  Backpack.SubscribePlugin = {
    /*
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
    /*
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

  /*
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
    /*
    * Constructor
    * @param {Object} [options={}] Initialization option
    * @param {Backpack.View[]} [options.children] Child views
    * @param {integer} [options.showIndex=0] Index of child view to show on init
    * @param {Object} [options.navigationEvents] Map to define event handler to show child.
    *    key is child view's 'name' property, and value is child view's method name to trigger selection
    */

    initialize: function(options) {
      var showIndex;

      if (options == null) {
        options = {};
      }
      Backpack.View.prototype.initialize.apply(this, arguments);
      this.$el.css({
        position: "relative",
        width: "100%"
      });
      showIndex = options.showIndex || 0;
      if (this.children && ((0 <= showIndex && showIndex < this.children.length))) {
        this._currentView = this.children[showIndex];
        this._previousView = this._currentView;
      }
      this.render();
    },
    /*
    * Select only one of its children and hide others
    * @returns {Backpack.View} this instance
    */

    render: function() {
      var _this = this;

      _.each(this.children, function(child) {
        if (child === _this._currentView) {
          child.$el.show();
        } else {
          child.$el.hide();
        }
      });
      return this;
    },
    /*
    * Override Backpack.ContainerPlugin to attach navigation events
    * @param {Backbone.View} view A view to add
    */

    addView: function(view) {
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
          if (_.isArray(stackEvent)) {
            eventDef = stackEvent;
          } else {
            eventDef = [stackEvent];
          }
          _.each(eventDef, function(def) {
            _this.attachNavigationEvent(view, def);
          });
        }
      }
    },
    /*
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
          _this.showPreviousChild();
        });
      } else {
        targetView = _.find(this.children, function(child) {
          return child.name === navigationDef.target;
        });
        view.attach(view, navigationDef.event, function() {
          _this.showChild(targetView);
        });
      }
    },
    /*
    * Hides previously shown child view and shows another child view
    * @param {Integer|String|Backbone.View} child Child view instance or child index or 'name' property of child view
    */

    showChild: function(child) {
      var bBack, hideKey, showKey;

      if (_.isNumber(child)) {
        child = this.children[child];
      } else if (_.isString(child)) {
        child = _.find(this.children, function(view) {
          return view.name === child;
        });
      }
      bBack = _.indexOf(this.children, child) < _.indexOf(this.children, this._currentView);
      if (this._currentView) {
        hideKey = bBack ? 'HIDE_BACKWARD' : 'HIDE_FORWARD';
        this._currentView.$el.hide.apply(this._currentView.$el, this.effects[hideKey]);
      }
      showKey = bBack ? 'SHOW_BACKWARD' : 'SHOW_FORWARD';
      child.$el.show.apply(child.$el, this.effects[showKey]);
      this._previousView = this._currentView;
      this._currentView = child;
    },
    /*
    * Shows previously shown child view again and hides currently shown child view
    */

    showPreviousChild: function() {
      if (this._previousView) {
        this.showChild(this._previousView);
      }
    }
  });

  /*
  * A view that that displays view specified in `itemView`
  */


  Backpack.ListView = Backpack.View.extend({
    plugins: [Backpack.ContainerPlugin],
    template: _.template('<div class="mainNode"><div class="containerNode"></div><div class="noItemsNode">No Items</div></div><div class="loadingNode">Loading...</div>', this.messages),
    itemView: Backpack.View,
    initialize: function(options) {
      if (options.itemView) {
        this.itemView = options.itemView;
      }
      this.$el.html(this.template);
      this.containerNode = this.$('.containerNode');
      this._noItemsNode = this.$('.noItemsNode');
      this._mainNode = this.$('.mainNode');
      this._loadingNode = this.$('.loadingNode');
      this.setLoading(false);
      Backpack.View.prototype.initialize.apply(this, arguments);
      this.collection.on("add remove reset", this.render, this);
      this.render();
    },
    render: function() {
      var len, models,
        _this = this;

      models = this.collection.models;
      len = models.length;
      this._showContainerNode(len > 0);
      this.clearChildren();
      if (len > 0) {
        _.each(models, function(model) {
          var child;

          child = _this.createChild(model);
          _this.addChild(child);
        });
      }
      return this;
    },
    _showContainerNode: function(bShow) {
      if (bShow) {
        this._noItemsNode.hide();
        this.containerNode.show();
      } else {
        this._noItemsNode.show();
        this.containerNode.hide();
      }
    },
    /*
    * Creates view to add to this list view as a child
    * @param {Backbone.Model} model
    * @return {Backbone.View}
    */

    createChild: function(model) {
      var view;

      view = new this.itemView({
        model: model
      });
      return view.render();
    },
    setLoading: function(bLoading) {
      if (bLoading) {
        this._loadingNode.show();
        this._mainNode.hide();
      } else {
        this._loadingNode.hide();
        this._mainNode.show();
      }
    },
    remove: function() {
      this.collection.off("add remove reset", this.render);
      Backpack.View.prototype.remove.call(this);
    }
  });

  CLS_LISTVIEW_EDIT = 'listview-edit';

  CLS_REMOVE_CONFIRM = 'remove-confirm';

  EditableItemView = Backpack.View.extend({
    template: '<div class="item-view"><span class="delete-cell"><button class="delete-icon"></button></span><span class="editable-container"></span><span class="item-actions"><span class="reorder-handle"></span><button class="delete-button">Delete</button></span></div>',
    events: {
      'click .delete-icon': 'onRemoveConfirmButtonClicked',
      'click .delete-button': 'onRemoveButtonClicked'
    },
    initialize: function(options) {
      this.itemView = options.itemView;
      this.render();
    },
    render: function() {
      var view;

      this.$el.html(this.template);
      view = new this.itemView({
        model: this.model
      });
      this.$('.editable-container').append(view.$el);
      return this;
    },
    /*
    remove:->
      @itemView.remove()
      Backpack.View::remove @, arguments
      return
    */

    /*
    * Click event handler for remove confirm icon
    * switches to remove confirm mode
    */

    onRemoveConfirmButtonClicked: function(e) {
      var isRemoveConfirm;

      isRemoveConfirm = this.$el.hasClass(CLS_REMOVE_CONFIRM);
      this.$el.toggleClass(CLS_REMOVE_CONFIRM, !isRemoveConfirm);
      e.stopPropagation();
    },
    /*
    * Click event handler for [Remove] button
    * removes this item from play list
    */

    onRemoveButtonClicked: function(e) {
      this.model.destroy();
      e.stopPropagation();
    }
  });

  /*
  * An editable list view which can :
  * - Remove child views
  * - Reorder child views with drag & drop
  * By default, list is non editable, and should call `setEditable` to enable editing.
  */


  Backpack.EditableListView = Backpack.ListView.extend({
    plugins: [Backpack.ContainerPlugin, Backpack.SortablePlugin],
    sortable: false,
    sortableOptions: {
      handle: ".reorder-handle"
    },
    initialize: function(options) {
      Backpack.ListView.prototype.initialize.apply(this, arguments);
      this.setEditable(false);
    },
    /*
    * Turn on/off edit mode
    * When in edit mode, allows deleting/drag & drop play list items
    * @param {Boolean} isEdit If true, turns on edit mode. If false, turns off edit mode.
    */

    setEditable: function(isEdit) {
      this.setSortable(isEdit);
      this.$el.toggleClass(CLS_LISTVIEW_EDIT, isEdit);
    },
    /*
    * Override ListView to use EditableItemView as direct child
    * @param {Backbone.Model} model
    * @return {Backbone.View}
    */

    createChild: function(model) {
      var itemView;

      return itemView = new EditableItemView({
        model: model,
        itemView: this.itemView
      });
    }
  });

}).call(this);
