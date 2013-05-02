module 'Backpack.Subscribable'

_.each Backpack.testDefs, (def)->

  test _.template('<%-name%> subscribes with inheritance', def), ->
    TestClass = def.class.extend
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

  test _.template('<%-name%> subscribes with initialization parameter', def), ->
    instance = new def.createInstance
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

  test _.template('<%-name%> subscribes after initialization', def), ->
    instance = new def.createInstance
      onTestEvent:(arg1, arg2)->
        @prop1 = arg1
        @prop2 = arg2
        return
    instance.subscribe 'TEST_EVENT', 'onTestEvent'
    Backbone.trigger 'TEST_EVENT', 'x', 2
    equal instance.prop1, 'x', 'callback function called and 1st argument passed'
    equal instance.prop2, 2, 'callback function called and 2nd argument passed'
    instance.unsubscribe 'TEST_EVENT', 'onTestEvent'
    Backbone.trigger 'TEST_EVENT', 'y', 3
    equal instance.prop1, 'x', 'callback function not called'
    equal instance.prop2, 2, 'callback function not called'
    return

  return