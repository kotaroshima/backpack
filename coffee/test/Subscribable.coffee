module 'Backpack.Subscribable'

test 'Model subscribes with inheritance', ->
  TestModel = Backpack.Model.extend
    subscribers:
      TEST_EVENT: 'onTestEvent'
    onTestEvent:(arg1, arg2)->
      @prop1 = arg1
      @prop2 = arg2
      return
  model = new TestModel()
  Backbone.trigger 'TEST_EVENT', 'x', 2
  equal model.prop1, 'x', 'callback function called and 1st argument passed'
  equal model.prop2, 2, 'callback function called and 2nd argument passed'
  return

test 'Model subscribes with initialization parameter', ->
  model = new Backpack.Model null,
    subscribers:
      TEST_EVENT: 'onTestEvent'
    onTestEvent:(arg1, arg2)->
      @prop1 = arg1
      @prop2 = arg2
      return
  Backbone.trigger 'TEST_EVENT', 'x', 2
  equal model.prop1, 'x', 'callback function called and 1st argument passed'
  equal model.prop2, 2, 'callback function called and 2nd argument passed'
  return

test 'Collection subscribes with inheritance', ->
  TestCollection = Backpack.Collection.extend
    subscribers:
      TEST_EVENT: 'onTestEvent'
    onTestEvent:(arg1, arg2)->
      @prop1 = arg1
      @prop2 = arg2
      return
  collection = new TestCollection()
  Backbone.trigger 'TEST_EVENT', 'x', 2
  equal collection.prop1, 'x', 'callback function called and 1st argument passed'
  equal collection.prop2, 2, 'callback function called and 2nd argument passed'
  return

test 'Collection subscribes with initialization parameter', ->
  collection = new Backpack.Collection null,
    subscribers:
      TEST_EVENT: 'onTestEvent'
    onTestEvent:(arg1, arg2)->
      @prop1 = arg1
      @prop2 = arg2
      return
  Backbone.trigger 'TEST_EVENT', 'x', 2
  equal collection.prop1, 'x', 'callback function called and 1st argument passed'
  equal collection.prop2, 2, 'callback function called and 2nd argument passed'
  return

test 'View subscribes with inheritance', ->
  TestView = Backpack.View.extend
    subscribers:
      TEST_EVENT: 'onTestEvent'
    onTestEvent:(arg1, arg2)->
      @prop1 = arg1
      @prop2 = arg2
      return
  view = new TestView()
  Backbone.trigger 'TEST_EVENT', 'x', 2
  equal view.prop1, 'x', 'callback function called and 1st argument passed'
  equal view.prop2, 2, 'callback function called and 2nd argument passed'
  return

test 'View subscribes with initialization parameter', ->
  view = new Backpack.View
    subscribers:
      TEST_EVENT: 'onTestEvent'
    onTestEvent:(arg1, arg2)->
      @prop1 = arg1
      @prop2 = arg2
      return
  Backbone.trigger 'TEST_EVENT', 'x', 2
  equal view.prop1, 'x', 'callback function called and 1st argument passed'
  equal view.prop2, 2, 'callback function called and 2nd argument passed'
  return

test 'Class subscribes with inheritance', ->
  TestClass = Backpack.Class.extend
    subscribers:
      TEST_EVENT: 'onTestEvent'
    onTestEvent:(arg1, arg2)->
      @prop1 = arg1
      @prop2 = arg2
      return
  instance = new TestClass()
  Backbone.trigger 'TEST_EVENT', 'x', 2
  equal instance.prop1, 'x', 'callback function called and 1st argument passed'
  equal instance.prop2, 2, 'callback function called and 2nd argument passed'
  return

test 'Class subscribes with initialization parameter', ->
  instance = new Backpack.Class
    subscribers:
      TEST_EVENT: 'onTestEvent'
    onTestEvent:(arg1, arg2)->
      @prop1 = arg1
      @prop2 = arg2
      return
  Backbone.trigger 'TEST_EVENT', 'x', 2
  equal instance.prop1, 'x', 'callback function called and 1st argument passed'
  equal instance.prop2, 2, 'callback function called and 2nd argument passed'
  return