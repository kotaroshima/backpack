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

  module('Backpack.ListView', {
    teardown: function() {
      if (this.listView) {
        this.listView.destroy();
      }
    }
  });

  test('initialize with models', 7, function() {
    var collection, data, itemNodes, models;
    data = ['Orange', 'Apple', 'Grape'];
    models = _.map(data, function(item) {
      return {
        name: item
      };
    });
    collection = new Backbone.Collection(models);
    this.listView = new Backpack.ListView({
      collection: collection,
      itemView: ItemView
    });
    $('#testNode').append(this.listView.$el);
    itemNodes = $('#testNode').find('.item-content');
    equal(itemNodes.size(), data.length);
    itemNodes.each(function(index, node) {
      var itemNode;
      itemNode = $(this);
      ok(itemNode.is(':visible'));
      equal(itemNode.text(), data[index]);
    });
  });

  test('add models after initialize', 7, function() {
    var collection, data, itemNodes;
    data = ['Orange', 'Apple', 'Grape'];
    collection = new Backbone.Collection;
    this.listView = new Backpack.ListView({
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
    itemNodes = $('#testNode').find('.item-content');
    equal(itemNodes.size(), data.length);
    itemNodes.each(function(index, node) {
      var itemNode;
      itemNode = $(this);
      ok(itemNode.is(':visible'));
      equal(itemNode.text(), data[index]);
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
    this.listView = new Backpack.ListView({
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
    this.listView = new Backpack.ListView({
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
    this.listView = new Backpack.ListView({
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
    listView = this.listView = new Backpack.ListView({
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

  test('modify model', 7, function() {
    var collection, data, itemNodes, models;
    data = ['Orange', 'Apple', 'Grape'];
    collection = new Backbone.Collection;
    this.listView = new Backpack.ListView({
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
    itemNodes = $('#testNode').find('.item-content');
    equal(itemNodes.size(), data.length);
    itemNodes.each(function(index, node) {
      var itemNode;
      itemNode = $(this);
      ok(itemNode.is(':visible'));
      equal(itemNode.text(), data[index]);
    });
  });

}).call(this);
