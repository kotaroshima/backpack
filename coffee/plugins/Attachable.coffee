Backpack.Attachable =
  setup:->
    @_attached = []
    return
  attach:(method, callback)->
    handler = Backpack.attach @, method, callback
    @_attached.push handler
    handler
  cleanup:->
    _.invoke @_attached, 'detach'
    return

Backpack.defaultPlugins.push Backpack.Attachable