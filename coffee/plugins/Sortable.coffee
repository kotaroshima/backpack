# options
#   sortable : pass `false` if you don't want to make it sortable on initialization (default `true`)
Backpack.Sortable =
  setup:->
    if @sortable isnt false
      @setSortable true
    return

  _getSortableContainer:->
    @containerNode || @$el

  setSortable:(isSortable)->
    containerNode = @_getSortableContainer()
    if isSortable
      if @_sortableInit
        containerNode.sortable "enable"
      else
        # make the list sortable
        containerNode.sortable
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
        @_sortableInit = true
    else
      if @_sortableInit
        containerNode.sortable "disable"
    return

  cleanup:->
    if @_sortableInit
      @_getSortableContainer().sortable "destroy"
    return