Backpack.Attachable =
  setup:->
    @_attached = []
    return
  attach:(method, callback)->
    handler = Backpack.attach @, method, callback
    @_attached.push handler
    handler
  detach:(handler)->
    index = _.indexOf @_attached, handler
    ret = false
    if index != -1
      @_attached.splice index, 1
      handler.detach()
      ret = true
    ret
  cleanup:->
    _.invoke @_attached, 'detach'
    @_attached = []
    return

Backpack.defaultPlugins.push Backpack.Attachable