###*
* A view that that displays view specified in `itemView`
###
Backpack.ListView = Backpack.View.extend
  plugins: [Backpack.ContainerPlugin]

  # TODO : i18n
  template: _.template '<div class="main-node"><div class="containerNode"></div><div class="noItemsNode">No Items</div></div><div class="loadingNode">Loading...</div>', @messages

  itemView: Backpack.View
  itemOptions: {}

  initialize:(options)->
    @itemView = options.itemView if options.itemView
    @$el.html @template
    @containerNode = @$ '.containerNode'
    @_noItemsNode = @$ '.noItemsNode'
    @_mainNode = @$ '.main-node'
    @_loadingNode = @$ '.loadingNode'
    @setLoading false
    Backpack.View::initialize.apply @, arguments
    @collection.on 'add reset', @render, @
    @collection.on 'remove', @onRemoveModel, @
    @render()
    return

  render:->
    @_toggleContainerNode()
    @clearChildren()
    _.each @collection.models, (model)=>
      child = @createChild model
      @addChild child
      return
    @

  ###*
  * Show list items if collection has one or more model
  * and show "No items" message instead if collection includes no models
  ###
  _toggleContainerNode:()->
    if @collection.models.length > 0
      @_noItemsNode.hide()
      @containerNode.show()
    else
      @_noItemsNode.show()
      @containerNode.hide()
    return

  ###*
  * Creates view to add to this list view as a child
  * @param {Backbone.Model} model
  * @return {Backbone.View}
  ###
  createChild:(model)->
    options = _.clone @itemOptions
    options = _.extend options, model: model
    view = new @itemView _.extend options, model: model
    view.$el.addClass 'item-view'
    view.render()

  onRemoveModel:(model)->
    children = @children
    for i in [children.length-1..0] by -1
      child = children[i]
      if child.model == model
        child.$el.hide 'slide', { direction: 'left' }, 'fast', =>
          @removeChild child
          @_toggleContainerNode()
          return
        break
    return

  ###*
  * Toggle show/hide loading node
  * @param {boolean} bLoading true to show loading node, false to hide
  ###
  setLoading:(bLoading)->
    if bLoading
      @_loadingNode.show()
      @_mainNode.hide()
    else
      @_loadingNode.hide()
      @_mainNode.show()
    return

  remove:->
    @collection.off 'add reset', @render
    @collection.off 'remove', @onRemoveModel
    Backpack.View::remove.call @
    return