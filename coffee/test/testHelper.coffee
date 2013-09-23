Backpack.testDefs = [
  {
    class: Backpack.Model
    name: 'Backpack.Model'
    createInstance: (options, clazz=Backpack.Model)->
      new clazz null, options
  },
  {
    class: Backpack.Collection
    name: 'Backpack.Collection'
    createInstance: (options, clazz=Backpack.Collection)->
      new clazz null, options
  },
  {
    class: Backpack.View
    name: 'Backpack.View'
    createInstance: (options, clazz=Backpack.View)->
      new clazz options
  },
  {
    class: Backpack.Class
    name: 'Backpack.Class'
    createInstance: (options, clazz=Backpack.Class)->
      new clazz options
  }
]