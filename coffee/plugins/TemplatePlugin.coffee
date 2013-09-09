###*
* A plugin to render HTML templates for views
###
Backpack.TemplatePlugin =
  setup:->
    @model.on 'change', @renderTemplate, @ if @model
    @renderTemplate()

    ### cache jQuery objects of HTML nodes to be referenced later ###
    if @templateNodes
      for own key, val of @templateNodes
        @[key] = @$ val
    return

  ###*
  * Renders template HTML
  * If model is specified, interpolates model attributes.
  * Otherwise, interpolates view options
  ###
  renderTemplate:->
    template = @template
    if _.isFunction template
      template = template if @model then @model.attributes else @options
    @$el.html template
    return

  cleanup:->
    @model.off 'change', @renderTemplate if @model
    return