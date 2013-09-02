###*
* A view that that displays view specified in `itemView`
###
Backpack.ListView = Backpack.View.extend
  plugins: [Backpack.ContainerPlugin]

  # TODO : i18n
  messages:
    NO_ITEMS: 'No Items'
  template: '<div class="main-node"><div class="container-node"></div><div class="message-node"></div></div><div class="loading-node">Loading...</div>'

  itemView: Backpack.View

  initialize:(options)->
    @itemView = options.itemView if options.itemView
    @$el.html @template
    @containerNode = @$ '.container-node'
    @messageNode = @$ '.message-node'
    @mainNode = @$ '.main-node'
    @loadingNode = @$ '.loading-node'
    @setLoading false
    Backpack.View::initialize.apply @, arguments
    @collection.on 'add reset', @render, @
    @collection.on 'remove', @onRemoveModel, @
    @render()
    return

  render:->
    @toggleContainerNode (@collection.models.length > 0), @messages.NO_ITEMS
    @clearChildren()
    _.each @collection.models, (model)=>
      child = @createChild model
      @addChild child
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
  * Creates view to add to this list view as a child
  * @param {Backbone.Model} model
  * @return {Backbone.View}
  ###
  createChild:(model)->
    options = _.clone @itemOptions || {}
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
          @toggleContainerNode (@collection.models.length > 0), @messages.NO_ITEMS
          return
        break
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

  remove:->
    @collection.off 'add reset', @render
    @collection.off 'remove', @onRemoveModel
    Backpack.View::remove.call @
    return