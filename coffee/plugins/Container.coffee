Backpack.Container =
  setup:->
    @children = []
    return

  getContainerNode:->
    @$el

  getChild:(index)->
    @children[index]

  addChild:(view)->
    @getContainerNode().append view.$el
    @children.push view
    return

  clearChildren:->
    for i in [@children.length-1..0] by -1
      @removeChild i
    return

  removeChild:(index)->
    @children[index].remove()
    @children.splice index,1
    return

  filterChildren:(options)->
    _.filter @children, (view)->
      if view.model.filter options
        view.$el.show()
      else
        view.$el.hide()
      return
    return

  cleanup:->
    @clearChildren()
    return