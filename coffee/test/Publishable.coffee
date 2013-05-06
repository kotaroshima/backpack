module 'Backpack.Publishable',
  setup:->
    @prop1 = null
    @prop2 = null
    Backbone.on 'TEST_EVENT', (arg1, arg2)=>
      @prop1 = arg1
      @prop2 = arg2
      return
    return
  teardown:->
    Backbone.off 'TEST_EVENT'
    @prop1 = null
    @prop2 = null
    return

_.each Backpack.testDefs, (def)->

  test _.template('<%-name%> publishes with inheritance', def), ->
    TestClass = def.class.extend
      publishers:
        onTestEvent: 'TEST_EVENT'
      onTestEvent:(arg1, arg2)->
    instance = new TestClass()
    instance.onTestEvent 'x', 2
    equal @prop1, 'x', 'callback function called and 1st argument passed'
    equal @prop2, 2, 'callback function called and 2nd argument passed'
    return

  test _.template('<%-name%> publishes with initialization parameter', def), ->
    instance = def.createInstance
      publishers:
        onTestEvent: 'TEST_EVENT'
      onTestEvent:(arg1, arg2)->
    instance.onTestEvent 'x', 2
    equal @prop1, 'x', 'callback function called and 1st argument passed'
    equal @prop2, 2, 'callback function called and 2nd argument passed'
    return

  test _.template('<%-name%> add publisher after initialize', def), ->
    instance = def.createInstance
      onTestEvent:(arg1, arg2)->
    instance.addPublisher 'onTestEvent', 'TEST_EVENT'
    instance.onTestEvent 'x', 2
    equal @prop1, 'x', 'callback function called and 1st argument passed'
    equal @prop2, 2, 'callback function called and 2nd argument passed'
    return

  test _.template('<%-name%> remove publisher with method name, topic name', def), ->
    instance = def.createInstance
      publishers:
        onTestEvent: 'TEST_EVENT'
      onTestEvent:(arg1, arg2)->
    ret = instance.removePublisher 'onTestEvent', 'TEST_EVENT'
    @prop1 = 'z'
    @prop2 = 1
    instance.onTestEvent 'y', 3
    equal ret, true, 'publisher removed successfully'
    equal @prop1, 'z', 'callback function not called'
    equal @prop2, 1, 'callback function not called'
    return

  test _.template('<%-name%> remove publisher with attach handler', def), ->
    instance = def.createInstance
      onTestEvent:(arg1, arg2)->
    handler = instance.addPublisher 'onTestEvent', 'TEST_EVENT'
    ret = instance.removePublisher handler
    @prop1 = 'z'
    @prop2 = 1
    instance.onTestEvent 'y', 3
    equal ret, true, 'publisher removed successfully'
    equal @prop1, 'z', 'callback function not called'
    equal @prop2, 1, 'callback function not called'
    return


  test _.template('<%-name%> all publishers removed on destroy', def), ->
    instance = def.createInstance
      publishers:
        onTestEvent: 'TEST_EVENT'
      onTestEvent:(arg1, arg2)->
    @prop1 = 'z'
    @prop2 = 1
    instance.destroy()
    instance.onTestEvent 'y', 3
    equal @prop1, 'z', 'callback function not called'
    equal @prop2, 1, 'callback function not called'
    return

  return