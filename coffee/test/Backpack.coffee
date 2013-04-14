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
  equal obj.counter, 5, 'counter should not be incremented.'
  obj.event()
  obj.event()
  obj.event()
  equal obj.counter, 5, 'counter should not be incremented.'
  return

test 'attach with arguments', ->
  obj =
    counter: 0
    event:(arg1, arg2)->
  Backpack.attach obj, 'event', (arg1, arg2)->
    equal arg1, 'x', 'first argument should be passed in callback function'
    equal arg2, 2, 'second argument should be passed in callback function'
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
  testPlugin =
    setup:->
      @name = 'hello'
      return
    cleanup:->
      @name = 'bye'
      return
  TestModel = Backpack.Model.extend
    plugins: [testPlugin]
  model = new TestModel()
  equal model.name, 'hello', 'setup called'
  model.destroy()
  equal model.name, 'bye', 'cleanup called'

test 'extend with multiple plugins', ->
  testPlugin1 =
    setup:->
      @name1 = 'hello'
      return
    cleanup:->
      @name1 = 'bye'
      return
  testPlugin2 =
    setup:->
      @name2 = 'konichiwa'
      return
    cleanup:->
      @name2 = 'sayonara'
      return
  TestModel = Backpack.Model.extend
    plugins: [testPlugin1, testPlugin2]
  model = new TestModel()
  equal model.name1, 'hello', 'setup called for first plugin'
  equal model.name2, 'konichiwa', 'setup called for second plugin'
  model.destroy()
  equal model.name1, 'bye', 'cleanup called for first plugin'
  equal model.name2, 'sayonara', 'cleanup called for second plugin'

test 'initialize with plugins', ->
  testPlugin =
    setup:->
      @name = 'hello'
      return
    cleanup:->
      @name = 'bye'
      return
  model = new Backpack.Model null,
    plugins: [testPlugin]
  equal model.name, 'hello', 'setup called'
  model.destroy()
  equal model.name, 'bye', 'cleanup called'

test 'initialize with multiple plugins', ->
  testPlugin1 =
    setup:->
      @name1 = 'hello'
      return
    cleanup:->
      @name1 = 'bye'
      return
  testPlugin2 =
    setup:->
      @name2 = 'konichiwa'
      return
    cleanup:->
      @name2 = 'sayonara'
      return
  model = new Backpack.Model null,
    plugins: [testPlugin1, testPlugin2]
  equal model.name1, 'hello', 'setup called for first plugin'
  equal model.name2, 'konichiwa', 'setup called for second plugin'
  model.destroy()
  equal model.name1, 'bye', 'cleanup called for first plugin'
  equal model.name2, 'sayonara', 'cleanup called for second plugin'

test 'override extend plugins with initialize plugins', ->
  testPlugin1 =
    setup:->
      @name1 = 'hello'
      return
    cleanup:->
      @name1 = 'bye'
      return
  testPlugin2 =
    setup:->
      @name2 = 'konichiwa'
      return
    cleanup:->
      @name2 = 'sayonara'
      return
  TestModel = Backpack.Model.extend
    plugins: [testPlugin1]
  model = new TestModel null,
    plugins: [testPlugin2]
  notEqual model.name1, 'hello', 'setup not called for extend plugin'
  equal model.name2, 'konichiwa', 'setup called for initialize plugin'
  model.destroy()
  notEqual model.name1, 'bye', 'cleanup not called for extend plugin'
  equal model.name2, 'sayonara', 'cleanup called for initialize plugin'