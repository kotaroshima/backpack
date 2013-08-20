root = this
Backpack = root.Backpack = {}

###
* Attach event handler
* if 3 arguments
* @param {Object} obj Object to which attach event
* @param {String} method Name of this object's method to which attach event
* @param {Function} callback Callback function
* if 4 arguments
* @param {Object} obj Object to which attach event
* @param {String} method Name of this object's method to which attach event
* @param {Object} context Context for callback function
* @param {Function|String} callback Callback function or callback function name within context
###
Backpack.attach = ->
  obj = arguments[0]
  method = arguments[1]
  switch arguments.length
    when 3
      callback = arguments[2]
    when 4
      context = arguments[2]
      if _.isString arguments[3]
        callback = context[arguments[3]]
      else
        callback = arguments[3]
  origFunc = obj[method]
  obj[method] =->
    ret = origFunc.apply obj, arguments
    context = @ if !context
    callback.apply context, arguments if callback
    ret
  {
    detach:->
      obj[method] = origFunc
      return
  }

Backpack.defaultPlugins = []

applyOptions =(self, options={})->
  # use initialization options plugins if specified
  # otherwise use plugins specified in extend
  self.plugins = options.plugins || self.plugins
  plugins = _.clone(Backpack.defaultPlugins).concat self.plugins || []

  self.setups = []
  self.cleanups = []
  mixins = {}
  _.each plugins, (pi)->
    # mixin property/methods specified in plugins
    # later plugins will overwrite previous plugins
    for own key, value of pi
      if key != 'setup' && key != 'cleanup' && key != 'staticProps'
        mixins[key] = value

    self.setups.push pi.setup if pi.setup
    self.cleanups.push pi.cleanup if pi.cleanup
    return

  for own key, value of mixins
    self[key] = value if !self[key] # don't overwrite properties specified in extend

  # mixin all the properties/methods of initialization parameters
  for own key, value of options
    if key != 'plugins' && key != 'initialize'
      self[key] = value
  return

setup =(self)->
  _.each self.setups, (su)->
    su.apply self
    return
  return

cleanup=(self)->
  _.each self.cleanups, (cu)->
    cu.apply self
    return
  return

extend =(protoProps, staticProps)->
  child = Backbone.Model.extend.call @, protoProps, staticProps

  if protoProps
    plugins = protoProps.plugins
    if plugins
      ### Override superclass plugins with subclass plugins ###
      child::plugins = plugins

      ### apply static props ###
      _.each plugins, (pi)->
        _.extend child, pi.staticProps if pi.staticProps
        return
  child::plugins = [] if !child::plugins
  child

Clazz = Backpack.Class =->
  @cid = _.uniqueId 'obj'
  @initialize.apply @, arguments
  return
_.extend Clazz::, Backbone.Events,
  initialize:->
    options = if arguments.length > 0 then arguments[arguments.length-1] else {}
    applyOptions @, options
    setup @
    options.initialize.apply @, arguments if options?.initialize
    return
  destroy:->
    cleanup @
    return
Clazz.extend = extend

Backpack.Model = Backbone.Model.extend
  initialize:(attributes, options)->
    applyOptions @, options
    setup @
    options.initialize.apply @, arguments if options?.initialize
    return
  destroy:(options)->
    cleanup @
    Backbone.Model::destroy.apply @, arguments
    return
Backpack.Model.extend = extend

Backpack.Collection = Backbone.Collection.extend
  initialize:(models, options)->
    applyOptions @, options
    setup @
    options.initialize.apply @, arguments if options?.initialize
    return
  destroy:->
    cleanup @
    return
Backpack.Collection.extend = extend

Backpack.View = Backbone.View.extend
  initialize:(options)->
    applyOptions @, options
    setup @
    options.initialize.apply @, arguments if options?.initialize
    return

  ###
  * Override so that event handler works even if method has been dynamically overwritten
  * TODO : submit a patch to Backbone
  ###
  delegateEvents: (events)->
    return @ if !(events || (events = _.result(@, 'events')))
    @undelegateEvents()

    bindMethod = (methodName)=>
      method = (e)=>
        @[methodName](e)
      _.bind method, @

    for own key of events
      methodName = events[key]
      continue if !@[methodName] || !_.isFunction @[methodName]
      match = key.match /^(\S+)\s*(.*)$/
      eventName = match[1]
      selector = match[2]
      method = bindMethod methodName
      eventName += '.delegateEvents' + @cid
      if selector == ''
        @$el.on eventName, method
      else
        @$el.on eventName, selector, method
    @

  remove:->
    cleanup @
    Backbone.View::remove.apply @, arguments
    return
  destroy:->
    @remove()
    return
Backpack.View.extend = extend