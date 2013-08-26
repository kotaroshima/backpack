Backpack.SubscribePlugin =
  ###*
  * Sets up subscribers from `subscribers` property
  * `subscribers` property takes key-value pair of:
  * - key : topic name of events to subscribe
  * - value : method name of callback function
  ###
  setup:->
    @_subscribers = []
    if @subscribers
      for own key, value of @subscribers
        @addSubscriber key, value
    return

  ###*
  * Subscribe to topic
  * @param {String} topic Topic name of events to subscribe
  * @param {String|Function} cb Callback function to be called
  ###
  addSubscriber:(topic, cb)->
    cb = @[cb] if _.isString(cb)
    @_subscribers.push 
      topic: topic
      callback: cb
    Backbone.on topic, cb, @

  ###*
  * Unsubscribe to topic
  * @param {String} topic Topic name to unsubscribe
  * @param {String|Function} cb Callback function
  * @return {Boolean} true if publisher has been removed, false if not
  ###
  removeSubscriber:(topic, cb)->
    cb = @[cb] if _.isString(cb)
    found = -1
    for subscriber, index in @_subscribers by -1
      if topic == subscriber.topic && cb == subscriber.callback
        found = index
        break
    if found >= 0
      @_subscribers.splice found, 1 if found != -1
      Backbone.off topic, cb, @
      return true
    return false

  ###*
  * Remove all subscribers on destroy
  ###
  cleanup:->
    _.each @_subscribers, (subscriber)=>
      Backbone.off subscriber.topic, subscriber.callback, @
    @_subscribers = []
    return

Backpack.defaultPlugins.push Backpack.SubscribePlugin