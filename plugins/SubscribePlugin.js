(function() {
  var __hasProp = {}.hasOwnProperty;

  Backpack.SubscribePlugin = {
    /**
    * Sets up subscribers from `subscribers` property
    * `subscribers` property takes key-value pair of:
    * - key : topic name of events to subscribe
    * - value : method name of callback function
    */

    setup: function() {
      var key, value, _ref;
      this._subscribers = [];
      if (this.subscribers) {
        _ref = this.subscribers;
        for (key in _ref) {
          if (!__hasProp.call(_ref, key)) continue;
          value = _ref[key];
          this.addSubscriber(key, value);
        }
      }
    },
    /**
    * Subscribe to topic
    * @param {String} topic Topic name of events to subscribe
    * @param {String|Function} cb Callback function to be called
    */

    addSubscriber: function(topic, cb) {
      if (_.isString(cb)) {
        cb = this[cb];
      }
      this._subscribers.push({
        topic: topic,
        callback: cb
      });
      return Backbone.on(topic, cb, this);
    },
    /**
    * Unsubscribe to topic
    * @param {String} topic Topic name to unsubscribe
    * @param {String|Function} cb Callback function
    * @return {Boolean} true if publisher has been removed, false if not
    */

    removeSubscriber: function(topic, cb) {
      var found, index, subscriber, _i, _ref;
      if (_.isString(cb)) {
        cb = this[cb];
      }
      found = -1;
      _ref = this._subscribers;
      for (index = _i = _ref.length - 1; _i >= 0; index = _i += -1) {
        subscriber = _ref[index];
        if (topic === subscriber.topic && cb === subscriber.callback) {
          found = index;
          break;
        }
      }
      if (found >= 0) {
        if (found !== -1) {
          this._subscribers.splice(found, 1);
        }
        Backbone.off(topic, cb, this);
        return true;
      }
      return false;
    },
    /**
    * Remove all subscribers on destroy
    */

    cleanup: function() {
      var _this = this;
      _.each(this._subscribers, function(subscriber) {
        return Backbone.off(subscriber.topic, subscriber.callback, _this);
      });
      this._subscribers = [];
    }
  };

  Backpack.defaultPlugins.push(Backpack.SubscribePlugin);

}).call(this);
