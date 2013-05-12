Backpack.AttachPlugin =
  setup:->
    @_attached = []
    return

  ###
  * Attaches an event handler, which will be detached when this object is destroyed
  * if 2 arguments:
  * @param {String} method Name of this object's method to which attach event
  * @param {Function} cb Callback function
  * if 3 arguments:
  * @param {Object} object Object to which attach event
  * @param {String} method Method name of object to which attach event
  * @param {Function} cb Callback function
  ###
  attach:->
    switch arguments.length
      when 2
        handler = Backpack.attach @, arguments[0], arguments[1]
      when 3
        handler = Backpack.attach arguments[0], arguments[1], arguments[2]
    @_attached.push handler
    handler

  ###
  * Detaches an event and it will be removed from event handler list which will be cleaned up on destroy
  * @param {Object} handler Event handler
  ###
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

Backpack.defaultPlugins.push Backpack.AttachPlugin