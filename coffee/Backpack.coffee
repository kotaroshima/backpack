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
  # first mixin all the properties/methods of initialization parameters
  for own key, value of options
    if key == 'plugins'
      self[key] = _.clone(Backpack.defaultPlugins).concat options.plugins
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
  child::plugins = _.clone(Backpack.defaultPlugins).concat(protoProps.plugins || [])

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

Backpack.Subscribable =
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
Backpack.defaultPlugins.push Backpack.Subscribable

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