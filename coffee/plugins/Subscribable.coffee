Backpack.Subscribable =
  setup:->
    if @subscribers
      for own key, value of @subscribers
        cb = if _.isString(value) then @[value] else value
        Backbone.on key, cb, @
    return
  cleanup:->
    if @subscribers
      for own key, value of @subscribers
        cb = if _.isString(value) then @[value] else value
        Backbone.off key, cb, @
    return

Backpack.defaultPlugins.push Backpack.Subscribable