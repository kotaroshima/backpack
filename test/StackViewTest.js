// Generated by CoffeeScript 1.6.2
(function() {
  var assert_visible_view;

  assert_visible_view = function(views, visibleIndex) {
    _.each(views, function(view, index) {
      equal(view.$el.is(':hidden'), visibleIndex !== index);
    });
  };

  module('Backpack.StackView', {
    teardown: function() {
      if (this.stackView) {
        this.stackView.destroy();
      }
    }
  });

  test('initialize by passing children', function() {
    var view1, view2;

    view1 = new Backpack.View({
      initialize: function(options) {
        this.$el.html('<div style="background-color:blue">View1</div>');
      }
    });
    view2 = new Backpack.View({
      initialize: function(options) {
        this.$el.html('<div style="background-color:red">View2</div>');
      }
    });
    this.stackView = new Backpack.StackView({
      children: [view1, view2],
      selectedIndex: 0
    });
    $('#testNode').append(this.stackView.$el);
    assert_visible_view([view1, view2], 0);
  });

  test('no selectedIndex', function() {
    var view1, view2;

    view1 = new Backpack.View({
      initialize: function(options) {
        this.$el.html('<div style="background-color:blue">View1</div>');
      }
    });
    view2 = new Backpack.View({
      initialize: function(options) {
        this.$el.html('<div style="background-color:red">View2</div>');
      }
    });
    this.stackView = new Backpack.StackView({
      children: [view1, view2]
    });
    $('#testNode').append(this.stackView.$el);
    assert_visible_view([view1, view2], 0);
  });

  test('display view specified by selectedIndex', function() {
    var view1, view2;

    view1 = new Backpack.View({
      initialize: function(options) {
        this.$el.html('<div style="background-color:blue">View1</div>');
      }
    });
    view2 = new Backpack.View({
      initialize: function(options) {
        this.$el.html('<div style="background-color:red">View2</div>');
      }
    });
    this.stackView = new Backpack.StackView({
      children: [view1, view2],
      selectedIndex: 1
    });
    $('#testNode').append(this.stackView.$el);
    assert_visible_view([view1, view2], 1);
  });

  test('attach navigation event', function() {
    var view1, view2;

    view1 = new Backpack.View({
      name: 'view1',
      initialize: function(options) {
        this.$el.html('<div style="background-color:blue">View1</div>');
      },
      showNext: function() {}
    });
    view2 = new Backpack.View({
      name: 'view2',
      initialize: function(options) {
        this.$el.html('<div style="background-color:red">View2</div>');
      },
      showPrevious: function() {}
    });
    this.stackView = new Backpack.StackView({
      children: [view1, view2],
      selectedIndex: 0,
      navigationEvents: {
        view1: {
          event: 'showNext',
          target: 'view2'
        },
        view2: {
          event: 'showPrevious',
          target: 'view1'
        }
      }
    });
    $('#testNode').append(this.stackView.$el);
    view1.showNext();
    assert_visible_view([view1, view2], 1);
    view2.showPrevious();
    assert_visible_view([view1, view2], 0);
  });

  test('attach navigation event in array', function() {
    var view1, view2, view3;

    view1 = new Backpack.View({
      name: 'view1',
      initialize: function(options) {
        this.$el.html('<div style="background-color:blue">View1</div>');
      },
      showView2: function() {},
      showView3: function() {}
    });
    view2 = new Backpack.View({
      name: 'view2',
      initialize: function(options) {
        this.$el.html('<div style="background-color:yellow">View2</div>');
      },
      showView1: function() {}
    });
    view3 = new Backpack.View({
      name: 'view3',
      initialize: function(options) {
        this.$el.html('<div style="background-color:red">View3</div>');
      },
      showView1: function() {}
    });
    this.stackView = new Backpack.StackView({
      children: [view1, view2, view3],
      selectedIndex: 0,
      navigationEvents: {
        view1: [
          {
            event: 'showView2',
            target: 'view2'
          }, {
            event: 'showView3',
            target: 'view3'
          }
        ],
        view2: {
          event: 'showView1',
          target: 'view1'
        },
        view3: {
          event: 'showView1',
          target: 'view1'
        }
      }
    });
    $('#testNode').append(this.stackView.$el);
    assert_visible_view([view1, view2, view3], 0);
    view1.showView2();
    assert_visible_view([view1, view2, view3], 1);
    view2.showView1();
    assert_visible_view([view1, view2, view3], 0);
    view1.showView3();
    assert_visible_view([view1, view2, view3], 2);
  });

}).call(this);
