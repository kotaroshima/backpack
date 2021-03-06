(function() {
  var __hasProp = {}.hasOwnProperty;

  Backpack.PublishPlugin = {
    /**
    * Sets up publishers from `publishers` property
    * `publishers` property takes key-value pair of:
    * - key : method name to trigger the event
    * - value : topic name of events to be published
    */

    setup: function() {
      var key, value, _ref;
      this._publishers = [];
      if (this.publishers) {
        _ref = this.publishers;
        for (key in _ref) {
          if (!__hasProp.call(_ref, key)) continue;
          value = _ref[key];
          this.addPublisher(key, value);
        }
      }
    },
    /**
    * Add publisher
    * @param {String} method Method name to trigger the event
    * @param {String} topic Topic name of events to be published
    * @return {Object} handler object (return value of Backpack.attach)
    */

    addPublisher: function(method, topic) {
      var handler;
      handler = Backpack.attach(this, method, function() {
        var args;
        args = [].slice.call(arguments, 0);
        args.unshift(topic);
        Backbone.trigger.apply(Backbone, args);
      });
      this._publishers.push({
        handler: handler,
        method: method,
        topic: topic
      });
      return handler;
    },
    /**
    * Remove publisher
    * If 1 argument
    * @param {Object} handler Handler object to detach (return value of Backpack.attach)
    * If 2 arguments
    * @param {String} method Method name to trigger the event
    * @param {String} topic Topic name of events to be published
    * @return {Boolean} true if publisher has been removed, false if not
    */

    removePublisher: function() {
      var found, index, publisher, _i, _ref;
      found = -1;
      _ref = this._publishers;
      for (index = _i = _ref.length - 1; _i >= 0; index = _i += -1) {
        publisher = _ref[index];
        if (arguments.length > 1 && _.isString(arguments[0])) {
          if (arguments[0] === publisher.method && arguments[1] === publisher.topic) {
            found = index;
            break;
          }
        } else {
          if (arguments[0] === publisher.handler) {
            found = index;
            break;
          }
        }
      }
      if (found >= 0) {
        this._publishers[found].handler.detach();
        this._publishers.splice(found, 1);
        return true;
      }
      return false;
    },
    /**
    * Remove all publishers on destroy
    */

    cleanup: function() {
      _.each(this._publishers, function(publisher) {
        publisher.handler.detach();
      });
      this._publishers = [];
    }
  };

  Backpack.defaultPlugins.push(Backpack.PublishPlugin);

}).call(this);
