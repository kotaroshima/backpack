// Generated by CoffeeScript 1.6.2
/**
* A plugin to render HTML templates
*/


(function() {
  var __hasProp = {}.hasOwnProperty;

  Backpack.TemplatePlugin = {
    setup: function() {
      var key, template, val, _ref;

      template = this.template;
      if (_.isFunction(template)) {
        template = template(this.options);
      }
      this.$el.html(template);
      /* cache jQuery object for HTML nodes to be referenced later
      */

      if (this.templateNodes) {
        _ref = this.templateNodes;
        for (key in _ref) {
          if (!__hasProp.call(_ref, key)) continue;
          val = _ref[key];
          this[key] = this.$(val);
        }
      }
    }
  };

}).call(this);
