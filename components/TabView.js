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
    template: _.template('<%- text %>')
  });

  /*
  * A tab panel view that contains tab button view and tab content view
  */


  Backpack.TabView = Backpack.StackView.extend({
    allPlugins: [Backpack.TemplatePlugin, Backpack.ContainerPlugin],
    template: '<div class="tab-button-container"></div><div class="tab-content-container"></div>',
    templateNodes: {
      buttonContainerNode: '.tab-button-container',
      containerNode: '.tab-content-container'
    },
    autoRender: false,
    render: function() {
      /* setup tab buttons*/

      this._buttonMap = {};
      this.buttonContainer = new Backpack.View({
        plugins: [Backpack.ContainerPlugin]
      });
      this.buttonContainerNode.append(this.buttonContainer.$el);
      /*
      * When autoRender=false, need to explicitly call renderContainer
      * This needs to be after tab buttons have been setup
      */

      this.renderContainer();
      Backpack.StackView.prototype.render.apply(this, arguments);
      return this;
    },
    /**
    * Override Backpack.ContainerPlugin to add tab button
    */

    addView: function(view, options) {
      var clazz, tabButtonView;
      Backpack.StackView.prototype.addView.apply(this, arguments);
      options = {
        text: view.title || view.name,
        tabView: this,
        onClick: function() {
          /**
          * If tab button view is clicked, show corresponding content view
          * `this` points to a TabButtonView instance in this scope
          */

          this.tabView.showChild(this._tabContentView);
        }
      };
      _.extend(options, this.tabButtonOptions);
      if (!options.events) {
        options.events = {};
      }
      options.events.click = 'onClick';
      clazz = this.tabButtonView || Backpack.TabButtonView;
      tabButtonView = new clazz(options);
      this.buttonContainer.addChild(tabButtonView);
      this._buttonMap[view.cid] = tabButtonView;
      tabButtonView._tabContentView = view;
    },
    /**
    * Override Backpack.StackView to remove/destroy tab button
    */

    removeChild: function(view) {
      var child, tabButtonView;
      child = Backpack.StackView.prototype.removeChild.apply(this, arguments);
      if (child) {
        tabButtonView = this._buttonMap[child.cid];
        this.buttonContainer.removeChild(tabButtonView);
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
    },
    /**
    * Get tab content view for a tab button view
    */

    getTabContent: function(tabButtonView) {
      return tabButtonView._tabContentView;
    }
  });

  Backpack.CloseTabButtonPlugin = {
    tabButtonView: Backpack.ActionView,
    tabButtonOptions: {
      attributes: {
        "class": 'tab-button'
      },
      actions: [
        {
          iconClass: 'tab-close',
          onClick: function(e) {
            var contentView;
            contentView = this.tabView.getTabContent(this);
            this.tabView.removeChild(contentView);
            /* stopPropagation so that it doesn't try to select removed tab*/

            e.stopPropagation();
          }
        }
      ]
    }
  };

}).call(this);
