CLS_LISTVIEW_EDIT = 'listview-edit'
CLS_REMOVE_CONFIRM = 'remove-confirm'

EditableItemView = Backpack.View.extend
  template: '<div class="item-view"><span class="delete-cell"><button class="delete-icon"></button></span><span class="editable-container"></span><span class="item-actions"><span class="reorder-handle"></span><button class="delete-button">Delete</button></span></div>'

  events:
    'click .delete-icon': 'onRemoveConfirmButtonClicked'
    'click .delete-button': 'onRemoveButtonClicked'

  initialize:(options)->
    @itemView = options.itemView
    @render()
    return

  render:->
    @$el.html @template
    view = new @itemView model: @model
    @$('.editable-container').append view.$el
    @

  ###
  remove:->
    @itemView.remove()
    Backpack.View::remove @, arguments
    return
  ###

  ###
  * Click event handler for remove confirm icon
  * switches to remove confirm mode
  ###
  onRemoveConfirmButtonClicked:(e)->
    isRemoveConfirm = @$el.hasClass CLS_REMOVE_CONFIRM
    @$el.toggleClass CLS_REMOVE_CONFIRM, !isRemoveConfirm
    e.stopPropagation()
    return

  ###
  * Click event handler for [Remove] button
  * removes this item from play list
  ###
  onRemoveButtonClicked:(e)->
    @model.destroy()
    e.stopPropagation()
    return

###
* An editable list view which can :
* - Remove child views
* - Reorder child views with drag & drop
* By default, list is non editable, and should call `setEditable` to enable editing.
###
Backpack.EditableListView = Backpack.ListView.extend
  plugins: [Backpack.ContainerPlugin, Backpack.SortablePlugin]
  sortable: false
  sortableOptions:
    handle: ".reorder-handle"

  initialize:(options)->
    Backpack.ListView::initialize.apply @, arguments
    @setEditable false
    return

  ###
  * Turn on/off edit mode
  * When in edit mode, allows deleting/drag & drop play list items
  * @param {Boolean} isEdit If true, turns on edit mode. If false, turns off edit mode.
  ###
  setEditable:(isEdit)->
    @setSortable isEdit
    @$el.toggleClass CLS_LISTVIEW_EDIT, isEdit
    return

  ###
  * Override ListView to use EditableItemView as direct child
  * @param {Backbone.Model} model
  * @return {Backbone.View}
  ###
  createChild:(model)->
    itemView = new EditableItemView
      model: model
      itemView: @itemView