root = this
Backpack = root.Backpack = {}

Backpack.attach = (context, method, callback)->
  origFunc = context[method]
  context[method] =->
    ret = origFunc.apply context, arguments
    callback.apply @, arguments if callback
    ret
  {
    detach:->
      context[method] = origFunc
      return
  }

Backpack.defaultPlugins = []

setup =(self, options={})->
  # use initialization options plugins if specified
  # otherwise use plugins specified in extend
  self.plugins = options.plugins || self.plugins
  plugins = _.clone(Backpack.defaultPlugins).concat self.plugins || []

  setups = []
  _.each plugins, (pi)->
    # mixin methods specified in plugins
    for own key, value of pi
      if key != 'setup' && key != 'cleanup' && key != 'staticProps' && !self[key]
        self[key] = value
    setups.push pi.setup if pi.setup
    if pi.cleanup
      self.cleanups = [] if !self.cleanups
      self.cleanups.push pi.cleanup
    return

  # mixin all the properties/methods of initialization parameters
  for own key, value of options
    if key != 'plugins'
      self[key] = value

  # finally apply all the setups
  _.each setups, (su)->
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
  child::plugins = protoProps.plugins || []

  # apply static props
  if protoProps.plugins
    _.each protoProps.plugins, (pi)->
      _.extend child, pi.staticProps if pi.staticProps
      return
  child

Clazz = Backpack.Class =->
  @cid = _.uniqueId 'obj'
  @initialize.apply @, arguments
  return
_.extend Clazz::, Backbone.Events,
  initialize:->
    options = if arguments.length > 0 then arguments[arguments.length-1] else {}
    setup @, options
    return
  destroy:->
    cleanup @
    return
Clazz.extend = extend

Backpack.Model = Backbone.Model.extend
  initialize:(attributes, options)->
    Backbone.Model::initialize.apply @, arguments
    setup @, options
    return
  destroy:(options)->
    cleanup @
    Backbone.Model::destroy.apply @, arguments
    return
Backpack.Model.extend = extend

Backpack.Collection = Backbone.Collection.extend
  initialize:(models, options)->
    Backbone.Collection::initialize.apply @, arguments
    setup @, options
    return
  destroy:->
    cleanup @
    return
Backpack.Collection.extend = extend

Backpack.View = Backbone.View.extend
  initialize:(options)->
    Backbone.View::initialize.apply @, arguments
    setup @, options
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