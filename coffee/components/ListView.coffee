###
* A view that that displays view specified in `itemView`
###
Backpack.ListView = Backpack.View.extend
  plugins: [Backpack.ContainerPlugin]

  # TODO : i18n
  template: _.template '<div class="mainNode"><div class="containerNode"></div><div class="noItemsNode">No Items</div></div><div class="loadingNode">Loading...</div>', @messages

  itemView: Backpack.View
  itemOptions: {}

  initialize:(options)->
    @itemView = options.itemView if options.itemView
    @$el.html @template
    @containerNode = @$ '.containerNode'
    @_noItemsNode = @$ '.noItemsNode'
    @_mainNode = @$ '.mainNode'
    @_loadingNode = @$ '.loadingNode'
    @setLoading false
    Backpack.View::initialize.apply @, arguments
    @collection.on "add remove reset", @render, @
    @render()
    return

  render:->
    models = @collection.models
    len = models.length
    @_showContainerNode len > 0
    @clearChildren()
    if len > 0
      _.each models, (model)=>
        child = @createChild model
        @addChild child
        return
    @

  ###
  * Show list items if collection has one or more model
  * and show "No items" message instead if collection includes no models
  * @param {boolean} bShow true to show list items, false to hide list items and show "No items" message instead
  ###
  _showContainerNode:(bShow)->
    if bShow
      @_noItemsNode.hide()
      @containerNode.show()
    else
      @_noItemsNode.show()
      @containerNode.hide()
    return

  ###
  * Creates view to add to this list view as a child
  * @param {Backbone.Model} model
  * @return {Backbone.View}
  ###
  createChild:(model)->
    options = _.clone @itemOptions
    options = _.extend options, { model: model }
    view = new @itemView _.extend options, { model: model }
    view.render()

  ###
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
    @collection.off "add remove reset", @render
    Backpack.View::remove.call @
    return