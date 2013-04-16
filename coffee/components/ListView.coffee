Backpack.ListView = Backpack.View.extend
  plugins: [Backpack.Container]

  template: '<div class="noItemsNode">No Items</div><div class="containerNode"></div>' # TODO : i18n
  itemClass: Backpack.View

  initialize:(options)->
    Backpack.View::initialize.apply @, arguments
    @itemClass = options.itemClass if options.itemClass
    @collection.on "add remove reset", @render, @
    @$el.html @template
    @render()
    return

  getContainerNode:->
    if !@_containerRoot
      @_containerRoot = @$ '.containerNode'
    @_containerRoot

  getNoItemsNode:->
    if !@_noItemsNode
      @_noItemsNode = @$ '.noItemsNode'
    @_noItemsNode

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
      @getNoItemsNode().hide()
      @getContainerNode().show()
    else
      @getNoItemsNode().show()
      @getContainerNode().hide()
    return

  createChild:(model)->
    view = new @itemClass model: model
    view.render()

  remove:->
    @collection.off "add remove reset", @render
    Backpack.View::remove.call @
    return