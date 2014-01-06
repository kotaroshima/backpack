(function() {
  module('Backpack.TemplatePlugin', {
    setup: function() {
      return this.testNode = $('#testNode');
    },
    teardown: function() {
      if (this.view) {
        this.view.destroy();
      }
    }
  });

  test('extend with static HTML', 1, function() {
    var TestView, text, view;
    text = 'hoge';
    TestView = Backpack.View.extend({
      plugins: [Backpack.TemplatePlugin],
      template: text
    });
    view = this.view = new TestView();
    this.testNode.append(view.$el);
    equal(view.$el.text(), text, 'view is rendered with template HTML');
  });

  test('render static HTML specified in initialization options', 1, function() {
    var text, view;
    text = 'hoge';
    view = this.view = new Backpack.View({
      plugins: [Backpack.TemplatePlugin],
      template: text
    });
    this.testNode.append(view.$el);
    equal(view.$el.text(), text, 'view is rendered with template HTML');
  });

  test('extend and interpolate with initialization options', 1, function() {
    var TestView, text, view;
    text = 'hoge';
    TestView = Backpack.View.extend({
      plugins: [Backpack.TemplatePlugin],
      template: _.template('<%= text %>')
    });
    view = this.view = new TestView({
      text: text
    });
    this.testNode.append(view.$el);
    equal(view.$el.text(), text, 'view is rendered with template HTML');
  });

  test('interpolate with initialization options', 1, function() {
    var text, view;
    text = 'hoge';
    view = this.view = new Backpack.View({
      plugins: [Backpack.TemplatePlugin],
      template: _.template('<%= text %>'),
      text: text
    });
    this.testNode.append(view.$el);
    equal(view.$el.text(), text, 'view is rendered with template HTML');
  });

  test('extend and interpolate with model attributes', 1, function() {
    var TestView, model, text, view;
    text = 'hoge';
    model = new Backpack.Model({
      text: text
    });
    TestView = Backpack.View.extend({
      plugins: [Backpack.TemplatePlugin],
      template: _.template('<%= text %>')
    });
    view = this.view = new TestView({
      model: model
    });
    this.testNode.append(view.$el);
    equal(view.$el.text(), text, 'view is rendered with template HTML');
  });

  test('interpolate with model attributes', 1, function() {
    var model, text, view;
    text = 'hoge';
    model = new Backpack.Model({
      text: text
    });
    view = this.view = new Backpack.View({
      plugins: [Backpack.TemplatePlugin],
      template: _.template('<%= text %>'),
      model: model
    });
    this.testNode.append(view.$el);
    equal(view.$el.text(), text, 'view is rendered with template HTML');
  });

  test('update model attributes', 2, function() {
    var model, text, view;
    model = new Backpack.Model({
      text: 'hoge'
    });
    view = this.view = new Backpack.View({
      plugins: [Backpack.TemplatePlugin],
      template: _.template('<%= text %>'),
      model: model
    });
    this.testNode.append(view.$el);
    text = 'foo';
    model.set('text', text);
    equal(view.$el.text(), text, 'view is updated with model attribute');
    view.destroy();
    model.set('text', 'bar');
    equal(view.$el.text(), text, 'view is not updated after view is destroyed');
  });

  test('extend with templateNodes', 2, function() {
    var TestView, text1, text2, view;
    text1 = 'Text 1';
    text2 = 'Text 2';
    TestView = Backpack.View.extend({
      plugins: [Backpack.TemplatePlugin],
      template: '<div><div id="my-id">' + text1 + '</div><div class="my-class">' + text2 + '</div></div>',
      templateNodes: {
        myId: '#my-id',
        myClass: '.my-class'
      }
    });
    view = this.view = new TestView();
    this.testNode.append(view.$el);
    equal(view.myId.text(), text1, 'jQuery object can be referenced with templateNodes');
    equal(view.myClass.text(), text2, 'jQuery object can be referenced with templateNodes');
  });

  test('initialize with templateNodes', 2, function() {
    var text1, text2, view;
    text1 = 'Text 1';
    text2 = 'Text 2';
    view = this.view = new Backpack.View({
      plugins: [Backpack.TemplatePlugin],
      template: '<div><div id="my-id">' + text1 + '</div><div class="my-class">' + text2 + '</div></div>',
      templateNodes: {
        myId: '#my-id',
        myClass: '.my-class'
      }
    });
    this.testNode.append(view.$el);
    equal(view.myId.text(), text1, 'jQuery object can be referenced with templateNodes');
    equal(view.myClass.text(), text2, 'jQuery object can be referenced with templateNodes');
  });

}).call(this);
