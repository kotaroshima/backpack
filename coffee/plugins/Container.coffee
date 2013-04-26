Backpack.Container =
  setup:->
    @containerNode = @$el if !@containerNode
    @children = [] unless @children
    return

  getChild:(index)->
    @children[index]

  addView:(view)->
    @containerNode.append view.$el
    return

  addChild:(view)->
    @addView view
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