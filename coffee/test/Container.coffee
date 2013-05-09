Backbone.sync = ->

module 'Backpack.Container',
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

test 'initialize with child views', ->
  data = ['Orange', 'Apple', 'Grape']
  views = _.map data, (item)=>
    new @ItemView
      name: item
  @containerView = new Backpack.View
    plugins: [Backpack.Container]
    children: views
  $('#testNode').append @containerView.$el
  itemNodes = $('#testNode .childViewNode')
  equal itemNodes.size(), data.length
  itemNodes.each (index, node)->
    equal $(@).is(':visible'), true
    equal $(@).text(), data[index]
    return
  return

test 'add child views after initialize', ->
  data = ['Orange', 'Apple', 'Grape']
  @containerView = new Backpack.View
    plugins: [Backpack.Container]
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

test 'get child view at specified index', ->
  data = ['Orange', 'Apple', 'Grape']
  views = _.map data, (item)=>
    new @ItemView
      name: item
  @containerView = new Backpack.View
    plugins: [Backpack.Container]
    children: views
  $('#testNode').append @containerView.$el
  itemNodes = $('#testNode .childViewNode')
  equal itemNodes.size(), data.length
  _.each views, (view, index)=>
    strictEqual view, @containerView.getChild(index)
    return
  return

test 'remove child view', ->
  data = ['Orange', 'Apple', 'Grape']
  views = _.map data, (item)=>
    new @ItemView
      name: item
  @containerView = new Backpack.View
    plugins: [Backpack.Container]
    children: views
  $('#testNode').append @containerView.$el
  @containerView.removeChild views[1]
  itemNodes = $('#testNode .childViewNode')
  equal itemNodes.size(), 2
  return

test 'remove child view at specified index', ->
  data = ['Orange', 'Apple', 'Grape']
  views = _.map data, (item)=>
    new @ItemView
      name: item
  @containerView = new Backpack.View
    plugins: [Backpack.Container]
    children: views
  $('#testNode').append @containerView.$el
  @containerView.removeChild 1
  itemNodes = $('#testNode .childViewNode')
  equal itemNodes.size(), 2
  return

test 'clear child views', ->
  data = ['Orange', 'Apple', 'Grape']
  views = _.map data, (item)=>
    new @ItemView
      name: item
  @containerView = new Backpack.View
    plugins: [Backpack.Container]
    children: views
  $('#testNode').append @containerView.$el
  @containerView.clearChildren()
  itemNodes = $('#testNode .childViewNode')
  equal itemNodes.size(), 0
  return