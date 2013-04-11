root = this
Backpack = root.Backpack = {}

Subscribable = Backpack.Subscribable =
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

insertTrigger =(self, key, value)->
  if _.isFunction self[key]
    origFunc = self[key]
    newFunc =->
      ret = origFunc.apply @, arguments
      args = Array.splice.call arguments, 0, 0, value
      Backbone.trigger.apply @, args
      ret
    self[key] = _.bind newFunc, self
  return

Publishable = Backpack.Publishable =
  setup:->
    if @publishers
      for own key, value of @publishers
        insertTrigger @, key, value
    return

defaultPlugins = [Subscribable,Publishable]

setup =(self, options={})->
  # first mixin all the properties/methods of initialization parameters
  for own key, value of options
    if key == 'plugins'
      self[key] = _.clone(defaultPlugins).concat options.plugins
    else
      self[key] = value

  setups = []
  _.each self.plugins, (pi)->
    for own key, value of pi
      if key != 'setup' && key != 'cleanup' && key != 'staticProps'
        self[key] = value
    setups.push pi.setup if pi.setup
    if pi.cleanup
      self.cleanups = [] if !self.cleanups
      self.cleanups.push pi.cleanup
    return

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
  child::plugins = _.clone(defaultPlugins).concat(protoProps.plugins || [])

  # apply static props
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

Backpack.Singleton =
  setup:->
    singleton = _.find Backpack._singletons, (s)=>
      s.constructor is @constructor
    if singleton
      throw new Error 'Only single instance can be initialized'
    else
      if !Backpack._singletons
        Backpack._singletons = []
      Backpack._singletons.push @
    return
  staticProps:
    getInstance:->
      singleton = _.find Backpack._singletons, (s)=>
        s.constructor is @
      if !singleton
        singleton = new @()
      singleton

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
  remove:->
    cleanup @
    Backbone.View::remove.apply @, arguments
    return
Backpack.View.extend = extend