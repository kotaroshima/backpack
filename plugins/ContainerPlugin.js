/**
* A plugin to make a view container
*/


(function() {
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

}).call(this);
