CLS_LISTVIEW_EDIT = 'listview-edit'
CLS_REMOVE_CONFIRM = 'remove-confirm'

EditableItemView = Backpack.ActionView.extend
  actions:
    left:
      [{
        iconClass: 'delete-icon'
        title: 'Confirm delete' # TODO : i18n
        onClick: 'onRemoveConfirmButtonClick'
      }]
    right:
      [{
        iconClass: 'reorder-handle'
        title: 'Reorder' # TODO : i18n
      },
      {
        iconClass: 'delete-button'
        title: 'Delete' # TODO : i18n
        text: 'Delete' # TODO : i18n
        onClick: 'onRemoveButtonClick'
      }]

  ###*
  * Click event handler for remove confirm icon
  * switches to remove confirm mode
  ###
  onRemoveConfirmButtonClick:(e)->
    isRemoveConfirm = @$el.hasClass CLS_REMOVE_CONFIRM
    @$el.toggleClass CLS_REMOVE_CONFIRM, !isRemoveConfirm
    e.stopPropagation()
    return

  ###*
  * Click event handler for [Remove] button
  * removes this item from play list
  ###
  onRemoveButtonClick:(e)->
    @child.model.destroy()
    e.stopPropagation()
    return

###*
* An editable list view which can :
* - Remove child views
* - Reorder child views with drag & drop
* By default, list is non editable, and should call `setEditable` to enable editing
* Needs jQueryUI JS file and css/EditableListView.css included
###
Backpack.EditableListView = Backpack.ListView.extend
  plugins: [Backpack.SortablePlugin]
  sortableOptions:
    handle: ".reorder-handle"

  initialize:(options)->
    @$el.addClass 'editable-list-view'
    Backpack.ListView::initialize.apply @, arguments

    # pass editable=true option if you want initial state to be editable
    # default is editable=false
    @setEditable (options.editable is true) || false
    return

  ###*
  * Turn on/off edit mode
  * When in edit mode, allows deleting/drag & drop play list items
  * @param {Boolean} isEdit If true, turns on edit mode. If false, turns off edit mode.
  ###
  setEditable:(isEdit)->
    @setSortable isEdit
    @containerNode.toggleClass CLS_LISTVIEW_EDIT, isEdit
    return

  ###*
  * Override ListView to use EditableItemView as direct child
  * @param {Backbone.Model} model
  * @return {Backbone.View}
  ###
  createChild:(model)->
    itemOptions = @itemOptions || {}
    view = new EditableItemView
      itemView: @itemView
      itemOptions: _.extend itemOptions, model: model
    view.render()