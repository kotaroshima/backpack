Backpack.Publishable =
  setup:->
    if @publishers
      for own key, value of @publishers
        @attachTrigger key, value
    return
  attachTrigger:(method, topic)->
    Backpack.attach @, method, ->
      args = [].slice.call arguments, 0
      args.unshift topic
      Backbone.trigger.apply Backbone, args
      return
    return

Backpack.defaultPlugins.push Backpack.Publishable