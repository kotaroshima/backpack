/**
* A plugin to render HTML templates for views
*/


(function() {
  var __hasProp = {}.hasOwnProperty;

  Backpack.TemplatePlugin = {
    setup: function() {
      var key, val, _ref;
      if (this.model) {
        this.model.on('change', this.renderTemplate, this);
      }
      this.renderTemplate();
      /* cache jQuery objects of HTML nodes to be referenced later*/

      if (this.templateNodes) {
        _ref = this.templateNodes;
        for (key in _ref) {
          if (!__hasProp.call(_ref, key)) continue;
          val = _ref[key];
          this[key] = this.$(val);
        }
      }
    },
    /**
    * Renders template HTML
    * If model is specified, interpolates model attributes.
    * Otherwise, interpolates view options
    */

    renderTemplate: function() {
      var template;
      template = this.template;
      if (_.isFunction(template)) {
        template = template(this.model ? this.model.attributes : this.options);
      }
      this.$el.html(template);
    },
    cleanup: function() {
      if (this.model) {
        this.model.off('change', this.renderTemplate);
      }
    }
  };

}).call(this);
