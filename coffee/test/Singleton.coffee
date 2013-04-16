module 'Backpack.Singleton'

test 'only one instance can be initialized', ->
  TestSingleton = Backpack.Class.extend
    plugins: [Backpack.Singleton]
    initialize:->
      Backpack.Class::initialize.apply @, arguments
      @name = 'testSingleton'
      return
  instance = new TestSingleton()
  equal instance.name, 'testSingleton'
  raises ->
    new TestSingleton()
    return
  , Error, 'throws an error when trying to initialize 2nd instance'
  return

test 'get the same instance', ->
  TestSingleton = Backpack.Class.extend
    plugins: [Backpack.Singleton]
  instance1 = TestSingleton.getInstance()
  instance2 = TestSingleton.getInstance()
  equal instance1, instance2
  return