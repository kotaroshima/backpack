/**
* A view that that displays view specified in `itemView`
*/


(function() {
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

}).call(this);
