assertVisibleView = (stackView, visibleIndex)->
  _.each stackView.children, (view, index)->
    contentAssertMsg = if visibleIndex == index then 'content view should be visible' else 'content view should be hidden'
    equal view.$el.is(':hidden'), (visibleIndex != index), contentAssertMsg+' ('+index+')'
    return
  return

module 'Backpack.StackView',
  teardown:->
    @stackView.destroy() if @stackView
    return

test 'initialize by passing children', 2, ->
  view1 = new Backpack.View
    initialize:(options)->
      @$el.html '<div>View1</div>'
      return
  view2 = new Backpack.View
    initialize:(options)->
      @$el.html '<div>View2</div>'
      return
  stackView = @stackView = new Backpack.StackView
    children: [view1, view2]
    showIndex: 0
  $('#testNode').append stackView.$el
  assertVisibleView stackView, 0
  return

test 'no showIndex', 2, ->
  view1 = new Backpack.View
    initialize:(options)->
      @$el.html '<div>View1</div>'
      return
  view2 = new Backpack.View
    initialize:(options)->
      @$el.html '<div>View2</div>'
      return
  stackView = @stackView = new Backpack.StackView
    children: [view1, view2]
  $('#testNode').append stackView.$el
  assertVisibleView stackView, 0
  return

test 'display view specified by showIndex', 2, ->
  view1 = new Backpack.View
    initialize:(options)->
      @$el.html '<div>View1</div>'
      return
  view2 = new Backpack.View
    initialize:(options)->
      @$el.html '<div>View2</div>'
      return
  stackView = @stackView = new Backpack.StackView
    children: [view1, view2]
    showIndex: 1
  $('#testNode').append stackView.$el
  assertVisibleView stackView, 1
  return

test 'remove view', 6, ->
  view1 = new Backpack.View
    initialize:(options)->
      @$el.html '<div>View1</div>'
      return
  view2 = new Backpack.View
    initialize:(options)->
      @$el.html '<div>View2</div>'
      return
  view3 = new Backpack.View
    initialize:(options)->
      @$el.html '<div>View3</div>'
      return
  stackView = @stackViewView = new Backpack.StackView
    children: [view1, view2, view3]
  $('#testNode').append stackView.$el
  assertVisibleView stackView, 0

  stackView.removeChild view2
  equal stackView.children.length, 2, 'number of children should be 2'
  assertVisibleView stackView, 0
  return

test 'remove visible last view', 6, ->
  view1 = new Backpack.View
    initialize:(options)->
      @$el.html '<div>View1</div>'
      return
  view2 = new Backpack.View
    initialize:(options)->
      @$el.html '<div>View2</div>'
      return
  view3 = new Backpack.View
    initialize:(options)->
      @$el.html '<div>View3</div>'
      return
  stackView = @stackView = new Backpack.StackView
    children: [view1, view2, view3]
    showIndex: 2
  $('#testNode').append stackView.$el
  assertVisibleView stackView, 2

  stackView.removeChild view3
  equal stackView.children.length, 2, 'number of children should be 2'
  assertVisibleView stackView, 1
  return

test 'remove visible first view', 6, ->
  view1 = new Backpack.View
    initialize:(options)->
      @$el.html '<div>View1</div>'
      return
  view2 = new Backpack.View
    initialize:(options)->
      @$el.html '<div>View2</div>'
      return
  view3 = new Backpack.View
    initialize:(options)->
      @$el.html '<div>View3</div>'
      return
  stackView = @stackView = new Backpack.StackView
    children: [view1, view2, view3]
    showIndex: 0
  $('#testNode').append stackView.$el
  assertVisibleView stackView, 0

  stackView.removeChild view1
  equal stackView.children.length, 2, 'number of children should be 2'
  assertVisibleView stackView, 0
  return

test 'remove single remaining view and then add new views', 8, ->
  view1 = new Backpack.View
    initialize:(options)->
      @$el.html '<div>View1</div>'
      return
  stackView = @stackView = new Backpack.StackView
    children: [view1]
  $('#testNode').append stackView.$el
  assertVisibleView stackView, 0
  stackView.removeChild view1
  equal stackView.children.length, 0, 'number of children should be 0'
  equal stackView._currentView, null, 'current view should be null'

  view2 = new Backpack.View
    initialize:(options)->
      @$el.html '<div>View2</div>'
      return
  stackView.addChild view2
  equal stackView.children.length, 1, 'number of children should be 1'
  assertVisibleView stackView, 0

  view3 = new Backpack.View
    initialize:(options)->
      @$el.html '<div>View3</div>'
      return
  stackView.addChild view3
  equal stackView.children.length, 2, 'number of children should be 2'
  assertVisibleView stackView, 0
  return

asyncTest 'attach navigation event', 4, ->
  view1 = new Backpack.View
    name: 'view1'
    initialize:(options)->
      @$el.html '<div>View1</div>'
      return
    showNext:->
  view2 = new Backpack.View
    name: 'view2'
    initialize:(options)->
      @$el.html '<div>View2</div>'
      return
    showPrevious:->
  stackView = @stackView = new Backpack.StackView
    children: [view1, view2]
    showIndex: 0,
    navigationEvents:
      view1:
        event: 'showNext'
        target: 'view2'
      view2:
        event: 'showPrevious'
        target: 'view1'
  $('#testNode').append stackView.$el
  view1.showNext()
  view2.$el.promise().done ->
    assertVisibleView stackView, 1
    view2.showPrevious()
    view1.$el.promise().done ->
      assertVisibleView stackView, 0
      start()
      return
    return
  return

asyncTest 'attach navigation event in array', 12, ->
  view1 = new Backpack.View
    name: 'view1'
    initialize:(options)->
      @$el.html '<div>View1</div>'
      return
    showView2:->
    showView3:->
  view2 = new Backpack.View
    name: 'view2'
    initialize:(options)->
      @$el.html '<div>View2</div>'
      return
    showView1:->
  view3 = new Backpack.View
    name: 'view3'
    initialize:(options)->
      @$el.html '<div>View3</div>'
      return
    showView1:->
  stackView = @stackView = new Backpack.StackView
    children: [view1, view2, view3]
    showIndex: 0,
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
  $('#testNode').append stackView.$el
  assertVisibleView stackView, 0
  view1.showView2()
  view2.$el.promise().done ->
    assertVisibleView stackView, 1
    view2.showView1()
    view1.$el.promise().done ->
      assertVisibleView stackView, 0
      view1.showView3()
      view3.$el.promise().done ->
        assertVisibleView stackView, 2
        start()
        return
      return
    return
  return

asyncTest 'attach navigation event with back', 18, ->
  view1 = new Backpack.View
    name: 'view1'
    initialize:(options)->
      @$el.html '<div>View1</div>'
      return
    showView2:->
    showView3:->
  view2 = new Backpack.View
    name: 'view2'
    initialize:(options)->
      @$el.html '<div>View2</div>'
      return
    showView3:->
  view3 = new Backpack.View
    name: 'view3'
    initialize:(options)->
      @$el.html '<div>View3</div>'
      return
    showPrevious:->
  stackView = @stackView = new Backpack.StackView
    children: [view1, view2, view3]
    showIndex: 0,
    navigationEvents:
      view1:
        [
          { event: 'showView2', target: 'view2' },
          { event: 'showView3', target: 'view3' }
        ]
      view2:
        event: 'showView3'
        target: 'view3'
      view3:
        event: 'showPrevious'
        back: true
  $('#testNode').append stackView.$el
  assertVisibleView stackView, 0
  view1.showView3()
  view3.$el.promise().done ->
    assertVisibleView stackView, 2
    view3.showPrevious()
    view1.$el.promise().done ->
      assertVisibleView stackView, 0
      view1.showView2()
      view2.$el.promise().done ->
        assertVisibleView stackView, 1
        view2.showView3()
        view3.$el.promise().done ->
          assertVisibleView stackView, 2
          view3.showPrevious()
          view2.$el.promise().done ->
            assertVisibleView stackView, 1
            start()
            return
          return
        return
      return
    return
  return