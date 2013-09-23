# Override so that it doesn't try to save to server
Backbone.sync = ->

module 'Backpack.attach'

test 'attach and detach', 4, ->
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

test 'attach with context and callback name', 1, ->
  source =
    trigger:->
  target =
    counter: 0
    event:->
      @counter++
  Backpack.attach source, 'trigger', target, 'event'
  source.trigger()
  equal target.counter, 1, 'counter should be incremented.'
  return

test 'attach multiple events', 8, ->
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

TestPlugin1 =
  setup:->
    @prop1 = 'hello'
    return
  hello:->
    @prop = 'plugin1'
    return
  cleanup:->
    @prop1 = 'bye'
    return
TestPlugin2 =
  setup:->
    @prop2 = 'konichiwa'
    return
  hello:->
    @prop = 'plugin2'
    return
  cleanup:->
    @prop2 = 'sayonara'
    return

_.each Backpack.testDefs, (def)->

  module def.name

  test 'extend with plugins', 5, ->
    TestClass = def.class.extend plugins: [TestPlugin1, TestPlugin2]
    instance = new TestClass()
    equal instance.prop1, 'hello', 'setup called for first plugin'
    equal instance.prop2, 'konichiwa', 'setup called for second plugin'
    instance.hello()
    equal instance.prop, 'plugin2', 'later plugins should override previous plugins'
    instance.destroy()
    equal instance.prop1, 'bye', 'cleanup called for first plugin'
    equal instance.prop2, 'sayonara', 'cleanup called for second plugin'
    return

  test 'initialize with plugins', 5, ->
    instance = def.createInstance plugins: [TestPlugin1, TestPlugin2]
    equal instance.prop1, 'hello', 'setup called for first plugin'
    equal instance.prop2, 'konichiwa', 'setup called for second plugin'
    instance.hello()
    equal instance.prop, 'plugin2', 'later plugins should override previous plugins'
    instance.destroy()
    equal instance.prop1, 'bye', 'cleanup called for first plugin'
    equal instance.prop2, 'sayonara', 'cleanup called for second plugin'
    return

  test 'extend subclass with plugins', 5, ->
    TestSubClass = def.class.extend plugins: [TestPlugin1]
    TestSubSubClass = TestSubClass.extend plugins: [TestPlugin2]
    instance = new TestSubSubClass()
    equal instance.prop1, 'hello', 'setup called for first plugin'
    equal instance.prop2, 'konichiwa', 'setup called for second plugin'
    instance.hello()
    equal instance.prop, 'plugin2', 'later plugins should override previous plugins'
    instance.destroy()
    equal instance.prop1, 'bye', 'cleanup called for first plugin'
    equal instance.prop2, 'sayonara', 'cleanup called for second plugin'
    return

  test 'both extend plugins and initialize plugins', 5, ->
    TestClass = def.class.extend plugins: [TestPlugin1]
    instance = def.createInstance { plugins: [TestPlugin2] }, TestClass
    equal instance.prop1, 'hello', 'setup called for extend plugin'
    equal instance.prop2, 'konichiwa', 'setup called for initialize plugin'
    instance.hello()
    equal instance.prop, 'plugin2', 'later plugins should override previous plugins'
    instance.destroy()
    equal instance.prop1, 'bye', 'cleanup called for extend plugin'
    equal instance.prop2, 'sayonara', 'cleanup called for initialize plugin'
    return

  test 'superclass plugins enabled when subclassed without plugins', 2, ->
    TestSubClass = def.class.extend plugins: [TestPlugin1]
    TestSubSubClass = TestSubClass.extend()
    instance = new TestSubSubClass()
    equal instance.prop1, 'hello', 'setup called for plugin'
    instance.destroy()
    equal instance.prop1, 'bye', 'cleanup called for plugin'
    return

  test 'allPlugins should override superclass plugins', 5, ->
    TestSubClass = def.class.extend allPlugins: [TestPlugin1]
    TestSubSubClass = TestSubClass.extend allPlugins: [TestPlugin2]
    instance = new TestSubSubClass()
    notEqual instance.prop1, 'hello', 'setup not called for first plugin'
    equal instance.prop2, 'konichiwa', 'setup called for second plugin'
    instance.hello()
    equal instance.prop, 'plugin2', 'later plugins should override previous plugins'
    instance.destroy()
    notEqual instance.prop1, 'bye', 'cleanup not called for first plugin'
    equal instance.prop2, 'sayonara', 'cleanup called for second plugin'
    return

  test 'both extend allPlugins and initialize allPlugins', 5, ->
    TestClass = def.class.extend allPlugins: [TestPlugin1]
    instance = def.createInstance { allPlugins: [TestPlugin2] }, TestClass
    notEqual instance.prop1, 'hello', 'setup not called for extend plugin'
    equal instance.prop2, 'konichiwa', 'setup called for initialize plugin'
    instance.hello()
    equal instance.prop, 'plugin2', 'later plugins should override previous plugins'
    instance.destroy()
    notEqual instance.prop1, 'bye', 'cleanup not called for extend plugin'
    equal instance.prop2, 'sayonara', 'cleanup called for initialize plugin'
    return

  test 'superclass allPlugins enabled when subclassed without plugins', 2, ->
    TestSubClass = def.class.extend allPlugins: [TestPlugin1]
    TestSubSubClass = TestSubClass.extend()
    instance = new TestSubSubClass()
    equal instance.prop1, 'hello', 'setup called for plugin'
    instance.destroy()
    equal instance.prop1, 'bye', 'cleanup called for plugin'
    return

  return