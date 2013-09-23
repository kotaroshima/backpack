// Generated by CoffeeScript 1.6.2
/*
* Tab panel view
*/


/*
* Tab button view
*/


(function() {
  Backpack.TabButtonView = Backpack.View.extend({
    tagName: 'a',
    attributes: {
      href: '#',
      "class": 'tab-button'
    },
    plugins: [Backpack.TemplatePlugin],
    template: _.template('<%- title %>'),
    events: {
      'click': 'onClick'
    },
    onClick: function(e) {}
  });

  /*
  * A tab panel view that contains tab button view and tab content view
  */


  Backpack.TabView = Backpack.StackView.extend({
    plugins: [Backpack.TemplatePlugin, Backpack.ContainerPlugin],
    template: '<div class="tab-button-container"></div><div class="tab-content-container"></div>',
    templateNodes: {
      containerNode: '.tab-content-container'
    },
    autoRender: false,
    render: function() {
      /* setup tab buttons
      */
      this._buttonMap = {};
      this.buttonContainer = new Backpack.View({
        el: '.tab-button-container',
        plugins: [Backpack.ContainerPlugin]
      });
      /*
      * When autoRender=false, need to explicitly call renderContainer
      * This needs to be after tab buttons have been setup
      */

      this.renderContainer();
      Backpack.StackView.prototype.render.apply(this, arguments);
      return this;
    },
    /*
    * Override Backpack.ContainerPlugin to add tab button
    */

    addView: function(view, options) {
      var tabButtonView, tabView;

      Backpack.StackView.prototype.addView.apply(this, arguments);
      tabView = this;
      tabButtonView = new Backpack.TabButtonView({
        title: view.title || view.name,
        onClick: function(e) {
          /*
          * If tab button view is clicked, show corresponding content view
          * `this` points to a TabButtonView instance in this scope
          */
          tabView.showChild(this._tabContentView);
        }
      });
      this.buttonContainer.addChild(tabButtonView);
      this._buttonMap[view.cid] = tabButtonView;
      tabButtonView._tabContentView = view;
    },
    /*
    * Override Backpack.StackView to remove/destroy tab button
    */

    removeChild: function(view) {
      var child, tabButtonView;

      child = Backpack.StackView.prototype.removeChild.apply(this, arguments);
      if (child) {
        tabButtonView = this._buttonMap[child.cid];
        this.buttonContainer.removeChild(tabButtonView);
        tabButtonView.destroy();
        delete this._buttonMap[child.cid];
      }
      return child;
    },
    /*
    * Override Backpack.StackView to change styles of selected tab button
    */

    showChild: function(child) {
      var CLS_SELECTED, map;

      child = Backpack.StackView.prototype.showChild.apply(this, [child, true]);
      if (child) {
        CLS_SELECTED = 'selected';
        map = this._buttonMap;
        if (this._previousView) {
          map[this._previousView.cid].$el.removeClass(CLS_SELECTED);
        }
        map[child.cid].$el.addClass(CLS_SELECTED);
      }
      return child;
    }
  });

}).call(this);
