Backbone.sync = ->

ItemView = Backpack.View.extend
  template: _.template '<div class="item-content" style="border:1px solid red"><%- name %></div>'
  initialize:(options)->
    @listenTo @model, 'change', @render
    return
  render: ->
    @$el.html @template @model.attributes
    @

module 'Backpack.ListView',
  teardown:->
    @listView.destroy() if @listView
    return

test 'initialize with models', 7, ->
  data = ['Orange', 'Apple', 'Grape']
  models = _.map data, (item)-> name: item
  collection = new Backbone.Collection models
  @listView = new Backpack.ListView
    collection: collection
    itemView: ItemView
  $('#testNode').append @listView.$el
  itemNodes = $('#testNode').find '.item-content'
  equal itemNodes.size(), data.length
  itemNodes.each (index, node)->
    itemNode = $ @
    ok itemNode.is ':visible'
    equal itemNode.text(), data[index]
    return
  return

test 'add models after initialize', 7, ->
  data = ['Orange', 'Apple', 'Grape']
  collection = new Backbone.Collection
  @listView = new Backpack.ListView
    collection: collection
    itemView: ItemView
  $('#testNode').append @listView.$el
  _.each data, (item)->
    model = new Backpack.Model name:item
    collection.add model
    model.save()
    return
  itemNodes = $('#testNode').find '.item-content'
  equal itemNodes.size(), data.length
  itemNodes.each (index, node)->
    itemNode = $ @
    ok itemNode.is ':visible'
    equal itemNode.text(), data[index]
    return
  return

asyncTest 'remove model', 5, ->
  data = ['Orange', 'Apple', 'Grape']
  collection = new Backbone.Collection
  listView = @listView = new Backpack.ListView
    collection: collection
    itemView: ItemView
  $('#testNode').append @listView.$el
  models = _.map data, (item)->
    model = new Backpack.Model name:item
    model.save()
    model
  _.each models, (model)->
    collection.add model
    return
  data.splice 1, 1
  handle = listView.attach 'onChildRemoved', (view)->
    itemNodes = $('#testNode').find '.item-content'
    equal itemNodes.size(), data.length
    itemNodes.each (index, node)->
      itemNode = $ @
      ok itemNode.is ':visible'
      equal itemNode.text(), data[index]
      return
    handle.detach()
    start()
    return
  models[1].destroy()
  return

test 'modify model', 7, ->
  data = ['Orange', 'Apple', 'Grape']
  collection = new Backbone.Collection
  @listView = new Backpack.ListView
    collection: collection
    itemView: ItemView
  $('#testNode').append @listView.$el
  models = _.map data, (item)->
    model = new Backpack.Model name:item
    model.save()
    model
  _.each models, (model)->
    collection.add model
    return
  data[1] = 'Peach'
  models[1].set 'name', data[1]
  #models[1].save()
  itemNodes = $('#testNode').find '.item-content'
  equal itemNodes.size(), data.length
  itemNodes.each (index, node)->
    itemNode = $ @
    ok itemNode.is ':visible'
    equal itemNode.text(), data[index]
    return
  return