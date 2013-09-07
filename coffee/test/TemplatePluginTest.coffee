module 'Backpack.TemplatePlugin',
  setup:->
    @testNode = $ '#testNode'
  teardown:->
    @view.destroy() if @view
    return

test 'extend with static HTML', 1, ->
  text = 'hoge'
  TestView = Backpack.View.extend
    plugins: [Backpack.TemplatePlugin]
    template: text
  view = @view = new TestView()
  @testNode.append view.$el
  equal view.$el.text(), text, 'view is rendered with template HTML'
  return

test 'render static HTML specified in initialization options', 1, ->
  text = 'hoge'
  view = @view = new Backpack.View
    plugins: [Backpack.TemplatePlugin]
    template: text
  @testNode.append view.$el
  equal view.$el.text(), text, 'view is rendered with template HTML'
  return

test 'extend and interpolate with initialization options', 1, ->
  text = 'hoge'
  TestView = Backpack.View.extend
    plugins: [Backpack.TemplatePlugin]
    template: _.template '<%= text %>'
  view = @view = new TestView text: text
  @testNode.append view.$el
  equal view.$el.text(), text, 'view is rendered with template HTML'
  return

test 'interpolate with initialization options', 1, ->
  text = 'hoge'
  view = @view = new Backpack.View
    plugins: [Backpack.TemplatePlugin]
    template: _.template '<%= text %>'
    text: text
  @testNode.append view.$el
  equal view.$el.text(), text, 'view is rendered with template HTML'
  return

test 'extend and interpolate with model attributes', 1, ->
  text = 'hoge'
  model = new Backpack.Model text: text
  TestView = Backpack.View.extend
    plugins: [Backpack.TemplatePlugin]
    template: _.template '<%= text %>'
  view = @view = new TestView model: model
  @testNode.append view.$el
  equal view.$el.text(), text, 'view is rendered with template HTML'
  return

test 'interpolate with model attributes', 1, ->
  text = 'hoge'
  model = new Backpack.Model text: text
  view = @view = new Backpack.View
    plugins: [Backpack.TemplatePlugin]
    template: _.template '<%= text %>'
    model: model
  @testNode.append view.$el
  equal view.$el.text(), text, 'view is rendered with template HTML'
  return

test 'extend with templateNodes', 2, ->
  text1 = 'Text 1'
  text2 = 'Text 2'
  TestView = Backpack.View.extend
    plugins: [Backpack.TemplatePlugin]
    template: '<div><div id="my-id">'+text1+'</div><div class="my-class">'+text2+'</div></div>'
    templateNodes:
      myId: '#my-id'
      myClass: '.my-class'
  view = @view = new TestView()
  @testNode.append view.$el
  equal view.myId.text(), text1, 'jQuery object can be referenced with templateNodes'
  equal view.myClass.text(), text2, 'jQuery object can be referenced with templateNodes'
  return

test 'initialize with templateNodes', 2, ->
  text1 = 'Text 1'
  text2 = 'Text 2'
  view = @view = new Backpack.View
    plugins: [Backpack.TemplatePlugin]
    template: '<div><div id="my-id">'+text1+'</div><div class="my-class">'+text2+'</div></div>'
    templateNodes:
      myId: '#my-id'
      myClass: '.my-class'
  @testNode.append view.$el
  equal view.myId.text(), text1, 'jQuery object can be referenced with templateNodes'
  equal view.myClass.text(), text2, 'jQuery object can be referenced with templateNodes'
  return