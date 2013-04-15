# Override so that it doesn't try to save to server
Backbone.sync = ->

module 'Backpack.attach'

test 'attach and detach', ->
  obj =
    counter: 0
    event:->
  handler = Backpack.attach obj, 'event', ->
    obj.counter++
    return
  obj.event()
  equal obj.counter, 1, 'counter should be incremented.'
  obj.event()
  obj.event()
  obj.event()
  obj.event()
  equal obj.counter, 5, 'counter should be incremented five times.'
  handler.detach()
  obj.event()
  equal obj.counter, 5, 'counter should not be incremented after detach.'
  obj.event()
  obj.event()
  obj.event()
  equal obj.counter, 5, 'counter should not be incremented after detach.'
  return

test 'attach with arguments', ->
  obj =
    counter: 0
    event:(arg1, arg2)->
  Backpack.attach obj, 'event', (arg1, arg2)->
    equal arg1, 'x', 'first argument should be passed in the callback function'
    equal arg2, 2, 'second argument should be passed in the callback function'
    return
  obj.event('x', 2)
  return

test 'attach multiple events', ->
  obj =
    counter1: 0
    counter2: 0
    event:->
  handler1 = Backpack.attach obj, 'event', ->
    obj.counter1++
    return
  handler2 = Backpack.attach obj, 'event', ->
    obj.counter2++
    return
  obj.event()
  equal obj.counter1, 1, 'counter1 should be incremented.'
  equal obj.counter2, 1, 'counter2 should be incremented.'
  obj.event()
  obj.event()
  obj.event()
  obj.event()
  equal obj.counter1, 5, 'counter1 should be incremented five times.'
  equal obj.counter2, 5, 'counter2 should be incremented five times.'
  handler2.detach()
  obj.event()
  equal obj.counter1, 6, 'counter1 should be incremented six times.'
  equal obj.counter2, 5, 'counter2 should be incremented five times.'
  handler1.detach()
  obj.event()
  equal obj.counter1, 6, 'counter1 should be incremented six times.'
  equal obj.counter2, 5, 'counter2 should be incremented five times.'
  return

module 'Backpack.Model'

test 'extend with plugins', ->
  testPlugin1 =
    setup:->
      @prop1 = 'hello'
      return
    cleanup:->
      @prop1 = 'bye'
      return
  testPlugin2 =
    setup:->
      @prop2 = 'konichiwa'
      return
    cleanup:->
      @prop2 = 'sayonara'
      return
  TestModel = Backpack.Model.extend
    plugins: [testPlugin1, testPlugin2]
  model = new TestModel()
  equal model.prop1, 'hello', 'setup called for first plugin'
  equal model.prop2, 'konichiwa', 'setup called for second plugin'
  model.destroy()
  equal model.prop1, 'bye', 'cleanup called for first plugin'
  equal model.prop2, 'sayonara', 'cleanup called for second plugin'
  return

test 'initialize with plugins', ->
  testPlugin1 =
    setup:->
      @prop1 = 'hello'
      return
    cleanup:->
      @prop1 = 'bye'
      return
  testPlugin2 =
    setup:->
      @prop2 = 'konichiwa'
      return
    cleanup:->
      @prop2 = 'sayonara'
      return
  model = new Backpack.Model null,
    plugins: [testPlugin1, testPlugin2]
  equal model.prop1, 'hello', 'setup called for first plugin'
  equal model.prop2, 'konichiwa', 'setup called for second plugin'
  model.destroy()
  equal model.prop1, 'bye', 'cleanup called for first plugin'
  equal model.prop2, 'sayonara', 'cleanup called for second plugin'
  return

test 'override extend plugins with initialize plugins', ->
  testPlugin1 =
    setup:->
      @prop1 = 'hello'
      return
    cleanup:->
      @prop1 = 'bye'
      return
  testPlugin2 =
    setup:->
      @prop2 = 'konichiwa'
      return
    cleanup:->
      @prop2 = 'sayonara'
      return
  TestModel = Backpack.Model.extend
    plugins: [testPlugin1]
  model = new TestModel null,
    plugins: [testPlugin2]
  notEqual model.prop1, 'hello', 'setup not called for extend plugin'
  equal model.prop2, 'konichiwa', 'setup called for initialize plugin'
  model.destroy()
  notEqual model.prop1, 'bye', 'cleanup not called for extend plugin'
  equal model.prop2, 'sayonara', 'cleanup called for initialize plugin'
  return

module 'Backpack.Collection'

test 'extend with plugins', ->
  testPlugin1 =
    setup:->
      @prop1 = 'hello'
      return
    cleanup:->
      @prop1 = 'bye'
      return
  testPlugin2 =
    setup:->
      @prop2 = 'konichiwa'
      return
    cleanup:->
      @prop2 = 'sayonara'
      return
  TestCollection = Backpack.Collection.extend
    plugins: [testPlugin1, testPlugin2]
  collection = new TestCollection()
  equal collection.prop1, 'hello', 'setup called for first plugin'
  equal collection.prop2, 'konichiwa', 'setup called for second plugin'
  collection.destroy()
  equal collection.prop1, 'bye', 'cleanup called for first plugin'
  equal collection.prop2, 'sayonara', 'cleanup called for second plugin'
  return

test 'initialize with plugins', ->
  testPlugin1 =
    setup:->
      @prop1 = 'hello'
      return
    cleanup:->
      @prop1 = 'bye'
      return
  testPlugin2 =
    setup:->
      @prop2 = 'konichiwa'
      return
    cleanup:->
      @prop2 = 'sayonara'
      return
  collection = new Backpack.Collection null,
    plugins: [testPlugin1, testPlugin2]
  equal collection.prop1, 'hello', 'setup called for first plugin'
  equal collection.prop2, 'konichiwa', 'setup called for second plugin'
  collection.destroy()
  equal collection.prop1, 'bye', 'cleanup called for first plugin'
  equal collection.prop2, 'sayonara', 'cleanup called for second plugin'
  return

test 'override extend plugins with initialize plugins', ->
  testPlugin1 =
    setup:->
      @prop1 = 'hello'
      return
    cleanup:->
      @prop1 = 'bye'
      return
  testPlugin2 =
    setup:->
      @prop2 = 'konichiwa'
      return
    cleanup:->
      @prop2 = 'sayonara'
      return
  TestCollection = Backpack.Collection.extend
    plugins: [testPlugin1]
  collection = new TestCollection null,
    plugins: [testPlugin2]
  notEqual collection.prop1, 'hello', 'setup not called for extend plugin'
  equal collection.prop2, 'konichiwa', 'setup called for initialize plugin'
  collection.destroy()
  notEqual collection.prop1, 'bye', 'cleanup not called for extend plugin'
  equal collection.prop2, 'sayonara', 'cleanup called for initialize plugin'
  return

module 'Backpack.View'

test 'extend with plugins', ->
  testPlugin1 =
    setup:->
      @prop1 = 'hello'
      return
    cleanup:->
      @prop1 = 'bye'
      return
  testPlugin2 =
    setup:->
      @prop2 = 'konichiwa'
      return
    cleanup:->
      @prop2 = 'sayonara'
      return
  TestView = Backpack.View.extend
    plugins: [testPlugin1, testPlugin2]
  view = new TestView()
  equal view.prop1, 'hello', 'setup called for first plugin'
  equal view.prop2, 'konichiwa', 'setup called for second plugin'
  view.destroy()
  equal view.prop1, 'bye', 'cleanup called for first plugin'
  equal view.prop2, 'sayonara', 'cleanup called for second plugin'
  return

test 'initialize with plugins', ->
  testPlugin1 =
    setup:->
      @prop1 = 'hello'
      return
    cleanup:->
      @prop1 = 'bye'
      return
  testPlugin2 =
    setup:->
      @prop2 = 'konichiwa'
      return
    cleanup:->
      @prop2 = 'sayonara'
      return
  view = new Backpack.View
    plugins: [testPlugin1, testPlugin2]
  equal view.prop1, 'hello', 'setup called for first plugin'
  equal view.prop2, 'konichiwa', 'setup called for second plugin'
  view.destroy()
  equal view.prop1, 'bye', 'cleanup called for first plugin'
  equal view.prop2, 'sayonara', 'cleanup called for second plugin'
  return

test 'override extend plugins with initialize plugins', ->
  testPlugin1 =
    setup:->
      @prop1 = 'hello'
      return
    cleanup:->
      @prop1 = 'bye'
      return
  testPlugin2 =
    setup:->
      @prop2 = 'konichiwa'
      return
    cleanup:->
      @prop2 = 'sayonara'
      return
  TestView = Backpack.View.extend
    plugins: [testPlugin1]
  view = new TestView
    plugins: [testPlugin2]
  notEqual view.prop1, 'hello', 'setup not called for extend plugin'
  equal view.prop2, 'konichiwa', 'setup called for initialize plugin'
  view.destroy()
  notEqual view.prop1, 'bye', 'cleanup not called for extend plugin'
  equal view.prop2, 'sayonara', 'cleanup called for initialize plugin'
  return

module 'Backpack.Class'

test 'initialize', ->
  TestClass = Backpack.Class.extend
    initialize:->
      @one = 1
      return
  instance = new TestClass()
  equal instance.one, 1
  return

test 'extend with plugins', ->
  testPlugin1 =
    setup:->
      @prop1 = 'hello'
      return
    cleanup:->
      @prop1 = 'bye'
      return
  testPlugin2 =
    setup:->
      @prop2 = 'konichiwa'
      return
    cleanup:->
      @prop2 = 'sayonara'
      return
  TestClass = Backpack.Class.extend
    plugins: [testPlugin1, testPlugin2]
  instance = new TestClass()
  equal instance.prop1, 'hello', 'setup called for first plugin'
  equal instance.prop2, 'konichiwa', 'setup called for second plugin'
  instance.destroy()
  equal instance.prop1, 'bye', 'cleanup called for first plugin'
  equal instance.prop2, 'sayonara', 'cleanup called for second plugin'
  return

test 'initialize with plugins', ->
  testPlugin1 =
    setup:->
      @prop1 = 'hello'
      return
    cleanup:->
      @prop1 = 'bye'
      return
  testPlugin2 =
    setup:->
      @prop2 = 'konichiwa'
      return
    cleanup:->
      @prop2 = 'sayonara'
      return
  instance = new Backpack.Class
    plugins: [testPlugin1, testPlugin2]
  equal instance.prop1, 'hello', 'setup called for first plugin'
  equal instance.prop2, 'konichiwa', 'setup called for second plugin'
  instance.destroy()
  equal instance.prop1, 'bye', 'cleanup called for first plugin'
  equal instance.prop2, 'sayonara', 'cleanup called for second plugin'
  return

test 'override extend plugins with initialize plugins', ->
  testPlugin1 =
    setup:->
      @prop1 = 'hello'
      return
    cleanup:->
      @prop1 = 'bye'
      return
  testPlugin2 =
    setup:->
      @prop2 = 'konichiwa'
      return
    cleanup:->
      @prop2 = 'sayonara'
      return
  TestClass = Backpack.Class.extend
    plugins: [testPlugin1]
  instance = new TestClass
    plugins: [testPlugin2]
  notEqual instance.prop1, 'hello', 'setup not called for extend plugin'
  equal instance.prop2, 'konichiwa', 'setup called for initialize plugin'
  instance.destroy()
  notEqual instance.prop1, 'bye', 'cleanup not called for extend plugin'
  equal instance.prop2, 'sayonara', 'cleanup called for initialize plugin'
  return