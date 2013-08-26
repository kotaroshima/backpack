Backpack.PublishPlugin =
  ###*
  * Sets up publishers from `publishers` property
  * `publishers` property takes key-value pair of:
  * - key : method name to trigger the event
  * - value : topic name of events to be published
  ###
  setup:->
    @_publishers = []
    if @publishers
      for own key, value of @publishers
        @addPublisher key, value
    return

  ###*
  * Add publisher
  * @param {String} method Method name to trigger the event
  * @param {String} topic Topic name of events to be published
  * @return {Object} handler object (return value of Backpack.attach)
  ###
  addPublisher:(method, topic)->
    handler = Backpack.attach @, method, ->
      args = [].slice.call arguments, 0
      args.unshift topic
      Backbone.trigger.apply Backbone, args
      return
    @_publishers.push
      handler: handler
      method: method
      topic: topic
    handler

  ###*
  * Remove publisher
  * If 1 argument
  * @param {Object} handler Handler object to detach (return value of Backpack.attach)
  * If 2 arguments
  * @param {String} method Method name to trigger the event
  * @param {String} topic Topic name of events to be published
  * @return {Boolean} true if publisher has been removed, false if not
  ###
  removePublisher:->
    found = -1
    for publisher, index in @_publishers by -1
      if arguments.length > 1 && _.isString arguments[0]
        if arguments[0] == publisher.method && arguments[1] == publisher.topic
          found = index
          break
      else
        if arguments[0] == publisher.handler
          found = index
          break;
    if found >= 0
      @_publishers[found].handler.detach()
      @_publishers.splice found, 1
      return true
    return false

  ###*
  * Remove all publishers on destroy
  ###
  cleanup:->
    _.each @_publishers, (publisher)->
      publisher.handler.detach()
      return
    @_publishers = []
    return

Backpack.defaultPlugins.push Backpack.PublishPlugin