// Generated by CoffeeScript 1.4.0
(function() {

  Backpack.ListView = Backpack.View.extend({
    plugins: [Backpack.Container],
    template: '<div class="noItemsNode">No Items</div><div class="containerNode"></div>',
    itemClass: Backpack.View,
    initialize: function(options) {
      Backpack.View.prototype.initialize.apply(this, arguments);
      if (options.itemClass) {
        this.itemClass = options.itemClass;
      }
      this.collection.on("add remove reset", this.render, this);
      this.$el.html(this.template);
      this.render();
    },
    getContainerNode: function() {
      if (!this._containerRoot) {
        this._containerRoot = this.$('.containerNode');
      }
      return this._containerRoot;
    },
    getNoItemsNode: function() {
      if (!this._noItemsNode) {
        this._noItemsNode = this.$('.noItemsNode');
      }
      return this._noItemsNode;
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
        this.getNoItemsNode().hide();
        this.getContainerNode().show();
      } else {
        this.getNoItemsNode().show();
        this.getContainerNode().hide();
      }
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
