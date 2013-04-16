// Generated by CoffeeScript 1.4.0
(function() {

  Backpack.Container = {
    setup: function() {
      this.children = [];
    },
    getContainerNode: function() {
      return this.$el;
    },
    getChild: function(index) {
      return this.children[index];
    },
    addChild: function(view) {
      this.getContainerNode().append(view.$el);
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

}).call(this);
