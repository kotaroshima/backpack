// Generated by CoffeeScript 1.4.0

/*
* A view that stacks its children
*/


(function() {

  Backpack.StackView = Backpack.View.extend({
    plugins: [Backpack.Container],
    /*
      * Constructor
      * @param {Object} [options] Initialization option
      * @param {Backpack.View[]} [options.children] Child views
      * @param {int} [options.selectedIndex=0] Index of child view to be selected
      * @param {Hash} [options.stackEvents] Map to define event handler to select child.
      *    key is child view's 'name' property, and value is child view's method name to trigger selection
    */

    initialize: function(options) {
      var selectedIndex,
        _this = this;
      if (options == null) {
        options = {};
      }
      Backpack.View.prototype.initialize.apply(this, arguments);
      if (this.children) {
        _.each(this.children, function(child) {
          _this.addChild(child);
        });
      }
      selectedIndex = options.selectedIndex;
      if (!selectedIndex || !(this.children && ((0 < selectedIndex && selectedIndex < this.children.length)))) {
        this._selectedView = this.children[selectedIndex];
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
        if (child === _this._selectedView) {
          _this.selectChild(child);
        } else {
          child.$el.hide();
        }
      });
      return this;
    },
    /*
      * Override to attach event
      * @param {Backpack.View} view View to add to this view
    */

    addChild: function(view) {
      var stackEvent, targetView, _ref;
      Backpack.Container.addChild.apply(this, arguments);
      stackEvent = (_ref = this.stackEvents) != null ? _ref[view.name] : void 0;
      if (stackEvent) {
        targetView = _.find(this.children, function(child) {
          return child.name === stackEvent.targetView;
        });
        this.attachView(view, stackEvent.event, targetView);
      }
    },
    /*
      * Attach event of child view to select that view
      * @param {Backpack.View} view Child view
      * @param {String} method Name of the child view method
    */

    attachView: function(view, method, targetView) {
      var _this = this;
      view.attach(view, method, function() {
        _this.selectChild(targetView);
      });
    },
    /*
      * Selects one of its child views
      * @param {int|Backbone.View} child Child view to select
    */

    selectChild: function(child) {
      if (_.isNumber(child)) {
        child = this.children[child];
      }
      if (this._selectedView) {
        this._selectedView.$el.hide();
      }
      child.$el.show();
      this._selectedView = child;
    }
  });

}).call(this);
