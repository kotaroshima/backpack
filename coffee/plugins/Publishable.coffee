# options
#   publishers : key
# Example :
#   view = new Backpack.View({
#     publishers : {
#       hoge: 'UPDATE_VIEW'
#     },
#     hoge: function(arg1, arg2, arg3){
#       ...
#     }
#   })
#   view.hode(1, 'a', x)
#   this will trigger Backbone.trigger('UPDATE_VIEW', 1, 'a', x)
define(
  ['Underscore','Backbone'],
  (_, Backbone)->
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

    setup:->
#      @_origFuncs = {}
      if @publishers
        for own key, value of @publishers
          insertTrigger @, key, value
      return
)