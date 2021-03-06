/**
* A view that has action buttons in the left/right
*/


(function() {
  Backpack.ActionView = Backpack.View.extend({
    plugins: [Backpack.TemplatePlugin],
    template: _.template('<%= leftActionHtml %><span class="main-cell"><%= text %></span><%= rightActionHtml %>'),
    templateNodes: {
      mainCell: '.main-cell'
    },
    initialize: function(options) {
      var actions, leftActionHtml, leftActions, rightActionHtml, rightActions;
      this.$el.addClass('action-view');
      if (!this.events) {
        this.events = {};
      }
      actions = options.actions || this.actions;
      if (actions) {
        leftActions = actions.left;
        if (leftActions) {
          leftActionHtml = this._processActions(leftActions, true);
        }
        rightActions = _.isArray(actions) ? actions : actions.right;
        if (rightActions) {
          rightActionHtml = this._processActions(rightActions, false);
        }
      }
      _.defaults(this.options, {
        leftActionHtml: leftActionHtml || '',
        rightActionHtml: rightActionHtml || '',
        text: ''
      });
      Backpack.View.prototype.initialize.apply(this, arguments);
      this.delegateEvents(this.events);
      if (options.itemView) {
        this.itemView = options.itemView;
      }
      if (options.itemOptions) {
        this.itemOptions = options.itemOptions;
      }
    },
    _buttonTemplate: _.template('<<%- tagName %> class="<%- iconClass %>" title="<%- title %>"><%- text %></<%- tagName %>>'),
    _processActions: function(actions, isLeft) {
      var html,
        _this = this;
      html = '<span class="' + (isLeft ? 'left-cell' : 'right-cell') + '">';
      _.each(actions, function(action) {
        var iconClass, onClick;
        iconClass = action.iconClass;
        onClick = action.onClick;
        if (onClick) {
          if (_.isString(onClick)) {
            onClick = _this[onClick];
          }
          if (onClick && _.isFunction(onClick)) {
            _this.events['click .' + iconClass] = _.bind(onClick, _this);
          }
        }
        action = _.defaults(action, {
          tagName: onClick ? 'button' : 'span',
          iconClass: '',
          title: '',
          text: ''
        });
        html += _this._buttonTemplate(action);
      });
      return html += '</span>';
    },
    render: function(options) {
      var view;
      if (this.itemView) {
        if (!this.child) {
          view = this.child = new this.itemView(this.itemOptions);
          this.mainCell.append(view.$el);
        }
        view.render();
      } else {
        this.mainCell.text(options ? options.text : '');
      }
      return this;
    },
    destroy: function() {
      if (this.itemView && this.itemView.destroy) {
        this.child.destroy();
      }
      Backpack.View.prototype.destroy(this, arguments);
    }
  });

}).call(this);
