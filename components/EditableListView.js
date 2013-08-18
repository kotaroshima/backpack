// Generated by CoffeeScript 1.6.2
(function() {
  var CLS_LISTVIEW_EDIT, CLS_REMOVE_CONFIRM, EditableItemView;

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
      this.itemOptions = options.itemOptions;
      this.render();
    },
    render: function() {
      var options, view;

      this.$el.html(this.template);
      options = _.clone(this.itemOptions);
      options = _.extend(options, {
        model: this.model
      });
      view = new this.itemView(options);
      view.render();
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
  * By default, list is non editable, and should call `setEditable` to enable editing
  * Needs jQueryUI JS file and css/EditableListView.css included
  */


  Backpack.EditableListView = Backpack.ListView.extend({
    plugins: [Backpack.ContainerPlugin, Backpack.SortablePlugin],
    sortableOptions: {
      handle: ".reorder-handle"
    },
    initialize: function(options) {
      Backpack.ListView.prototype.initialize.apply(this, arguments);
      this.setEditable((options.editable === true) || false);
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
      var view;

      view = new EditableItemView({
        model: model,
        itemView: this.itemView,
        itemOptions: this.itemOptions
      });
      return view.render();
    }
  });

}).call(this);
