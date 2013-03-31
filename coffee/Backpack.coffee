define(
  ['jQuery', 'Underscore', 'Backbone', 'backpack/plugins/Subscribable'],
  ($, _, Backbone, Subscribable) ->
    setup =(self, options={})->
      self.cleanups = []
      for own key, value of options
        self[key] = value
      plugins = [Subscribable]
      plugins = plugins.concat self.options.plugins if self.options?.plugins
      _.each plugins, (pi)->
        su = pi.setup
        td = pi.cleanup
        for own key, value of pi
          if key isnt 'setup' and key isnt 'cleanup'
            self[key] = value
        su.apply self if su
        self.cleanups.push td if td
        return
      return

    cleanup=(self)->
      _.each self.cleanups, (td)->
        td.apply self
        return
      return

    Model: Backbone.Model.extend
      initialize:(attributes, options)->
        Backbone.Model::initialize.apply @, arguments
        setup @, options
        return
      destroy:(options)->
        cleanup @
        Backbone.Model::destroy.apply @, arguments
        return
    Collection: Backbone.Collection.extend
      initialize:(models, options)->
        Backbone.Collection::initialize.apply @, arguments
        setup @, options
        return
      destroy:->
        cleanup @
        return
    View: Backbone.View.extend
      initialize:(options)->
        Backbone.View::initialize.apply @, arguments
        setup @, options
        return
      remove:->
        cleanup @
        Backbone.View::remove.apply @, arguments
        return
)