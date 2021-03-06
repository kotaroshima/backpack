(function() {
  Backpack.AttachPlugin = {
    setup: function() {
      this._attached = [];
    },
    /**
    * Attaches an event handler, which will be detached when this object is destroyed
    * if 2 arguments:
    * @param {String} method Name of this object's method to which attach event
    * @param {Function} cb Callback function
    * if 3 arguments:
    * @param {Object} object Object to which attach event
    * @param {String} method Method name of object to which attach event
    * @param {Function} cb Callback function
    */

    attach: function() {
      var handler;
      switch (arguments.length) {
        case 2:
          handler = Backpack.attach(this, arguments[0], arguments[1]);
          break;
        case 3:
          handler = Backpack.attach(arguments[0], arguments[1], arguments[2]);
      }
      this._attached.push(handler);
      return handler;
    },
    /**
    * Detaches an event and it will be removed from event handler list which will be cleaned up on destroy
    * @param {Object} handler Event handler
    */

    detach: function(handler) {
      var index, ret;
      index = _.indexOf(this._attached, handler);
      ret = false;
      if (index !== -1) {
        this._attached.splice(index, 1);
        handler.detach();
        ret = true;
      }
      return ret;
    },
    cleanup: function() {
      _.invoke(this._attached, 'detach');
      this._attached = [];
    }
  };

  Backpack.defaultPlugins.push(Backpack.AttachPlugin);

}).call(this);
