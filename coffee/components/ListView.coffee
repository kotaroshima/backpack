Backpack.ListView = Backpack.View.extend
  plugins: [Backpack.ContainerPlugin]

  # TODO : i18n
  template: _.template '<div class="mainNode"><div class="containerNode"></div><div class="noItemsNode">No Items</div></div><div class="loadingNode">Loading...</div>', @messages

  itemClass: Backpack.View

  initialize:(options)->
    @itemClass = options.itemClass if options.itemClass
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

  _showContainerNode:(bShow)->
    if bShow
      @_noItemsNode.hide()
      @containerNode.show()
    else
      @_noItemsNode.show()
      @containerNode.hide()
    return

  createChild:(model)->
    view = new @itemClass model: model
    view.render()

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