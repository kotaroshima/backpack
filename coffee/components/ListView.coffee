Backpack.ListView = Backpack.View.extend
  plugins: [Backpack.Container]

  template: '<div class="noItemsNode">No Items</div><div class="containerNode"></div>' # TODO : i18n
  itemClass: Backpack.View

  initialize:(options)->
    @itemClass = options.itemClass if options.itemClass
    @$el.html @template
    @containerNode = @$ '.containerNode'
    @noItemsNode = @$ '.noItemsNode'
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
      @noItemsNode.hide()
      @containerNode.show()
    else
      @noItemsNode.show()
      @containerNode.hide()
    return

  createChild:(model)->
    view = new @itemClass model: model
    view.render()

  remove:->
    @collection.off "add remove reset", @render
    Backpack.View::remove.call @
    return