Backpack.ListView = Backpack.View.extend
  itemClass: Backbone.View

  initialize:(options)->
    Backpack.View::initialize.apply @, arguments
    @itemClass = options.itemClass if options.itemClass
    @collection.on "add remove reset", @render, @
    @_views = []
    @render()
    return

  render:->
    models = @collection.models
    @clearChildren()
    if models.length > 0
      _.each models, @addChild, @
    else
      @$el.html "No Items" # TODO : i18n
    @

  getChild:(index)->
    @_views[index]

  addChild:(model)->
    view = new @itemClass model: model
    @$el.append view.render().$el
    @_views.push view
    return

  clearChildren:->
    for i in [@_views.length-1..0] by -1
      @removeChild i
    return

  removeChild:(index)->
    @_views[index].remove()
    @_views.splice index,1
    return

  filterChildren:(options)->
    _.filter @_views, (view)->
      if view.model.filter options
        view.$el.show()
      else
        view.$el.hide()
      return
    return

  remove:->
    @collection.off "add remove reset", @render
    Backpack.View::remove.call @
    return