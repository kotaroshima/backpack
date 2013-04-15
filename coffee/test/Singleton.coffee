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
  console.log 'Backpack._singletons2='+Backpack._singletons
  return

test 'get the same instance', ->
  TestSingleton = Backpack.Class.extend
    plugins: [Backpack.Singleton]
    count: 0
    initialize:->
      Backpack.Class::initialize.apply @, arguments
      @count++
      return
  instance1 = TestSingleton.getInstance()
  equal instance1.count, 1
  instance2 = TestSingleton.getInstance()
  equal instance1.count, 1
  equal instance2.count, 1
  return