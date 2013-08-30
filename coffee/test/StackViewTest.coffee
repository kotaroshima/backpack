assertVisibleView = (stackView, visibleIndex)->
  _.each stackView.children, (view, index)->
    equal view.$el.is(':hidden'), (visibleIndex != index)
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