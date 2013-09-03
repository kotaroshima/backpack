###*
* A plugin to render HTML templates
###
Backpack.TemplatePlugin =
  setup:->
    template = @template
    template = template @options if _.isFunction template
    @$el.html template

    ### cache jQuery object for HTML nodes to be referenced later ###
    if @templateNodes
      for own key, val of @templateNodes
        @[key] = @$ val
    return