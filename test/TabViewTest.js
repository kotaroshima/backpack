// Generated by CoffeeScript 1.6.2
(function() {
  var assertSelectedView, assertTabButtonClick;

  module('Backpack.TabView', {
    teardown: function() {
      if (this.tabView) {
        this.tabView.destroy();
      }
    }
  });

  assertSelectedView = function(tabView, visibleIndex) {
    _.each(tabView.children, function(view, index) {
      var isSelected;

      isSelected = visibleIndex === index;
      equal(view.$el.is(':hidden'), !isSelected);
      equal(tabView._buttonMap[view.cid].$el.hasClass('selected'), isSelected);
    });
  };

  assertTabButtonClick = function(tabView, tabIndex) {
    var handler, tabButton;

    tabButton = tabView._buttonMap[tabView.getChild(tabIndex).cid].$el;
    handler = function() {
      assertSelectedView(tabView, tabIndex);
    };
    tabButton.click(handler);
    tabButton.click();
    tabButton.off('click', handler);
  };

  test('initialize by passing children', 4, function() {
    var tabLabels, tabView, testNode, view1, view2;

    tabLabels = ['view1', 'view2'];
    view1 = new Backpack.View({
      name: tabLabels[0],
      initialize: function(options) {
        this.$el.html('<div>View1</div>');
      }
    });
    view2 = new Backpack.View({
      name: tabLabels[1],
      initialize: function(options) {
        this.$el.html('<div>View2</div>');
      }
    });
    tabView = this.tabView = new Backpack.TabView({
      children: [view1, view2],
      showIndex: 0
    });
    testNode = $('#testNode');
    testNode.append(tabView.$el);
    assertSelectedView(tabView, 0);
    testNode.find('.tab-button').each(function(index, tabButton) {
      equal($(this).text(), tabLabels[index]);
    });
  });

  test('title shown in tab button', 4, function() {
    var tabLabels, tabView, testNode, view1, view2;

    tabLabels = ['View 1', 'View 2'];
    view1 = new Backpack.View({
      name: 'view1',
      title: tabLabels[0],
      initialize: function(options) {
        this.$el.html('<div>View1</div>');
      }
    });
    view2 = new Backpack.View({
      name: 'view2',
      title: tabLabels[1],
      initialize: function(options) {
        this.$el.html('<div>View2</div>');
      }
    });
    tabView = this.tabView = new Backpack.TabView({
      children: [view1, view2],
      showIndex: 0
    });
    testNode = $('#testNode');
    testNode.append(tabView.$el);
    assertSelectedView(tabView, 0);
    testNode.find('.tab-button').each(function(index, tabButton) {
      equal($(this).text(), tabLabels[index]);
    });
  });

  test('no showIndex', 4, function() {
    var tabView, view1, view2;

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
    tabView = this.tabView = new Backpack.TabView({
      children: [view1, view2]
    });
    $('#testNode').append(tabView.$el);
    assertSelectedView(tabView, 0);
  });

  test('display view specified by showIndex', 4, function() {
    var tabView, view1, view2;

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
    tabView = this.tabView = new Backpack.TabView({
      children: [view1, view2],
      showIndex: 1
    });
    $('#testNode').append(tabView.$el);
    assertSelectedView(tabView, 1);
  });

  test('display corresponding view by clicking tab button', 30, function() {
    var tabView, view1, view2, view3;

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
    tabView = this.tabView = new Backpack.TabView({
      children: [view1, view2, view3]
    });
    $('#testNode').append(tabView.$el);
    assertSelectedView(tabView, 0);
    assertTabButtonClick(tabView, 2);
    assertTabButtonClick(tabView, 0);
    assertTabButtonClick(tabView, 1);
    assertTabButtonClick(tabView, 0);
  });

  test('add child and click added tab', 23, function() {
    var tabView, view1, view2, view3;

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
    tabView = this.tabView = new Backpack.TabView({
      children: [view1, view2]
    });
    $('#testNode').append(tabView.$el);
    assertSelectedView(tabView, 0);
    view3 = new Backpack.View({
      initialize: function(options) {
        this.$el.html('<div>View3</div>');
      }
    });
    tabView.addChild(view3);
    equal(tabView.children.length, 3);
    assertSelectedView(tabView, 0);
    assertTabButtonClick(tabView, 2);
    assertTabButtonClick(tabView, 1);
  });

  test('remove view', 11, function() {
    var tabView, view1, view2, view3;

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
    tabView = this.tabView = new Backpack.TabView({
      children: [view1, view2, view3]
    });
    $('#testNode').append(tabView.$el);
    assertSelectedView(tabView, 0);
    tabView.removeChild(view2);
    equal(tabView.children.length, 2);
    assertSelectedView(tabView, 0);
  });

  test('remove selected last view', 11, function() {
    var tabView, view1, view2, view3;

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
    tabView = this.tabView = new Backpack.TabView({
      children: [view1, view2, view3],
      showIndex: 2
    });
    $('#testNode').append(tabView.$el);
    assertSelectedView(tabView, 2);
    tabView.removeChild(view3);
    equal(tabView.children.length, 2);
    assertSelectedView(tabView, 1);
  });

  test('remove single remaining view and then add new views', 21, function() {
    var tabView, view1, view2, view3;

    view1 = new Backpack.View({
      initialize: function(options) {
        this.$el.html('<div>View1</div>');
      }
    });
    tabView = this.tabView = new Backpack.TabView({
      children: [view1]
    });
    $('#testNode').append(tabView.$el);
    assertSelectedView(tabView, 0);
    tabView.removeChild(view1);
    equal(tabView.children.length, 0);
    equal(tabView._previousView, null);
    equal(tabView._currentView, null);
    view2 = new Backpack.View({
      initialize: function(options) {
        this.$el.html('<div>View2</div>');
      }
    });
    tabView.addChild(view2);
    equal(tabView.children.length, 1);
    assertSelectedView(tabView, 0);
    view3 = new Backpack.View({
      initialize: function(options) {
        this.$el.html('<div>View3</div>');
      }
    });
    tabView.addChild(view3);
    equal(tabView.children.length, 2);
    assertSelectedView(tabView, 0);
    assertTabButtonClick(tabView, 1);
    assertTabButtonClick(tabView, 0);
  });

  asyncTest('attach navigation event', 8, function() {
    var tabView, view1, view2;

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
    tabView = this.tabView = new Backpack.TabView({
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
    $('#testNode').append(tabView.$el);
    view1.showNext();
    view2.$el.promise().done(function() {
      assertSelectedView(tabView, 1);
      view2.showPrevious();
      view1.$el.promise().done(function() {
        assertSelectedView(tabView, 0);
        start();
      });
    });
  });

  asyncTest('attach navigation event in array', 24, function() {
    var tabView, view1, view2, view3;

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
    tabView = this.tabView = new Backpack.TabView({
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
    $('#testNode').append(tabView.$el);
    assertSelectedView(tabView, 0);
    view1.showView2();
    view2.$el.promise().done(function() {
      assertSelectedView(tabView, 1);
      view2.showView1();
      view1.$el.promise().done(function() {
        assertSelectedView(tabView, 0);
        view1.showView3();
        view3.$el.promise().done(function() {
          assertSelectedView(tabView, 2);
          start();
        });
      });
    });
  });

}).call(this);
