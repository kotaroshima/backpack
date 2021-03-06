(function() {
  var CLS_LISTVIEW_EDIT, CLS_REMOVE_CONFIRM, EditableItemView;

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

}).call(this);
