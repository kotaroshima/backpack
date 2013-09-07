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
  * @param {integer} options.at index to insert at. If not specified, will be appended at the end.
  * @return {Backbone.View} view that has been added
  ###
  addView:(view, options)->
    index = options?.at
    childNodes = @containerNode.find '>*'
    if 0 <= index && index < childNodes.length
      view.$el.insertBefore childNodes.eq(index)
    else
      @containerNode.append view.$el
    view

  ###*
  * Add view as child
  * @param {Backbone.View} view A view to add
  * @param {Object} options optional parameters
  * @param {integer} options.at index to insert at. If not specified, will be appended at th end.
  * @return {Backbone.View} view that has been added
  ###
  addChild:(view, options)->
    index = options?.at
    if 0 <= index && index < @children.length
      @children.splice index, 0, view
    else
      @children.push view
    @addView view, options

  ###*
  * Remove child view at specified index
  * @param {Backbone.View|Integer} view A view to remove or child index
  * @param {Object} options optional parameters
  * @param {boolean} options.silent If true, it will not animate
  * @return {Backbone.View} a removed view
  ###
  removeChild:(view, options)->
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

  ###*
  * A hook to notify that child view has been removed
  * @param {Backbone.View|Integer} view A view which is removed
  ###
  onChildRemoved:(view)->

  ###*
  * Clear all children
  ###
  clearChildren:->
    for i in [@children.length-1..0] by -1
      @removeChild i, silent: true
    return

  # TODO : move this to somewhere else
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