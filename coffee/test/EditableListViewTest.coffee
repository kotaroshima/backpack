Backbone.sync = ->

ItemView = Backpack.View.extend
  template: _.template '<div class="item-content" style="border:1px solid red"><%- name %></div>'
  initialize:(options)->
    @listenTo @model, 'change', @render
    return
  render: ->
    @$el.html @template @model.attributes
    @

module 'Backpack.EditableListView',
  teardown:->
    @listView.destroy() if @listView
    return

test 'initialize with default editable (false)', 13, ->
  data = ['Orange', 'Apple', 'Grape']
  models = _.map data, (item)-> name: item
  collection = new Backbone.Collection models
  @listView = new Backpack.EditableListView
    collection: collection
    itemView: ItemView
  $('#testNode').append @listView.$el
  itemNodes = $('#testNode').find '.action-view'
  equal itemNodes.size(), data.length
  itemNodes.each (index, node)->
    itemNode = $ @
    ok itemNode.is ':visible'
    equal itemNode.find('.item-content').text(), data[index]
    ok itemNode.find('.delete-icon').is ':hidden'
    ok itemNode.find('.reorder-handle').is ':hidden'
    return
  return

test 'initialize with editable=true', 13, ->
  data = ['Orange', 'Apple', 'Grape']
  models = _.map data, (item)-> name: item
  collection = new Backbone.Collection models
  @listView = new Backpack.EditableListView
    collection: collection
    itemView: ItemView
    editable: true
  $('#testNode').append @listView.$el
  itemNodes = $('#testNode').find '.action-view'
  equal itemNodes.size(), data.length
  itemNodes.each (index, node)->
    itemNode = $ @
    ok itemNode.is ':visible'
    equal itemNode.find('.item-content').text(), data[index]
    ok itemNode.find('.delete-icon').is ':visible'
    ok itemNode.find('.reorder-handle').is ':visible'
    return
  return

test 'add models after initialize', 13, ->
  data = ['Orange', 'Apple', 'Grape']
  collection = new Backbone.Collection
  @listView = new Backpack.EditableListView
    collection: collection
    itemView: ItemView
  $('#testNode').append @listView.$el
  _.each data, (item)->
    model = new Backpack.Model name:item
    collection.add model
    model.save()
    return
  itemNodes = $('#testNode').find '.action-view'
  equal itemNodes.size(), data.length
  itemNodes.each (index, node)->
    itemNode = $ @
    ok itemNode.is ':visible'
    equal itemNode.find('.item-content').text(), data[index]
    ok itemNode.find('.delete-icon').is ':hidden'
    ok itemNode.find('.reorder-handle').is ':hidden'
    return
  return


test 'insert model to a specific index', 9, ->
  data = ['Orange', 'Apple', 'Grape']
  models = _.map data, (item)-> name: item
  collection = new Backbone.Collection models
  @listView = new Backpack.EditableListView
    collection: collection
    itemView: ItemView
  $('#testNode').append @listView.$el

  name = 'Peach'
  model = new Backpack.Model name:name
  index = 1
  collection.add model, at:index
  data.splice index, 0, name

  itemNodes = $('#testNode').find '.item-content'
  equal itemNodes.size(), data.length
  itemNodes.each (index, node)->
    itemNode = $ @
    ok itemNode.is ':visible'
    equal itemNode.text(), data[index]
    return
  return

test 'insert model at top', 9, ->
  data = ['Orange', 'Apple', 'Grape']
  models = _.map data, (item)-> name: item
  collection = new Backbone.Collection models
  @listView = new Backpack.EditableListView
    collection: collection
    itemView: ItemView
  $('#testNode').append @listView.$el

  name = 'Peach'
  model = new Backpack.Model name:name
  index = 0
  collection.add model, at:index
  data.splice index, 0, name

  itemNodes = $('#testNode').find '.item-content'
  equal itemNodes.size(), data.length
  itemNodes.each (index, node)->
    itemNode = $ @
    ok itemNode.is ':visible'
    equal itemNode.text(), data[index]
    return
  return

test 'insert model at last', 9, ->
  data = ['Orange', 'Apple', 'Grape']
  models = _.map data, (item)-> name: item
  collection = new Backbone.Collection models
  @listView = new Backpack.EditableListView
    collection: collection
    itemView: ItemView
  $('#testNode').append @listView.$el

  name = 'Peach'
  model = new Backpack.Model name:name
  index = 3
  collection.add model, at:index
  data.splice index, 0, name

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
  listView = @listView = new Backpack.EditableListView
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

test 'modify model', 13, ->
  data = ['Orange', 'Apple', 'Grape']
  collection = new Backbone.Collection
  @listView = new Backpack.EditableListView
    collection: collection
    itemView: ItemView
  $('#testNode').append @listView.$el
  models = _.map data, (item)->
    model = new Backpack.Model { name:item }
    model.save()
    model
  _.each models, (model)->
    collection.add model
    return
  data[1] = 'Peach'
  models[1].set('name', data[1])
  #models[1].save()
  itemNodes = $('#testNode').find '.action-view'
  equal itemNodes.size(), data.length
  itemNodes.each (index, node)->
    itemNode = $ @
    ok itemNode.is ':visible'
    equal itemNode.find('.item-content').text(), data[index]
    ok itemNode.find('.delete-icon').is ':hidden'
    ok itemNode.find('.reorder-handle').is ':hidden'
    return
  return

test 'setEditable=true', 13, ->
  data = ['Orange', 'Apple', 'Grape']
  models = _.map data, (item)-> name: item
  collection = new Backbone.Collection models
  listView = @listView = new Backpack.EditableListView
    collection: collection
    itemView: ItemView
  $('#testNode').append listView.$el
  listView.setEditable true
  itemNodes = $('#testNode').find '.action-view'
  equal itemNodes.size(), data.length
  itemNodes.each (index, node)->
    itemNode = $ @
    ok itemNode.is ':visible'
    equal itemNode.find('.item-content').text(), data[index]
    ok itemNode.find('.delete-icon').is ':visible'
    ok itemNode.find('.reorder-handle').is ':visible'
    return
  return

test 'setEditable=false', 13, ->
  data = ['Orange', 'Apple', 'Grape']
  models = _.map data, (item)-> name: item
  collection = new Backbone.Collection models
  listView = @listView = new Backpack.EditableListView
    collection: collection
    itemView: ItemView
    editable: true
  $('#testNode').append listView.$el
  listView.setEditable false
  itemNodes = $('#testNode').find '.action-view'
  equal itemNodes.size(), data.length
  itemNodes.each (index, node)->
    itemNode = $ @
    ok itemNode.is ':visible'
    equal itemNode.find('.item-content').text(), data[index]
    ok itemNode.find('.delete-icon').is ':hidden'
    ok itemNode.find('.reorder-handle').is ':hidden'
    return
  return

test 'click remove confirm icon', 4, ->
  data = ['Orange', 'Apple', 'Grape']
  models = _.map data, (item)-> name: item
  collection = new Backbone.Collection models
  listView = @listView = new Backpack.EditableListView
    collection: collection
    itemView: ItemView
  $('#testNode').append listView.$el
  listView.setEditable true
  itemNodes = $('#testNode').find '.action-view'
  targetNode = itemNodes.slice 1, 2
  deleteIcon = targetNode.find '.delete-icon'
  reorderHandle = targetNode.find '.reorder-handle'
  deleteIcon.click()
  deleteIcon.promise().done ->
    ok targetNode.find('.delete-button').is ':visible'
    ok reorderHandle.is ':hidden'
    return
  deleteIcon.click()
  deleteIcon.promise().done ->
    ok targetNode.find('.delete-button').is ':hidden'
    ok reorderHandle.is ':visible'
    return
  return

asyncTest 'click remove confirm icon and actually delete', 10, ->
  data = ['Orange', 'Apple', 'Grape']
  models = _.map data, (item)-> name: item
  collection = new Backbone.Collection models
  listView = @listView = new Backpack.EditableListView
    collection: collection
    itemView: ItemView
  $('#testNode').append listView.$el
  listView.setEditable true
  itemNodes = $('#testNode').find '.action-view'
  targetNode = itemNodes.slice 1, 2
  deleteIcon = targetNode.find '.delete-icon'
  deleteIcon.click()
  deleteIcon.promise().done ->
    ok targetNode.find('.delete-button').is ':visible'
    return
  deleteButton = targetNode.find '.delete-button'
  handle = listView.attach 'onChildRemoved', (view)->
    itemNodes = $('#testNode').find '.action-view'
    data_after = ['Orange', 'Grape']
    equal itemNodes.size(), data_after.length
    itemNodes.each (index, node)->
      itemNode = $ @
      ok itemNode.is ':visible'
      equal itemNode.find('.item-content').text(), data_after[index]
      ok itemNode.find('.delete-icon').is ':visible'
      ok itemNode.find('.reorder-handle').is ':visible'
      return
    handle.detach()
    start()
    return
  deleteButton.click()
  return