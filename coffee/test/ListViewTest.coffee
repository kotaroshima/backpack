Backbone.sync = ->

module 'Backpack.ListView',
  setup:->
    @ItemView = Backpack.View.extend
      template: _.template '<div class="itemNode" style="border:1px solid red"><%- name %></div>'
      initialize:(options)->
        @listenTo(@model, 'change', @render);
        return
      render: ->
        @$el.html @template @model.attributes
        @
    return
  teardown:->
    @listView.destroy() if @listView
    return

test 'initialize with models', 7, ->
  data = ['Orange', 'Apple', 'Grape']
  models = _.map data, (item)->
    { name: item }
  collection = new Backbone.Collection models
  @listView = new Backpack.ListView
    collection: collection
    itemView: @ItemView
  $('#testNode').append @listView.$el
  itemNodes = $('#testNode .itemNode')
  equal itemNodes.size(), data.length
  itemNodes.each (index, node)->
    equal $(@).is(':visible'), true
    equal $(@).text(), data[index]
    return
  return

test 'add models after initialize', 7, ->
  data = ['Orange', 'Apple', 'Grape']
  collection = new Backbone.Collection
  @listView = new Backpack.ListView
    collection: collection
    itemView: @ItemView
  $('#testNode').append @listView.$el
  _.each data, (item)->
    model = new Backpack.Model { name:item }
    collection.add model
    model.save()
    return
  itemNodes = $('#testNode .itemNode')
  equal itemNodes.size(), data.length
  itemNodes.each (index, node)->
    equal $(@).is(':visible'), true
    equal $(@).text(), data[index]
    return
  return

test 'remove model', 5, ->
  data = ['Orange', 'Apple', 'Grape']
  collection = new Backbone.Collection
  @listView = new Backpack.ListView
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
  data.splice 1, 1
  models[1].destroy()
  itemNodes = $('#testNode .itemNode')
  equal itemNodes.size(), data.length
  itemNodes.each (index, node)->
    equal $(@).is(':visible'), true
    equal $(@).text(), data[index]
    return
  return

test 'modify model', 7, ->
  data = ['Orange', 'Apple', 'Grape']
  collection = new Backbone.Collection
  @listView = new Backpack.ListView
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
  itemNodes = $('#testNode .itemNode')
  equal itemNodes.size(), data.length
  itemNodes.each (index, node)->
    equal $(@).is(':visible'), true
    equal $(@).text(), data[index]
    return
  return