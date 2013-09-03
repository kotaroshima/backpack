###*
* A plugin to make a view container
###
Backpack.ContainerPlugin =
  ###*
  * Setup containerNode and add child views on initialize
  ###
  setup:->
    containerNode = @containerNode
    if !containerNode
      @containerNode = @$el

    @children = [] if !@children
    @renderContainer() if @autoRender != false
    return

  renderContainer:->
    _.each @children, (child)=>
      @addView child
      return
    @

  ###*
  * Get child view at specified index
  * @param {Backbone.View|Integer|String} child Child view instance, or child index, or 'name' property of child
  * @return {Backbone.View}
  ###
  getChild:(child)->
    if child && child.cid
      _.find @children, (view)->
        view == child
    else if _.isNumber child
      @children[child]
    else if _.isString child
      _.find @children, (view)->
        view.name == child

  ###*
  * Add view to container node
  * @param {Backbone.View} view A view to add
  * @param {Object} options optional parameters
  ###
  addView:(view, options)->
    @containerNode.append view.$el
    return

  ###*
  * Add view as child
  * @param {Backbone.View} view A view to add
  * @param {Object} options optional parameters
  ###
  addChild:(view, options)->
    @children.push view
    @addView view, options
    return

  ###*
  * Remove child view at specified index
  * @param {Backbone.View|Integer} view A view to remove or child index
  * @return {Backbone.View} a removed view
  ###
  removeChild:(view)->
    if _.isNumber view
      index = view
    else
      index = _.indexOf @children, view
    if index >= 0
      child = @children[index]
      child.remove()
      @children.splice index, 1
      @onChildRemoved child
    child

  onChildRemoved:(view)->

  ###*
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

  ###*
  * Clear children on destroy
  ###
  cleanup:->
    @clearChildren()
    return