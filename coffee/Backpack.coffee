Backpack = window.Backpack = {} unless window.Backpack?

Subscribable =
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

Publishable =
  setup:->
    if @publishers
      for own key, value of @publishers
        insertTrigger @, key, value
    return

setup =(self, options={})->
  # first mixin all the properties/methods of initialization parameters
  for own key, value of options
    self[key] = if _.isFunction(value) then _.bind(value, self) else value

  # then mixin all the properties/methods of plugins
  self.cleanups = []
  setups = []
  plugins = [Subscribable,Publishable] # default plugins
  plugins = plugins.concat options.plugins if options?.plugins
  _.each plugins, (pi)->
    su = pi.setup
    cu = pi.cleanup
    for own key, value of pi
      if key isnt 'setup' and key isnt 'cleanup'
        self[key] = if _.isFunction(value) then _.bind(value, self) else value
    setups.push su if su
    self.cleanups.push cu if cu
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

Backpack.Model = Backbone.Model.extend
  initialize:(attributes, options)->
    Backbone.Model::initialize.apply @, arguments
    setup @, options
    return
  destroy:(options)->
    cleanup @
    Backbone.Model::destroy.apply @, arguments
    return

Backpack.Collection = Backbone.Collection.extend
  initialize:(models, options)->
    Backbone.Collection::initialize.apply @, arguments
    setup @, options
    return
  destroy:->
    cleanup @
    return

Backpack.View = Backbone.View.extend
  initialize:(options)->
    Backbone.View::initialize.apply @, arguments
    setup @, options
    return
  remove:->
    cleanup @
    Backbone.View::remove.apply @, arguments
    return