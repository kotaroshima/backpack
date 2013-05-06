###
* A plugin to use jQuery UI Sortable
* options :
*   sortable {Boolean} pass `false` if you don't want to make it sortable on initialization (default `true`)
*   sortableOptions {Object} initialization option to pass when initializing sortable
###
Backpack.Sortable =
  ###
  * Set sortable on initialize
  * By default, sets sortable. If `sortable` property is given `false`, it doesn't make it sortable.
  ###
  setup:->
    if @sortable isnt false
      @setSortable true
    return

  _getSortableContainer:->
    @containerNode || @$el

  ###
  * Set this view sortable
  * @param {Boolean} true to enable sortable, false to disable sortable
  ###
  setSortable:(isSortable)->
    containerNode = @_getSortableContainer()
    if isSortable
      if @_sortableInit
        containerNode.sortable "enable"
      else
        # make the list sortable
        options =
          start:(event, ui)->
            ui.item.startIndex = ui.item.index()
            return
          stop:(event, ui)=>
            collection = @collection
            model = collection.at ui.item.startIndex
            newIndex = ui.item.index()
            collection.remove model
            collection.add model, { at: newIndex }
            return
        options = _.extend options, @sortableOptions if @sortableOptions
        containerNode.sortable options
        @_sortableInit = true
    else
      if @_sortableInit
        containerNode.sortable "disable"
    return

  ###
  * Cleanup sortable on destroy
  ###
  cleanup:->
    if @_sortableInit
      @_getSortableContainer().sortable "destroy"
    return