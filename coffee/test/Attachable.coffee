module 'Backpack.Attachable'

test 'attach and detach Model', ->
  TestModel = Backpack.Model.extend
    onTestEvent:(arg1, arg2)->
  model = new TestModel()
  var1 = null
  var2 = null
  handler = model.attach 'onTestEvent', (arg1, arg2)->
    var1 = arg1
    var2 = arg2
    return
  equal model._attached.length, 1
  model.onTestEvent 'x', 2
  equal var1, 'x', 'callback called and 1st argument passed'
  equal var2, 2, 'callback called and 2nd argument passed'
  model.detach handler
  equal model._attached.length, 0
  model.onTestEvent 'y', 5
  equal var1, 'x', "callback wasn't called"
  equal var2, 2, "callback wasn't called"
  return

test 'attach and destroy Model', ->
  TestModel = Backpack.Model.extend
    onTestEvent:(arg1, arg2)->
  model = new TestModel()
  var1 = null
  var2 = null
  handler = model.attach 'onTestEvent', (arg1, arg2)->
    var1 = arg1
    var2 = arg2
    return
  equal model._attached.length, 1
  model.onTestEvent 'x', 2
  equal var1, 'x', 'callback called and 1st argument passed'
  equal var2, 2, 'callback called and 2nd argument passed'
  model.detach handler
  equal model._attached.length, 0
  model.onTestEvent 'y', 5
  equal var1, 'x', "callback wasn't called"
  equal var2, 2, "callback wasn't called"
  return

test 'attach and detach Collection', ->
  TestCollection = Backpack.Collection.extend
    onTestEvent:(arg1, arg2)->
  collection = new TestCollection()
  var1 = null
  var2 = null
  handler = collection.attach 'onTestEvent', (arg1, arg2)->
    var1 = arg1
    var2 = arg2
    return
  equal collection._attached.length, 1
  collection.onTestEvent 'x', 2
  equal var1, 'x', 'callback called and 1st argument passed'
  equal var2, 2, 'callback called and 2nd argument passed'
  collection.detach handler
  equal collection._attached.length, 0
  collection.onTestEvent 'y', 5
  equal var1, 'x', "callback wasn't called"
  equal var2, 2, "callback wasn't called"
  return

test 'attach and destroy Collection', ->
  TestCollection = Backpack.Collection.extend
    onTestEvent:(arg1, arg2)->
  collection = new TestCollection()
  var1 = null
  var2 = null
  handler = collection.attach 'onTestEvent', (arg1, arg2)->
    var1 = arg1
    var2 = arg2
    return
  equal collection._attached.length, 1
  collection.onTestEvent 'x', 2
  equal var1, 'x', 'callback called and 1st argument passed'
  equal var2, 2, 'callback called and 2nd argument passed'
  collection.detach handler
  equal collection._attached.length, 0
  collection.onTestEvent 'y', 5
  equal var1, 'x', "callback wasn't called"
  equal var2, 2, "callback wasn't called"
  return

test 'attach and detach View', ->
  TestView = Backpack.View.extend
    onTestEvent:(arg1, arg2)->
  view = new TestView()
  var1 = null
  var2 = null
  handler = view.attach 'onTestEvent', (arg1, arg2)->
    var1 = arg1
    var2 = arg2
    return
  equal view._attached.length, 1
  view.onTestEvent 'x', 2
  equal var1, 'x', 'callback called and 1st argument passed'
  equal var2, 2, 'callback called and 2nd argument passed'
  view.detach handler
  equal view._attached.length, 0
  view.onTestEvent 'y', 5
  equal var1, 'x', "callback wasn't called"
  equal var2, 2, "callback wasn't called"
  return

test 'attach and destroy View', ->
  TestView = Backpack.View.extend
    onTestEvent:(arg1, arg2)->
  view = new TestView()
  var1 = null
  var2 = null
  handler = view.attach 'onTestEvent', (arg1, arg2)->
    var1 = arg1
    var2 = arg2
    return
  equal view._attached.length, 1
  view.onTestEvent 'x', 2
  equal var1, 'x', 'callback called and 1st argument passed'
  equal var2, 2, 'callback called and 2nd argument passed'
  view.detach handler
  equal view._attached.length, 0
  view.onTestEvent 'y', 5
  equal var1, 'x', "callback wasn't called"
  equal var2, 2, "callback wasn't called"
  return

test 'attach and detach Class', ->
  TestClass = Backpack.Class.extend
    onTestEvent:(arg1, arg2)->
  instance = new TestClass()
  var1 = null
  var2 = null
  handler = instance.attach 'onTestEvent', (arg1, arg2)->
    var1 = arg1
    var2 = arg2
    return
  equal instance._attached.length, 1
  instance.onTestEvent 'x', 2
  equal var1, 'x', 'callback called and 1st argument passed'
  equal var2, 2, 'callback called and 2nd argument passed'
  instance.detach handler
  equal instance._attached.length, 0
  instance.onTestEvent 'y', 5
  equal var1, 'x', "callback wasn't called"
  equal var2, 2, "callback wasn't called"
  return

test 'attach and destroy Class', ->
  TestClass = Backpack.Class.extend
    onTestEvent:(arg1, arg2)->
  instance = new TestClass()
  var1 = null
  var2 = null
  handler = instance.attach 'onTestEvent', (arg1, arg2)->
    var1 = arg1
    var2 = arg2
    return
  equal instance._attached.length, 1
  instance.onTestEvent 'x', 2
  equal var1, 'x', 'callback called and 1st argument passed'
  equal var2, 2, 'callback called and 2nd argument passed'
  instance.detach handler
  equal instance._attached.length, 0
  instance.onTestEvent 'y', 5
  equal var1, 'x', "callback wasn't called"
  equal var2, 2, "callback wasn't called"
  return