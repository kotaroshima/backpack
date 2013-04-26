Backpack.testDefs = [
  {
    class: Backpack.Model
    name: 'Backpack.Model'
    createInstance: (options)->
      new Backpack.Model null, options
  },
  {
    class: Backpack.Collection
    name: 'Backpack.Collection'
    createInstance: (options)->
      new Backpack.Collection null, options
  },
  {
    class: Backpack.View
    name: 'Backpack.View'
    createInstance: (options)->
      new Backpack.View options
  },
  {
    class: Backpack.Class
    name: 'Backpack.Class'
    createInstance: (options)->
      new Backpack.Class options
  }
]

Backpack.isHidden = (node)->
  node.width() == 0 && node.height() == 0