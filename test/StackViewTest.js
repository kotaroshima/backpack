(function() {
  var assertVisibleView;

  assertVisibleView = function(stackView, visibleIndex) {
    _.each(stackView.children, function(view, index) {
      var contentAssertMsg;
      contentAssertMsg = visibleIndex === index ? 'content view should be visible' : 'content view should be hidden';
      equal(view.$el.is(':hidden'), visibleIndex !== index, contentAssertMsg + ' (' + index + ')');
    });
  };

  module('Backpack.StackView', {
    teardown: function() {
      if (this.stackView) {
        this.stackView.destroy();
      }
    }
  });

  test('initialize by passing children', 2, function() {
    var stackView, view1, view2;
    view1 = new Backpack.View({
      initialize: function(options) {
        this.$el.html('<div>View1</div>');
      }
    });
    view2 = new Backpack.View({
      initialize: function(options) {
        this.$el.html('<div>View2</div>');
      }
    });
    stackView = this.stackView = new Backpack.StackView({
      children: [view1, view2],
      showIndex: 0
    });
    $('#testNode').append(stackView.$el);
    assertVisibleView(stackView, 0);
  });

  test('no showIndex', 2, function() {
    var stackView, view1, view2;
    view1 = new Backpack.View({
      initialize: function(options) {
        this.$el.html('<div>View1</div>');
      }
    });
    view2 = new Backpack.View({
      initialize: function(options) {
        this.$el.html('<div>View2</div>');
      }
    });
    stackView = this.stackView = new Backpack.StackView({
      children: [view1, view2]
    });
    $('#testNode').append(stackView.$el);
    assertVisibleView(stackView, 0);
  });

  test('display view specified by showIndex', 2, function() {
    var stackView, view1, view2;
    view1 = new Backpack.View({
      initialize: function(options) {
        this.$el.html('<div>View1</div>');
      }
    });
    view2 = new Backpack.View({
      initialize: function(options) {
        this.$el.html('<div>View2</div>');
      }
    });
    stackView = this.stackView = new Backpack.StackView({
      children: [view1, view2],
      showIndex: 1
    });
    $('#testNode').append(stackView.$el);
    assertVisibleView(stackView, 1);
  });

  test('remove view', 6, function() {
    var stackView, view1, view2, view3;
    view1 = new Backpack.View({
      initialize: function(options) {
        this.$el.html('<div>View1</div>');
      }
    });
    view2 = new Backpack.View({
      initialize: function(options) {
        this.$el.html('<div>View2</div>');
      }
    });
    view3 = new Backpack.View({
      initialize: function(options) {
        this.$el.html('<div>View3</div>');
      }
    });
    stackView = this.stackViewView = new Backpack.StackView({
      children: [view1, view2, view3]
    });
    $('#testNode').append(stackView.$el);
    assertVisibleView(stackView, 0);
    stackView.removeChild(view2);
    equal(stackView.children.length, 2, 'number of children should be 2');
    assertVisibleView(stackView, 0);
  });

  test('remove visible last view', 6, function() {
    var stackView, view1, view2, view3;
    view1 = new Backpack.View({
      initialize: function(options) {
        this.$el.html('<div>View1</div>');
      }
    });
    view2 = new Backpack.View({
      initialize: function(options) {
        this.$el.html('<div>View2</div>');
      }
    });
    view3 = new Backpack.View({
      initialize: function(options) {
        this.$el.html('<div>View3</div>');
      }
    });
    stackView = this.stackView = new Backpack.StackView({
      children: [view1, view2, view3],
      showIndex: 2
    });
    $('#testNode').append(stackView.$el);
    assertVisibleView(stackView, 2);
    stackView.removeChild(view3);
    equal(stackView.children.length, 2, 'number of children should be 2');
    assertVisibleView(stackView, 1);
  });

  test('remove visible first view', 6, function() {
    var stackView, view1, view2, view3;
    view1 = new Backpack.View({
      initialize: function(options) {
        this.$el.html('<div>View1</div>');
      }
    });
    view2 = new Backpack.View({
      initialize: function(options) {
        this.$el.html('<div>View2</div>');
      }
    });
    view3 = new Backpack.View({
      initialize: function(options) {
        this.$el.html('<div>View3</div>');
      }
    });
    stackView = this.stackView = new Backpack.StackView({
      children: [view1, view2, view3],
      showIndex: 0
    });
    $('#testNode').append(stackView.$el);
    assertVisibleView(stackView, 0);
    stackView.removeChild(view1);
    equal(stackView.children.length, 2, 'number of children should be 2');
    assertVisibleView(stackView, 0);
  });

  test('remove single remaining view and then add new views', 8, function() {
    var stackView, view1, view2, view3;
    view1 = new Backpack.View({
      initialize: function(options) {
        this.$el.html('<div>View1</div>');
      }
    });
    stackView = this.stackView = new Backpack.StackView({
      children: [view1]
    });
    $('#testNode').append(stackView.$el);
    assertVisibleView(stackView, 0);
    stackView.removeChild(view1);
    equal(stackView.children.length, 0, 'number of children should be 0');
    equal(stackView._currentView, null, 'current view should be null');
    view2 = new Backpack.View({
      initialize: function(options) {
        this.$el.html('<div>View2</div>');
      }
    });
    stackView.addChild(view2);
    equal(stackView.children.length, 1, 'number of children should be 1');
    assertVisibleView(stackView, 0);
    view3 = new Backpack.View({
      initialize: function(options) {
        this.$el.html('<div>View3</div>');
      }
    });
    stackView.addChild(view3);
    equal(stackView.children.length, 2, 'number of children should be 2');
    assertVisibleView(stackView, 0);
  });

  asyncTest('attach navigation event', 4, function() {
    var stackView, view1, view2;
    view1 = new Backpack.View({
      name: 'view1',
      initialize: function(options) {
        this.$el.html('<div>View1</div>');
      },
      showNext: function() {}
    });
    view2 = new Backpack.View({
      name: 'view2',
      initialize: function(options) {
        this.$el.html('<div>View2</div>');
      },
      showPrevious: function() {}
    });
    stackView = this.stackView = new Backpack.StackView({
      children: [view1, view2],
      showIndex: 0,
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
    $('#testNode').append(stackView.$el);
    view1.showNext();
    view2.$el.promise().done(function() {
      assertVisibleView(stackView, 1);
      view2.showPrevious();
      view1.$el.promise().done(function() {
        assertVisibleView(stackView, 0);
        start();
      });
    });
  });

  asyncTest('attach navigation event in array', 12, function() {
    var stackView, view1, view2, view3;
    view1 = new Backpack.View({
      name: 'view1',
      initialize: function(options) {
        this.$el.html('<div>View1</div>');
      },
      showView2: function() {},
      showView3: function() {}
    });
    view2 = new Backpack.View({
      name: 'view2',
      initialize: function(options) {
        this.$el.html('<div>View2</div>');
      },
      showView1: function() {}
    });
    view3 = new Backpack.View({
      name: 'view3',
      initialize: function(options) {
        this.$el.html('<div>View3</div>');
      },
      showView1: function() {}
    });
    stackView = this.stackView = new Backpack.StackView({
      children: [view1, view2, view3],
      showIndex: 0,
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
    $('#testNode').append(stackView.$el);
    assertVisibleView(stackView, 0);
    view1.showView2();
    view2.$el.promise().done(function() {
      assertVisibleView(stackView, 1);
      view2.showView1();
      view1.$el.promise().done(function() {
        assertVisibleView(stackView, 0);
        view1.showView3();
        view3.$el.promise().done(function() {
          assertVisibleView(stackView, 2);
          start();
        });
      });
    });
  });

  asyncTest('attach navigation event with back', 18, function() {
    var stackView, view1, view2, view3;
    view1 = new Backpack.View({
      name: 'view1',
      initialize: function(options) {
        this.$el.html('<div>View1</div>');
      },
      showView2: function() {},
      showView3: function() {}
    });
    view2 = new Backpack.View({
      name: 'view2',
      initialize: function(options) {
        this.$el.html('<div>View2</div>');
      },
      showView3: function() {}
    });
    view3 = new Backpack.View({
      name: 'view3',
      initialize: function(options) {
        this.$el.html('<div>View3</div>');
      },
      showPrevious: function() {}
    });
    stackView = this.stackView = new Backpack.StackView({
      children: [view1, view2, view3],
      showIndex: 0,
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
          event: 'showView3',
          target: 'view3'
        },
        view3: {
          event: 'showPrevious',
          back: true
        }
      }
    });
    $('#testNode').append(stackView.$el);
    assertVisibleView(stackView, 0);
    view1.showView3();
    view3.$el.promise().done(function() {
      assertVisibleView(stackView, 2);
      view3.showPrevious();
      view1.$el.promise().done(function() {
        assertVisibleView(stackView, 0);
        view1.showView2();
        view2.$el.promise().done(function() {
          assertVisibleView(stackView, 1);
          view2.showView3();
          view3.$el.promise().done(function() {
            assertVisibleView(stackView, 2);
            view3.showPrevious();
            view2.$el.promise().done(function() {
              assertVisibleView(stackView, 1);
              start();
            });
          });
        });
      });
    });
  });

}).call(this);
