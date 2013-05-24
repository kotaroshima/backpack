Backbone.sync = ->

module 'Backpack.ContainerPlugin',
  setup:->
    @ItemView = Backpack.View.extend
      template: _.template '<div class="childViewNode" style="border:1px solid red"><%- name %></div>'
      initialize:(options)->
        @$el.html @template options
        return
    return
  teardown:->
    @containerView.destroy() if @containerView
    return

test 'initialize with child views', 7, ->
  data = ['Orange', 'Apple', 'Grape']
  views = _.map data, (item)=>
    new @ItemView
      name: item
  @containerView = new Backpack.View
    plugins: [Backpack.ContainerPlugin]
    children: views
  $('#testNode').append @containerView.$el
  itemNodes = $('#testNode .childViewNode')
  equal itemNodes.size(), data.length
  itemNodes.each (index, node)->
    equal $(@).is(':visible'), true
    equal $(@).text(), data[index]
    return
  return

test 'add child views after initialize', 7, ->
  data = ['Orange', 'Apple', 'Grape']
  @containerView = new Backpack.View
    plugins: [Backpack.ContainerPlugin]
  $('#testNode').append @containerView.$el
  _.each data, (item)=>
    view = new @ItemView
      name: item
    @containerView.addChild view
    return
  itemNodes = $('#testNode .childViewNode')
  equal itemNodes.size(), data.length
  itemNodes.each (index, node)->
    equal $(@).is(':visible'), true
    equal $(@).text(), data[index]
    return
  return

test 'get child view at specified index', 4, ->
  data = ['Orange', 'Apple', 'Grape']
  views = _.map data, (item)=>
    new @ItemView
      name: item
  @containerView = new Backpack.View
    plugins: [Backpack.ContainerPlugin]
    children: views
  $('#testNode').append @containerView.$el
  itemNodes = $('#testNode .childViewNode')
  equal itemNodes.size(), data.length
  _.each views, (view, index)=>
    strictEqual view, @containerView.getChild(index)
    return
  return

test 'remove child view', 1, ->
  data = ['Orange', 'Apple', 'Grape']
  views = _.map data, (item)=>
    new @ItemView
      name: item
  @containerView = new Backpack.View
    plugins: [Backpack.ContainerPlugin]
    children: views
  $('#testNode').append @containerView.$el
  @containerView.removeChild views[1]
  itemNodes = $('#testNode .childViewNode')
  equal itemNodes.size(), 2
  return

test 'remove child view at specified index', 1, ->
  data = ['Orange', 'Apple', 'Grape']
  views = _.map data, (item)=>
    new @ItemView
      name: item
  @containerView = new Backpack.View
    plugins: [Backpack.ContainerPlugin]
    children: views
  $('#testNode').append @containerView.$el
  @containerView.removeChild 1
  itemNodes = $('#testNode .childViewNode')
  equal itemNodes.size(), 2
  return

test 'clear child views', 1, ->
  data = ['Orange', 'Apple', 'Grape']
  views = _.map data, (item)=>
    new @ItemView
      name: item
  @containerView = new Backpack.View
    plugins: [Backpack.ContainerPlugin]
    children: views
  $('#testNode').append @containerView.$el
  @containerView.clearChildren()
  itemNodes = $('#testNode .childViewNode')
  equal itemNodes.size(), 0
  return