module 'Backpack.SingletonPlugin'

_.each Backpack.testDefs, (def)->

  test _.template('only one instance of <%-name%> can be initialized', def), ->
    TestSingleton = def.class.extend
      plugins: [Backpack.Singleton]
      initialize:->
        def.class::initialize.apply @, arguments
        @name = 'testSingleton'
        return
    instance = new TestSingleton()
    equal instance.name, 'testSingleton'
    raises ->
      new TestSingleton()
      return
    , Error, 'throws an error when trying to initialize 2nd instance'
    return

  test _.template('get the same instance of <%-name%>', def), ->
    TestSingleton = def.class.extend
      plugins: [Backpack.Singleton]
    instance1 = TestSingleton.getInstance()
    instance2 = TestSingleton.getInstance()
    equal instance1, instance2
    return

  return