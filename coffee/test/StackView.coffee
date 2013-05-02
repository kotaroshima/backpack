module 'Backpack.StackView',
  teardown:->
    @stackView.destroy() if @stackView
    return

test 'initialize by passing children', ->
  view1 = new Backpack.View
    initialize:(options)->
      @$el.html '<div>View1</div>'
      return
  view2 = new Backpack.View
    initialize:(options)->
      @$el.html '<div>View2</div>'
      return
  @stackView = new Backpack.StackView
    children: [view1, view2]
    selectedIndex: 0
  $('#testNode').append @stackView.$el
  equal view1.$el.is(':hidden'), false
  equal view2.$el.is(':hidden'), true
  return

test 'no selectedIndex', ->
  view1 = new Backpack.View
    initialize:(options)->
      @$el.html '<div>View1</div>'
      return
  view2 = new Backpack.View
    initialize:(options)->
      @$el.html '<div>View2</div>'
      return
  @stackView = new Backpack.StackView
    children: [view1, view2]
  $('#testNode').append @stackView.$el
  equal view1.$el.is(':hidden'), false
  equal view2.$el.is(':hidden'), true
  return

test 'display view specified by selectedIndex', ->
  view1 = new Backpack.View
    initialize:(options)->
      @$el.html '<div>View1</div>'
      return
  view2 = new Backpack.View
    initialize:(options)->
      @$el.html '<div>View2</div>'
      return
  @stackView = new Backpack.StackView
    children: [view1, view2]
    selectedIndex: 1
  $('#testNode').append @stackView.$el
  equal view1.$el.is(':hidden'), true
  equal view2.$el.is(':hidden'), false
  return

test 'select views', ->
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
  @stackView = new Backpack.StackView
    children: [view1, view2]
    selectedIndex: 0,
    stackEvents:
      view1:
        event: 'showNext'
        target: 'view2'
      view2:
        event: 'showPrevious'
        target: 'view1'
  $('#testNode').append @stackView.$el
  view1.showNext()
  equal view1.$el.is(':hidden'), true
  equal view2.$el.is(':hidden'), false
  view2.showPrevious()
  equal view1.$el.is(':hidden'), false
  equal view2.$el.is(':hidden'), true
  return