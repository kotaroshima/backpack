/**
* A view that stacks its children
*/


(function() {
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

}).call(this);
