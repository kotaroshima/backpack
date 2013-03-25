# options
#   subscribers : key
# Example :
#   view = new Backpack.View({
#     subscribers : {
#       UPDATE_VIEW: 'onUpdate'
#     }
#   })
#   Backbone.trigger('UPDATE_VIEW')
#   this will trigger view.onUpdate
define(
  ['Underscore', 'Backbone'],
  (_, Backbone)->
    setup:->
      if @options?.subscribers
        for own key, value of @options.subscribers
          cb = if _.isString(value) then @[value] else value
          Backbone.on key, cb, @
      return

    cleanup:->
      if @options?.subscribers
        for own key, value of @options.subscribers
          cb = if _.isString(value) then @[value] else value
          Backbone.off key, cb, @
      return
)