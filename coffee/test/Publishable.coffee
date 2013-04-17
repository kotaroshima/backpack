module 'Backpack.Publishable'

test 'Model publishes with inheritance', ->
  TestModel = Backpack.Model.extend
    publishers:
      onTestEvent: 'TEST_EVENT'
    onTestEvent:(arg1, arg2)->
  model = new TestModel()
  Backbone.on 'TEST_EVENT', (arg1, arg2)->
    equal arg1, 'x', 'callback function called and 1st argument passed'
    equal arg2, 2, 'callback function called and 2nd argument passed'
    return
  model.onTestEvent 'x', 2
  return

test 'Model publishes with initialization parameter', ->
  model = new Backpack.Model null,
    publishers:
      onTestEvent: 'TEST_EVENT'
    onTestEvent:(arg1, arg2)->
  Backbone.on 'TEST_EVENT', (arg1, arg2)->
    equal arg1, 'x', 'callback function called and 1st argument passed'
    equal arg2, 2, 'callback function called and 2nd argument passed'
    return
  model.onTestEvent 'x', 2
  return

test 'Collection publishes with inheritance', ->
  TestCollection = Backpack.Collection.extend
    publishers:
      onTestEvent: 'TEST_EVENT'
    onTestEvent:(arg1, arg2)->
  collection = new TestCollection()
  Backbone.on 'TEST_EVENT', (arg1, arg2)->
    equal arg1, 'x', 'callback function called and 1st argument passed'
    equal arg2, 2, 'callback function called and 2nd argument passed'
    return
  collection.onTestEvent 'x', 2
  return

test 'Collection publishes with initialization parameter', ->
  collection = new Backpack.Collection null,
    publishers:
      onTestEvent: 'TEST_EVENT'
    onTestEvent:(arg1, arg2)->
  Backbone.on 'TEST_EVENT', (arg1, arg2)->
    equal arg1, 'x', 'callback function called and 1st argument passed'
    equal arg2, 2, 'callback function called and 2nd argument passed'
    return
  collection.onTestEvent 'x', 2
  return

test 'View publishes with inheritance', ->
  TestView = Backpack.View.extend
    publishers:
      onTestEvent: 'TEST_EVENT'
    onTestEvent:(arg1, arg2)->
  view = new TestView()
  Backbone.on 'TEST_EVENT', (arg1, arg2)->
    equal arg1, 'x', 'callback function called and 1st argument passed'
    equal arg2, 2, 'callback function called and 2nd argument passed'
    return
  view.onTestEvent 'x', 2
  return

test 'View publishes with initialization parameter', ->
  view = new Backpack.View
    publishers:
      onTestEvent: 'TEST_EVENT'
    onTestEvent:(arg1, arg2)->
  Backbone.on 'TEST_EVENT', (arg1, arg2)->
    equal arg1, 'x', 'callback function called and 1st argument passed'
    equal arg2, 2, 'callback function called and 2nd argument passed'
    return
  view.onTestEvent 'x', 2
  return

test 'Class publishes with inheritance', ->
  TestClass = Backpack.Class.extend
    publishers:
      onTestEvent: 'TEST_EVENT'
    onTestEvent:(arg1, arg2)->
  instance = new TestClass()
  Backbone.on 'TEST_EVENT', (arg1, arg2)->
    equal arg1, 'x', 'callback function called and 1st argument passed'
    equal arg2, 2, 'callback function called and 2nd argument passed'
    return
  instance.onTestEvent 'x', 2
  return

test 'Class publishes with initialization parameter', ->
  instance = new Backpack.Class
    publishers:
      onTestEvent: 'TEST_EVENT'
    onTestEvent:(arg1, arg2)->
  Backbone.on 'TEST_EVENT', (arg1, arg2)->
    equal arg1, 'x', 'callback function called and 1st argument passed'
    equal arg2, 2, 'callback function called and 2nd argument passed'
    return
  instance.onTestEvent 'x', 2
  return