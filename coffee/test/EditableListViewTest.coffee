Backbone.sync = ->

module 'Backpack.EditableListView',
  setup:->
    @ItemView = Backpack.View.extend
      template: _.template '<div class="item-content" style="border:1px solid red"><%- name %></div>'
      initialize:(options)->
        @listenTo @model, 'change', @render
        return
      render: ->
        @$el.html @template @model.attributes
        @
    return
  teardown:->
    @listView.destroy() if @listView
    return

test 'initialize with default editable (false)', 13, ->
  data = ['Orange', 'Apple', 'Grape']
  models = _.map data, (item)-> name: item
  collection = new Backbone.Collection models
  @listView = new Backpack.EditableListView
    collection: collection
    itemView: @ItemView
  $('#testNode').append @listView.$el
  itemNodes = $('#testNode').find '.item-view'
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
    itemView: @ItemView
    editable: true
  $('#testNode').append @listView.$el
  itemNodes = $('#testNode').find '.item-view'
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
    itemView: @ItemView
  $('#testNode').append @listView.$el
  _.each data, (item)->
    model = new Backpack.Model name:item
    collection.add model
    model.save()
    return
  itemNodes = $('#testNode').find '.item-view'
  equal itemNodes.size(), data.length
  itemNodes.each (index, node)->
    itemNode = $ @
    ok itemNode.is ':visible'
    equal itemNode.find('.item-content').text(), data[index]
    ok itemNode.find('.delete-icon').is ':hidden'
    ok itemNode.find('.reorder-handle').is ':hidden'
    return
  return

test 'remove model', 9, ->
  data = ['Orange', 'Apple', 'Grape']
  collection = new Backbone.Collection
  @listView = new Backpack.EditableListView
    collection: collection
    itemView: @ItemView
  $('#testNode').append @listView.$el
  models = _.map data, (item)->
    model = new Backpack.Model name:item
    model.save()
    model
  _.each models, (model)->
    collection.add model
    return
  data.splice 1, 1
  models[1].destroy()
  itemNodes = $('#testNode').find '.item-view'
  equal itemNodes.size(), data.length
  itemNodes.each (index, node)->
    itemNode = $ @
    ok itemNode.is ':visible'
    equal itemNode.find('.item-content').text(), data[index]
    ok itemNode.find('.delete-icon').is ':hidden'
    ok itemNode.find('.reorder-handle').is ':hidden'
    return
  return

test 'modify model', 13, ->
  data = ['Orange', 'Apple', 'Grape']
  collection = new Backbone.Collection
  @listView = new Backpack.EditableListView
    collection: collection
    itemView: @ItemView
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
  itemNodes = $('#testNode').find '.item-view'
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
    itemView: @ItemView
  $('#testNode').append listView.$el
  listView.setEditable true
  itemNodes = $('#testNode').find '.item-view'
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
    itemView: @ItemView
    editable: true
  $('#testNode').append listView.$el
  listView.setEditable false
  itemNodes = $('#testNode').find '.item-view'
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
    itemView: @ItemView
  $('#testNode').append listView.$el
  listView.setEditable true
  itemNodes = $('#testNode').find '.item-view'
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

test 'click remove confirm icon and actually delete', 10, ->
  data = ['Orange', 'Apple', 'Grape']
  models = _.map data, (item)-> name: item
  collection = new Backbone.Collection models
  listView = @listView = new Backpack.EditableListView
    collection: collection
    itemView: @ItemView
  $('#testNode').append listView.$el
  listView.setEditable true
  itemNodes = $('#testNode').find '.item-view'
  targetNode = itemNodes.slice 1, 2
  deleteIcon = targetNode.find '.delete-icon'
  deleteIcon.click()
  deleteIcon.promise().done ->
    ok targetNode.find('.delete-button').is ':visible'
    return
  deleteButton = targetNode.find '.delete-button'
  deleteButton.click()
  deleteButton.promise().done ->
    itemNodes = $('#testNode').find '.item-view'
    data_after = ['Orange', 'Grape']
    equal itemNodes.size(), data_after.length
    itemNodes.each (index, node)->
      itemNode = $ @
      ok itemNode.is ':visible'
      equal itemNode.find('.item-content').text(), data_after[index]
      ok itemNode.find('.delete-icon').is ':visible'
      ok itemNode.find('.reorder-handle').is ':visible'
      return
    return
  return