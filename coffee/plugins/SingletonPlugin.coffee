Backpack.Singleton =
  setup:->
    singleton = _.find Backpack._singletons, (s)=>
      s.constructor is @constructor
    if singleton
      throw new Error 'Only single instance can be initialized'
    else
      if !Backpack._singletons
        Backpack._singletons = []
      Backpack._singletons.push @
    return
  staticProps:
    getInstance:->
      singleton = _.find Backpack._singletons, (s)=>
        s.constructor is @
      if !singleton
        singleton = new @()
      singleton