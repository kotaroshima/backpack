module 'Backpack.TabView',
  teardown:->
    @tabView.destroy() if @tabView
    return

assertSelectedView = (tabView, visibleIndex)->
  _.each tabView.children, (view, index)->
    isSelected = (visibleIndex == index)
    contentAssertMsg = if isSelected then 'content view should be visible' else 'content view should be hidden'
    equal view.$el.is(':hidden'), !isSelected, contentAssertMsg+' ('+index+')'
    buttonAssertMsg = if isSelected then 'tab button view should be visible' else 'tab button view should be hidden'
    equal tabView._buttonMap[view.cid].$el.hasClass('selected'), isSelected, buttonAssertMsg+' ('+index+')'
    return
  return

assertTabButtonClick = (tabView, tabIndex)->
  tabButton = tabView._buttonMap[tabView.getChild(tabIndex).cid].$el
  handler = ->
    assertSelectedView tabView, tabIndex, 'tab button should be clicked'
    return
  tabButton.click handler
  tabButton.click()
  tabButton.off 'click', handler
  return

test 'initialize by passing children', 6, ->
  tabLabels = ['view1', 'view2']
  view1 = new Backpack.View
    name: tabLabels[0]
    initialize:(options)->
      @$el.html '<div>View1</div>'
      return
  view2 = new Backpack.View
    name: tabLabels[1]
    initialize:(options)->
      @$el.html '<div>View2</div>'
      return
  tabView = @tabView = new Backpack.TabView
    children: [view1, view2]
    showIndex: 0
  testNode = $ '#testNode'
  testNode.append tabView.$el
  assertSelectedView tabView, 0
  testNode.find('.tab-button').each (index, tabButton)->
    equal $(@).text(), tabLabels[index], 'tab label is correctly displayed'
    return
  return

test 'title shown in tab button', 6, ->
  tabLabels = ['View 1', 'View 2']
  view1 = new Backpack.View
    name: 'view1'
    title: tabLabels[0]
    initialize:(options)->
      @$el.html '<div>View1</div>'
      return
  view2 = new Backpack.View
    name: 'view2'
    title: tabLabels[1]
    initialize:(options)->
      @$el.html '<div>View2</div>'
      return
  tabView = @tabView = new Backpack.TabView
    children: [view1, view2]
    showIndex: 0
  testNode = $ '#testNode'
  testNode.append tabView.$el
  assertSelectedView tabView, 0
  testNode.find('.tab-button').each (index, tabButton)->
    equal $(@).text(), tabLabels[index], 'tab label is correctly displayed'
    return
  return

test 'no showIndex', 4, ->
  view1 = new Backpack.View
    initialize:(options)->
      @$el.html '<div>View1</div>'
      return
  view2 = new Backpack.View
    initialize:(options)->
      @$el.html '<div>View2</div>'
      return
  tabView = @tabView = new Backpack.TabView
    children: [view1, view2]
  $('#testNode').append tabView.$el
  assertSelectedView tabView, 0
  return

test 'display view specified by showIndex', 4, ->
  view1 = new Backpack.View
    initialize:(options)->
      @$el.html '<div>View1</div>'
      return
  view2 = new Backpack.View
    initialize:(options)->
      @$el.html '<div>View2</div>'
      return
  tabView = @tabView = new Backpack.TabView
    children: [view1, view2]
    showIndex: 1
  $('#testNode').append tabView.$el
  assertSelectedView tabView, 1
  return

test 'display corresponding view by clicking tab button', 30, ->
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
  tabView = @tabView = new Backpack.TabView
    children: [view1, view2, view3]
  $('#testNode').append tabView.$el
  assertSelectedView tabView, 0

  assertTabButtonClick tabView, 2
  assertTabButtonClick tabView, 0
  assertTabButtonClick tabView, 1
  assertTabButtonClick tabView, 0
  return

test 'add child and click added tab', 23, ->
  view1 = new Backpack.View
    initialize:(options)->
      @$el.html '<div>View1</div>'
      return
  view2 = new Backpack.View
    initialize:(options)->
      @$el.html '<div>View2</div>'
      return
  tabView = @tabView = new Backpack.TabView
    children: [view1, view2]
  $('#testNode').append tabView.$el
  assertSelectedView tabView, 0

  view3 = new Backpack.View
    initialize:(options)->
      @$el.html '<div>View3</div>'
      return
  tabView.addChild view3
  equal tabView.children.length, 3, 'number of children should be 3'
  assertSelectedView tabView, 0

  assertTabButtonClick tabView, 2
  assertTabButtonClick tabView, 1
  return

test 'remove view', 11, ->
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
  tabView = @tabView = new Backpack.TabView
    children: [view1, view2, view3]
  $('#testNode').append tabView.$el
  assertSelectedView tabView, 0

  tabView.removeChild view2
  equal tabView.children.length, 2, 'number of children should be 2'
  assertSelectedView tabView, 0
  return

test 'remove selected last view', 11, ->
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
  tabView = @tabView = new Backpack.TabView
    children: [view1, view2, view3]
    showIndex: 2
  $('#testNode').append tabView.$el
  assertSelectedView tabView, 2

  tabView.removeChild view3
  equal tabView.children.length, 2, 'number of children should be 2'
  assertSelectedView tabView, 1
  return

test 'remove selected first view', 11, ->
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
  tabView = @tabView = new Backpack.TabView
    children: [view1, view2, view3]
    showIndex: 0
  $('#testNode').append tabView.$el
  assertSelectedView tabView, 0

  tabView.removeChild view1
  equal tabView.children.length, 2, 'number of children should be 2'
  assertSelectedView tabView, 0
  return

test 'remove single remaining view and then add new views', 20, ->
  view1 = new Backpack.View
    initialize:(options)->
      @$el.html '<div>View1</div>'
      return
  tabView = @tabView = new Backpack.TabView
    children: [view1]
  $('#testNode').append tabView.$el
  assertSelectedView tabView, 0
  tabView.removeChild view1
  equal tabView.children.length, 0, 'number of children should be 0'
  equal tabView._currentView, null, 'current view should be null'

  view2 = new Backpack.View
    initialize:(options)->
      @$el.html '<div>View2</div>'
      return
  tabView.addChild view2
  equal tabView.children.length, 1, 'number of children should be 1'
  assertSelectedView tabView, 0

  view3 = new Backpack.View
    initialize:(options)->
      @$el.html '<div>View3</div>'
      return
  tabView.addChild view3
  equal tabView.children.length, 2, 'number of children should be 2'
  assertSelectedView tabView, 0

  assertTabButtonClick tabView, 1
  assertTabButtonClick tabView, 0
  return

asyncTest 'attach navigation event', 8, ->
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
  tabView = @tabView = new Backpack.TabView
    children: [view1, view2]
    showIndex: 0,
    navigationEvents:
      view1:
        event: 'showNext'
        target: 'view2'
      view2:
        event: 'showPrevious'
        target: 'view1'
  $('#testNode').append tabView.$el
  view1.showNext()
  view2.$el.promise().done ->
    assertSelectedView tabView, 1
    view2.showPrevious()
    view1.$el.promise().done ->
      assertSelectedView tabView, 0
      start()
      return
    return
  return

asyncTest 'attach navigation event in array', 24, ->
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
  tabView = @tabView = new Backpack.TabView
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
  $('#testNode').append tabView.$el
  assertSelectedView tabView, 0
  view1.showView2()
  view2.$el.promise().done ->
    assertSelectedView tabView, 1
    view2.showView1()
    view1.$el.promise().done ->
      assertSelectedView tabView, 0
      view1.showView3()
      view3.$el.promise().done ->
        assertSelectedView tabView, 2
        start()
        return
      return
    return
  return