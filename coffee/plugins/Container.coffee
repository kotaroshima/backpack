###
* A plugin to make a view container
###
Backpack.Container =
  ###
  * Setup containerNode and add child views on initialize
  ###
  setup:->
    @containerNode = @$el if !@containerNode
    if @children
      _.each @children, (child)=>
        @addView child
        return
    else
      @children = []
    return

  ###
  * Get child view at specified index
  * @param {Integer} index Child index
  * @return {Backbone.View}
  ###
  getChild:(index)->
    @children[index]

  ###
  * Add view to container node
  * @param {Backbone.View} view A view to add
  ###
  addView:(view)->
    @containerNode.append view.$el
    return

  ###
  * Add view as child
  * @param {Backbone.View} view A view to add
  ###
  addChild:(view)->
    @addView view
    @children.push view
    return

  ###
  * Remove child view at specified index
  * @param {Backbone.View|Integer} view A view to remove or child index
  ###
  removeChild:(view)->
    if _.isNumber view
      index = view
    else
      index = _.indexOf @children, view
    if index >= 0
      @children[index].remove()
      @children.splice index, 1
    return

  ###
  * Clear all children
  ###
  clearChildren:->
    for i in [@children.length-1..0] by -1
      @removeChild i
    return

  filterChildren:(options)->
    _.filter @children, (view)->
      if view.model.filter options
        view.$el.show()
      else
        view.$el.hide()
      return
    return

  ###
  * Clear children on destroy
  ###
  cleanup:->
    @clearChildren()
    return