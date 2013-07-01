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

_.each Backpack.testDefs, (def)->

  module def.name

  test 'extend with plugins', 4, ->
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
    TestClass = def.class.extend
      plugins: [testPlugin1, testPlugin2]
    instance = new TestClass()
    equal instance.prop1, 'hello', 'setup called for first plugin'
    equal instance.prop2, 'konichiwa', 'setup called for second plugin'
    instance.destroy()
    equal instance.prop1, 'bye', 'cleanup called for first plugin'
    equal instance.prop2, 'sayonara', 'cleanup called for second plugin'
    return

  test 'initialize with plugins', 4, ->
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
    instance = def.createInstance plugins: [testPlugin1, testPlugin2]
    equal instance.prop1, 'hello', 'setup called for first plugin'
    equal instance.prop2, 'konichiwa', 'setup called for second plugin'
    instance.destroy()
    equal instance.prop1, 'bye', 'cleanup called for first plugin'
    equal instance.prop2, 'sayonara', 'cleanup called for second plugin'
    return

  test 'override extend plugins with initialize plugins', 4, ->
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
    TestClass = def.class.extend
      plugins: [testPlugin1]
    instance = def.createInstance plugins: [testPlugin2]
    notEqual instance.prop1, 'hello', 'setup not called for extend plugin'
    equal instance.prop2, 'konichiwa', 'setup called for initialize plugin'
    instance.destroy()
    notEqual instance.prop1, 'bye', 'cleanup not called for extend plugin'
    equal instance.prop2, 'sayonara', 'cleanup called for initialize plugin'
    return

  test 'later plugins should override previous plugins', 1, ->
    testPlugin1 =
      hello:->
        @prop = 'plugin1'
    testPlugin2 =
      hello:->
        @prop = 'plugin2'
    TestClass = def.class.extend
      plugins: [testPlugin1, testPlugin2]
    instance = new TestClass()
    instance.hello()
    equal instance.prop, 'plugin2', 'override method called for later plugin'
    return

  return