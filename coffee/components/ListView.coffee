Backpack.ListView = Backpack.View.extend
  plugins: [Backpack.Container]

  itemClass: Backbone.View

  initialize:(options)->
    Backpack.View::initialize.apply @, arguments
    @itemClass = options.itemClass if options.itemClass
    @collection.on "add remove reset", @render, @
    @render()
    return

  render:->
    models = @collection.models
    @clearChildren()
    if models.length > 0
      _.each models, (model)=>
        child = @createChild model
        @addChild child
        return
    else
      @$el.html "No Items" # TODO : i18n
    @

  createChild:(model)->
    view = new @itemClass model: model
    view.render()

  remove:->
    @collection.off "add remove reset", @render
    Backpack.View::remove.call @
    return