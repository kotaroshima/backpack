Backpack.TemplatePlugin =
  setup:->
    @$el.html @template, @templateData
    return