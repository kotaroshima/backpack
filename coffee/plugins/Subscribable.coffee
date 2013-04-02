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
)