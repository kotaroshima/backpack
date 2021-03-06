/**
* A plugin to use jQuery UI Sortable
* options :
*   sortable {Boolean} pass `false` if you don't want to make it sortable on initialization (default `true`)
*   sortableOptions {Object} initialization option to pass when initializing sortable
*/


(function() {
  Backpack.SortablePlugin = {
    /**
    * Set sortable on initialize
    * By default, sets sortable. If `sortable` property is given `false`, it doesn't make it sortable.
    */

    setup: function() {
      if (this.sortable !== false) {
        this.setSortable(true);
      }
    },
    _getSortableContainer: function() {
      return this.containerNode || this.$el;
    },
    /**
    * Set this view sortable
    * @param {Boolean} true to enable sortable, false to disable sortable
    */

    setSortable: function(isSortable) {
      var containerNode, options,
        _this = this;
      containerNode = this._getSortableContainer();
      if (isSortable) {
        if (this._sortableInit) {
          containerNode.sortable('enable');
        } else {
          options = {
            start: function(event, ui) {
              ui.item.startIndex = ui.item.index();
            },
            stop: function(event, ui) {
              var collection, model, models, newIndex;
              collection = _this.collection;
              model = collection.at(ui.item.startIndex);
              newIndex = ui.item.index();
              models = collection.models;
              models.splice(ui.item.startIndex, 1);
              models.splice(newIndex, 0, model);
              collection.reset(models);
              event.stopPropagation();
            }
          };
          if (this.sortableOptions) {
            options = _.extend(options, this.sortableOptions);
          }
          containerNode.sortable(options);
          this._sortableInit = true;
        }
      } else {
        if (this._sortableInit) {
          containerNode.sortable('disable');
        }
      }
    },
    /**
    * Cleanup sortable on destroy
    */

    cleanup: function() {
      if (this._sortableInit) {
        this._getSortableContainer().sortable('destroy');
      }
    }
  };

}).call(this);
