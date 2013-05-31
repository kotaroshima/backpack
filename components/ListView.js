// Generated by CoffeeScript 1.6.2
/*
* A view that that displays view specified in `itemView`
*/


(function() {
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

}).call(this);
