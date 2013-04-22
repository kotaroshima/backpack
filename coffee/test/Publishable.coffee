module 'Backpack.Publishable'

_.each Backpack.testDefs, (def)->

  test _.template('<%-name%> publishes with inheritance', def), ->
    TestClass = def.class.extend
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

  test _.template('<%-name%> publishes with initialization parameter', def), ->
    instance = def.createInstance
      publishers:
        onTestEvent: 'TEST_EVENT'
      onTestEvent:(arg1, arg2)->
    Backbone.on 'TEST_EVENT', (arg1, arg2)->
      equal arg1, 'x', 'callback function called and 1st argument passed'
      equal arg2, 2, 'callback function called and 2nd argument passed'
      return
    instance.onTestEvent 'x', 2
    return

  return