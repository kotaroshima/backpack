(function() {
  var ItemView;

  Backbone.sync = function() {};

  ItemView = Backpack.View.extend({
    template: _.template('<div class="item-content" style="border:1px solid red"><%- name %></div>'),
    initialize: function(options) {
      this.listenTo(this.model, 'change', this.render);
    },
    render: function() {
      this.$el.html(this.template(this.model.attributes));
      return this;
    }
  });

  module('Backpack.EditableListView', {
    teardown: function() {
      if (this.listView) {
        this.listView.destroy();
      }
    }
  });

  test('initialize with default editable (false)', 13, function() {
    var collection, data, itemNodes, models;
    data = ['Orange', 'Apple', 'Grape'];
    models = _.map(data, function(item) {
      return {
        name: item
      };
    });
    collection = new Backbone.Collection(models);
    this.listView = new Backpack.EditableListView({
      collection: collection,
      itemView: ItemView
    });
    $('#testNode').append(this.listView.$el);
    itemNodes = $('#testNode').find('.action-view');
    equal(itemNodes.size(), data.length);
    itemNodes.each(function(index, node) {
      var itemNode;
      itemNode = $(this);
      ok(itemNode.is(':visible'));
      equal(itemNode.find('.item-content').text(), data[index]);
      ok(itemNode.find('.delete-icon').is(':hidden'));
      ok(itemNode.find('.reorder-handle').is(':hidden'));
    });
  });

  test('initialize with editable=true', 13, function() {
    var collection, data, itemNodes, models;
    data = ['Orange', 'Apple', 'Grape'];
    models = _.map(data, function(item) {
      return {
        name: item
      };
    });
    collection = new Backbone.Collection(models);
    this.listView = new Backpack.EditableListView({
      collection: collection,
      itemView: ItemView,
      editable: true
    });
    $('#testNode').append(this.listView.$el);
    itemNodes = $('#testNode').find('.action-view');
    equal(itemNodes.size(), data.length);
    itemNodes.each(function(index, node) {
      var itemNode;
      itemNode = $(this);
      ok(itemNode.is(':visible'));
      equal(itemNode.find('.item-content').text(), data[index]);
      ok(itemNode.find('.delete-icon').is(':visible'));
      ok(itemNode.find('.reorder-handle').is(':visible'));
    });
  });

  test('add models after initialize', 13, function() {
    var collection, data, itemNodes;
    data = ['Orange', 'Apple', 'Grape'];
    collection = new Backbone.Collection;
    this.listView = new Backpack.EditableListView({
      collection: collection,
      itemView: ItemView
    });
    $('#testNode').append(this.listView.$el);
    _.each(data, function(item) {
      var model;
      model = new Backpack.Model({
        name: item
      });
      collection.add(model);
      model.save();
    });
    itemNodes = $('#testNode').find('.action-view');
    equal(itemNodes.size(), data.length);
    itemNodes.each(function(index, node) {
      var itemNode;
      itemNode = $(this);
      ok(itemNode.is(':visible'));
      equal(itemNode.find('.item-content').text(), data[index]);
      ok(itemNode.find('.delete-icon').is(':hidden'));
      ok(itemNode.find('.reorder-handle').is(':hidden'));
    });
  });

  test('insert model to a specific index', 9, function() {
    var collection, data, index, itemNodes, model, models, name;
    data = ['Orange', 'Apple', 'Grape'];
    models = _.map(data, function(item) {
      return {
        name: item
      };
    });
    collection = new Backbone.Collection(models);
    this.listView = new Backpack.EditableListView({
      collection: collection,
      itemView: ItemView
    });
    $('#testNode').append(this.listView.$el);
    name = 'Peach';
    model = new Backpack.Model({
      name: name
    });
    index = 1;
    collection.add(model, {
      at: index
    });
    data.splice(index, 0, name);
    itemNodes = $('#testNode').find('.item-content');
    equal(itemNodes.size(), data.length);
    itemNodes.each(function(index, node) {
      var itemNode;
      itemNode = $(this);
      ok(itemNode.is(':visible'));
      equal(itemNode.text(), data[index]);
    });
  });

  test('insert model at top', 9, function() {
    var collection, data, index, itemNodes, model, models, name;
    data = ['Orange', 'Apple', 'Grape'];
    models = _.map(data, function(item) {
      return {
        name: item
      };
    });
    collection = new Backbone.Collection(models);
    this.listView = new Backpack.EditableListView({
      collection: collection,
      itemView: ItemView
    });
    $('#testNode').append(this.listView.$el);
    name = 'Peach';
    model = new Backpack.Model({
      name: name
    });
    index = 0;
    collection.add(model, {
      at: index
    });
    data.splice(index, 0, name);
    itemNodes = $('#testNode').find('.item-content');
    equal(itemNodes.size(), data.length);
    itemNodes.each(function(index, node) {
      var itemNode;
      itemNode = $(this);
      ok(itemNode.is(':visible'));
      equal(itemNode.text(), data[index]);
    });
  });

  test('insert model at last', 9, function() {
    var collection, data, index, itemNodes, model, models, name;
    data = ['Orange', 'Apple', 'Grape'];
    models = _.map(data, function(item) {
      return {
        name: item
      };
    });
    collection = new Backbone.Collection(models);
    this.listView = new Backpack.EditableListView({
      collection: collection,
      itemView: ItemView
    });
    $('#testNode').append(this.listView.$el);
    name = 'Peach';
    model = new Backpack.Model({
      name: name
    });
    index = 3;
    collection.add(model, {
      at: index
    });
    data.splice(index, 0, name);
    itemNodes = $('#testNode').find('.item-content');
    equal(itemNodes.size(), data.length);
    itemNodes.each(function(index, node) {
      var itemNode;
      itemNode = $(this);
      ok(itemNode.is(':visible'));
      equal(itemNode.text(), data[index]);
    });
  });

  asyncTest('remove model', 5, function() {
    var collection, data, handle, listView, models;
    data = ['Orange', 'Apple', 'Grape'];
    collection = new Backbone.Collection;
    listView = this.listView = new Backpack.EditableListView({
      collection: collection,
      itemView: ItemView
    });
    $('#testNode').append(this.listView.$el);
    models = _.map(data, function(item) {
      var model;
      model = new Backpack.Model({
        name: item
      });
      model.save();
      return model;
    });
    _.each(models, function(model) {
      collection.add(model);
    });
    data.splice(1, 1);
    handle = listView.attach('onChildRemoved', function(view) {
      var itemNodes;
      itemNodes = $('#testNode').find('.item-content');
      equal(itemNodes.size(), data.length);
      itemNodes.each(function(index, node) {
        var itemNode;
        itemNode = $(this);
        ok(itemNode.is(':visible'));
        equal(itemNode.text(), data[index]);
      });
      handle.detach();
      start();
    });
    models[1].destroy();
  });

  test('modify model', 13, function() {
    var collection, data, itemNodes, models;
    data = ['Orange', 'Apple', 'Grape'];
    collection = new Backbone.Collection;
    this.listView = new Backpack.EditableListView({
      collection: collection,
      itemView: ItemView
    });
    $('#testNode').append(this.listView.$el);
    models = _.map(data, function(item) {
      var model;
      model = new Backpack.Model({
        name: item
      });
      model.save();
      return model;
    });
    _.each(models, function(model) {
      collection.add(model);
    });
    data[1] = 'Peach';
    models[1].set('name', data[1]);
    itemNodes = $('#testNode').find('.action-view');
    equal(itemNodes.size(), data.length);
    itemNodes.each(function(index, node) {
      var itemNode;
      itemNode = $(this);
      ok(itemNode.is(':visible'));
      equal(itemNode.find('.item-content').text(), data[index]);
      ok(itemNode.find('.delete-icon').is(':hidden'));
      ok(itemNode.find('.reorder-handle').is(':hidden'));
    });
  });

  test('setEditable=true', 13, function() {
    var collection, data, itemNodes, listView, models;
    data = ['Orange', 'Apple', 'Grape'];
    models = _.map(data, function(item) {
      return {
        name: item
      };
    });
    collection = new Backbone.Collection(models);
    listView = this.listView = new Backpack.EditableListView({
      collection: collection,
      itemView: ItemView
    });
    $('#testNode').append(listView.$el);
    listView.setEditable(true);
    itemNodes = $('#testNode').find('.action-view');
    equal(itemNodes.size(), data.length);
    itemNodes.each(function(index, node) {
      var itemNode;
      itemNode = $(this);
      ok(itemNode.is(':visible'));
      equal(itemNode.find('.item-content').text(), data[index]);
      ok(itemNode.find('.delete-icon').is(':visible'));
      ok(itemNode.find('.reorder-handle').is(':visible'));
    });
  });

  test('setEditable=false', 13, function() {
    var collection, data, itemNodes, listView, models;
    data = ['Orange', 'Apple', 'Grape'];
    models = _.map(data, function(item) {
      return {
        name: item
      };
    });
    collection = new Backbone.Collection(models);
    listView = this.listView = new Backpack.EditableListView({
      collection: collection,
      itemView: ItemView,
      editable: true
    });
    $('#testNode').append(listView.$el);
    listView.setEditable(false);
    itemNodes = $('#testNode').find('.action-view');
    equal(itemNodes.size(), data.length);
    itemNodes.each(function(index, node) {
      var itemNode;
      itemNode = $(this);
      ok(itemNode.is(':visible'));
      equal(itemNode.find('.item-content').text(), data[index]);
      ok(itemNode.find('.delete-icon').is(':hidden'));
      ok(itemNode.find('.reorder-handle').is(':hidden'));
    });
  });

  test('click remove confirm icon', 4, function() {
    var collection, data, deleteIcon, itemNodes, listView, models, reorderHandle, targetNode;
    data = ['Orange', 'Apple', 'Grape'];
    models = _.map(data, function(item) {
      return {
        name: item
      };
    });
    collection = new Backbone.Collection(models);
    listView = this.listView = new Backpack.EditableListView({
      collection: collection,
      itemView: ItemView
    });
    $('#testNode').append(listView.$el);
    listView.setEditable(true);
    itemNodes = $('#testNode').find('.action-view');
    targetNode = itemNodes.slice(1, 2);
    deleteIcon = targetNode.find('.delete-icon');
    reorderHandle = targetNode.find('.reorder-handle');
    deleteIcon.click();
    deleteIcon.promise().done(function() {
      ok(targetNode.find('.delete-button').is(':visible'));
      ok(reorderHandle.is(':hidden'));
    });
    deleteIcon.click();
    deleteIcon.promise().done(function() {
      ok(targetNode.find('.delete-button').is(':hidden'));
      ok(reorderHandle.is(':visible'));
    });
  });

  asyncTest('click remove confirm icon and actually delete', 10, function() {
    var collection, data, deleteButton, deleteIcon, handle, itemNodes, listView, models, targetNode;
    data = ['Orange', 'Apple', 'Grape'];
    models = _.map(data, function(item) {
      return {
        name: item
      };
    });
    collection = new Backbone.Collection(models);
    listView = this.listView = new Backpack.EditableListView({
      collection: collection,
      itemView: ItemView
    });
    $('#testNode').append(listView.$el);
    listView.setEditable(true);
    itemNodes = $('#testNode').find('.action-view');
    targetNode = itemNodes.slice(1, 2);
    deleteIcon = targetNode.find('.delete-icon');
    deleteIcon.click();
    deleteIcon.promise().done(function() {
      ok(targetNode.find('.delete-button').is(':visible'));
    });
    deleteButton = targetNode.find('.delete-button');
    handle = listView.attach('onChildRemoved', function(view) {
      var data_after;
      itemNodes = $('#testNode').find('.action-view');
      data_after = ['Orange', 'Grape'];
      equal(itemNodes.size(), data_after.length);
      itemNodes.each(function(index, node) {
        var itemNode;
        itemNode = $(this);
        ok(itemNode.is(':visible'));
        equal(itemNode.find('.item-content').text(), data_after[index]);
        ok(itemNode.find('.delete-icon').is(':visible'));
        ok(itemNode.find('.reorder-handle').is(':visible'));
      });
      handle.detach();
      start();
    });
    deleteButton.click();
  });

}).call(this);
