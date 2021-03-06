(function() {
  Backbone.sync = function() {};

  module('Backpack.ContainerPlugin', {
    setup: function() {
      this.ItemView = Backpack.View.extend({
        template: _.template('<div class="childViewNode" style="border:1px solid red"><%- name %></div>'),
        initialize: function(options) {
          this.$el.html(this.template(options));
        }
      });
    },
    teardown: function() {
      if (this.containerView) {
        this.containerView.destroy();
      }
    }
  });

  test('initialize with child views', 7, function() {
    var data, itemNodes, views,
      _this = this;
    data = ['Orange', 'Apple', 'Grape'];
    views = _.map(data, function(item) {
      return new _this.ItemView({
        name: item
      });
    });
    this.containerView = new Backpack.View({
      plugins: [Backpack.ContainerPlugin],
      children: views
    });
    $('#testNode').append(this.containerView.$el);
    itemNodes = $('#testNode .childViewNode');
    equal(itemNodes.size(), data.length);
    itemNodes.each(function(index, node) {
      equal($(this).is(':visible'), true);
      equal($(this).text(), data[index]);
    });
  });

  test('add child views after initialize', 7, function() {
    var data, itemNodes,
      _this = this;
    data = ['Orange', 'Apple', 'Grape'];
    this.containerView = new Backpack.View({
      plugins: [Backpack.ContainerPlugin]
    });
    $('#testNode').append(this.containerView.$el);
    _.each(data, function(item) {
      var view;
      view = new _this.ItemView({
        name: item
      });
      _this.containerView.addChild(view);
    });
    itemNodes = $('#testNode .childViewNode');
    equal(itemNodes.size(), data.length);
    itemNodes.each(function(index, node) {
      equal($(this).is(':visible'), true);
      equal($(this).text(), data[index]);
    });
  });

  test('get child view at specified index', 4, function() {
    var data, itemNodes, views,
      _this = this;
    data = ['Orange', 'Apple', 'Grape'];
    views = _.map(data, function(item) {
      return new _this.ItemView({
        name: item
      });
    });
    this.containerView = new Backpack.View({
      plugins: [Backpack.ContainerPlugin],
      children: views
    });
    $('#testNode').append(this.containerView.$el);
    itemNodes = $('#testNode .childViewNode');
    equal(itemNodes.size(), data.length);
    _.each(views, function(view, index) {
      strictEqual(view, _this.containerView.getChild(index));
    });
  });

  test('remove child view', 1, function() {
    var data, itemNodes, views,
      _this = this;
    data = ['Orange', 'Apple', 'Grape'];
    views = _.map(data, function(item) {
      return new _this.ItemView({
        name: item
      });
    });
    this.containerView = new Backpack.View({
      plugins: [Backpack.ContainerPlugin],
      children: views
    });
    $('#testNode').append(this.containerView.$el);
    this.containerView.removeChild(views[1]);
    itemNodes = $('#testNode .childViewNode');
    equal(itemNodes.size(), 2);
  });

  test('remove child view at specified index', 1, function() {
    var data, itemNodes, views,
      _this = this;
    data = ['Orange', 'Apple', 'Grape'];
    views = _.map(data, function(item) {
      return new _this.ItemView({
        name: item
      });
    });
    this.containerView = new Backpack.View({
      plugins: [Backpack.ContainerPlugin],
      children: views
    });
    $('#testNode').append(this.containerView.$el);
    this.containerView.removeChild(1);
    itemNodes = $('#testNode .childViewNode');
    equal(itemNodes.size(), 2);
  });

  test('clear child views', 1, function() {
    var data, itemNodes, views,
      _this = this;
    data = ['Orange', 'Apple', 'Grape'];
    views = _.map(data, function(item) {
      return new _this.ItemView({
        name: item
      });
    });
    this.containerView = new Backpack.View({
      plugins: [Backpack.ContainerPlugin],
      children: views
    });
    $('#testNode').append(this.containerView.$el);
    this.containerView.clearChildren();
    itemNodes = $('#testNode .childViewNode');
    equal(itemNodes.size(), 0);
  });

}).call(this);
