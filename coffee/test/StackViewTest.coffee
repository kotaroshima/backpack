assert_visible_view = (views, visibleIndex)->
  _.each views, (view, index)->
    equal view.$el.is(':hidden'), (visibleIndex != index)
    return
  return

module 'Backpack.StackView',
  teardown:->
    @stackView.destroy() if @stackView
    return

test 'initialize by passing children', ->
  view1 = new Backpack.View
    initialize:(options)->
      @$el.html '<div style="background-color:blue">View1</div>'
      return
  view2 = new Backpack.View
    initialize:(options)->
      @$el.html '<div style="background-color:red">View2</div>'
      return
  @stackView = new Backpack.StackView
    children: [view1, view2]
    selectedIndex: 0
  $('#testNode').append @stackView.$el
  assert_visible_view [view1, view2], 0
  return

test 'no selectedIndex', ->
  view1 = new Backpack.View
    initialize:(options)->
      @$el.html '<div style="background-color:blue">View1</div>'
      return
  view2 = new Backpack.View
    initialize:(options)->
      @$el.html '<div style="background-color:red">View2</div>'
      return
  @stackView = new Backpack.StackView
    children: [view1, view2]
  $('#testNode').append @stackView.$el
  assert_visible_view [view1, view2], 0
  return

test 'display view specified by selectedIndex', ->
  view1 = new Backpack.View
    initialize:(options)->
      @$el.html '<div style="background-color:blue">View1</div>'
      return
  view2 = new Backpack.View
    initialize:(options)->
      @$el.html '<div style="background-color:red">View2</div>'
      return
  @stackView = new Backpack.StackView
    children: [view1, view2]
    selectedIndex: 1
  $('#testNode').append @stackView.$el
  assert_visible_view [view1, view2], 1
  return

test 'attach navigation event', ->
  view1 = new Backpack.View
    name: 'view1'
    initialize:(options)->
      @$el.html '<div style="background-color:blue">View1</div>'
      return
    showNext:->
  view2 = new Backpack.View
    name: 'view2'
    initialize:(options)->
      @$el.html '<div style="background-color:red">View2</div>'
      return
    showPrevious:->
  @stackView = new Backpack.StackView
    children: [view1, view2]
    selectedIndex: 0,
    navigationEvents:
      view1:
        event: 'showNext'
        target: 'view2'
      view2:
        event: 'showPrevious'
        target: 'view1'
  $('#testNode').append @stackView.$el
  view1.showNext()
  assert_visible_view [view1, view2], 1
  view2.showPrevious()
  assert_visible_view [view1, view2], 0
  return

test 'attach navigation event in array', ->
  view1 = new Backpack.View
    name: 'view1'
    initialize:(options)->
      @$el.html '<div style="background-color:blue">View1</div>'
      return
    showView2:->
    showView3:->
  view2 = new Backpack.View
    name: 'view2'
    initialize:(options)->
      @$el.html '<div style="background-color:yellow">View2</div>'
      return
    showView1:->
  view3 = new Backpack.View
    name: 'view3'
    initialize:(options)->
      @$el.html '<div style="background-color:red">View3</div>'
      return
    showView1:->
  @stackView = new Backpack.StackView
    children: [view1, view2, view3]
    selectedIndex: 0,
    navigationEvents:
      view1:
        [
          { event: 'showView2', target: 'view2' },
          { event: 'showView3', target: 'view3' }
        ]
      view2:
        event: 'showView1'
        target: 'view1'
      view3:
        event: 'showView1'
        target: 'view1'
  $('#testNode').append @stackView.$el
  assert_visible_view [view1, view2, view3], 0
  view1.showView2()
  assert_visible_view [view1, view2, view3], 1
  view2.showView1()
  assert_visible_view [view1, view2, view3], 0
  view1.showView3()
  assert_visible_view [view1, view2, view3], 2
  return