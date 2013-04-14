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