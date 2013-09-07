###*
* A view that that displays view specified in `itemView`
###
Backpack.ListView = Backpack.View.extend
  plugins: [Backpack.TemplatePlugin, Backpack.ContainerPlugin]

  # TODO : i18n
  messages:
    NO_ITEMS: 'No Items'

  template: '<div class="main-node"><div class="container-node"></div><div class="message-node"></div></div><div class="loading-node">Loading...</div>'
  templateNodes:
    containerNode: '.container-node'
    messageNode: '.message-node'
    mainNode: '.main-node'
    loadingNode: '.loading-node'

  itemView: Backpack.View

  initialize:(options)->
    @$el.addClass 'list-view'
    @itemView = options.itemView if options.itemView
    Backpack.View::initialize.apply @, arguments
    @setLoading false
    collection = @collection
    collection.on 'reset', @render, @
    collection._onAddModel = =>
      @renderModel arguments[0], arguments[2]
      return
    collection.on 'add', collection._onAddModel
    @render()
    return

  render:->
    @toggleContainerNode (@collection.models.length > 0), @messages.NO_ITEMS
    @clearChildren()
    _.each @collection.models, (model)=>
      @renderModel model, silent: true
      return
    @

  ###*
  * Show list items if collection has one or more model
  * and show "No items" message instead if collection includes no models
  * @param {boolean} bShow specify true to show container node, false to hide container node and show message node instead
  * @param {String} message a message to show for bShow=false 
  ###
  toggleContainerNode:(bShow, message)->
    messageNode = @messageNode
    containerNode = @containerNode
    if bShow
      messageNode.hide()
      containerNode.show()
    else
      messageNode.html message
      messageNode.show()
      containerNode.hide()
    return

  ###*
  * Render model
  * @param {Backbone.Model} model
  * @param {Object} options optional parameters
  * @param {integer} options.at index to insert at. If not specified, will be appended at th end.
  * @return {Backbone.View}
  ###
  renderModel:(model, options)->
    child = @createChild model
    model._onModelDestroy = =>
      @removeChild child
      model.off 'destroy'
      return
    model.on 'destroy', model._onModelDestroy
    @addChild child, options
    @toggleContainerNode (@collection.models.length > 0), @messages.NO_ITEMS if !(options?.silent)
    child

  ###*
  * Creates view to add to this list view as a child
  * @param {Backbone.Model} model
  * @return {Backbone.View}
  ###
  createChild:(model)->
    options = @itemOptions || {}
    child = new @itemView _.extend options, model: model
    child.render()

  ###*
  * Override Backpack.ContainerPlugin to add animation
  ###
  removeChild:(child, options)->
    child = @getChild child
    if options?.silent == true
      Backpack.ContainerPlugin.removeChild.call @, child
    else
      child.$el.hide 'slide', { direction: 'left' }, 'fast', =>
        Backpack.ContainerPlugin.removeChild.call @, child
        @toggleContainerNode (@collection.models.length > 0), @messages.NO_ITEMS
        return
    child

  clearChildren:->
    _.each @collection.models, (model)->
      model.off 'destroy', model._onModelDestroy if model._onModelDestroy
      return
    Backpack.ContainerPlugin.clearChildren.apply @, arguments
    return

  ###*
  * Toggle show/hide loading node
  * @param {boolean} bLoading true to show loading node, false to hide
  ###
  setLoading:(bLoading)->
    if bLoading
      @loadingNode.show()
      @mainNode.hide()
    else
      @loadingNode.hide()
      @mainNode.show()
    return

  destroy:->
    @clearChildren()
    collection = @collection
    collection.off 'reset', @render
    collection.off 'add', collection._onAddModel
    Backpack.View::destroy.apply @, arguments
    return