Backpack.Subscribable =
  setup:->
    @_subscribed = []
    if @subscribers
      for own key, value of @subscribers
        @subscribe key, value
    return

  ###*
  * Subscribe to topic
  * @param {String} topic Topic name to subscribe
  * @param {String|Function} cb Callback function to be called
  ###
  subscribe:(topic, cb)->
    cb = @[cb] if _.isString(cb)
    @_subscribed.push [topic, cb]
    Backbone.on topic, cb, @

  ###*
  * Unsubscribe to topic
  * @param {String} topic Topic name to unsubscribe
  * @param {String|Function} cb Callback function
  ###
  unsubscribe:(topic, cb)->
    cb = @[cb] if _.isString(cb)
    found = -1
    for subscribed, index in @_subscribed by -1
      if topic == subscribed[0] && cb == subscribed[1]
        found = index
        break
    @_subscribed.splice found, 1 if found != -1
    Backbone.off topic, cb, @

  cleanup:->
    for subscribed, index in @_subscribed by -1
      @_subscribed.splice index, 1
      cb = @[cb] if _.isString(cb)
      Backbone.off topic, cb, @
    return

Backpack.defaultPlugins.push Backpack.Subscribable