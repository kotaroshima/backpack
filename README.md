Backpack.js
========
Backpack.js is an add-on to [Backbone.js](http://backbonejs.org/), which allows to define modules to be reused across components.

Core concept of Backpack is `plug-in`. Plug-in can be defined in the following format:
```
var MyPlugin = {
  // `setup` will be called on `initialize` for each plugin
  setup: function(){
    this.on('render', this.hello, this);
  },

  // methods other than `setup`, `cleanup` will be mixed in
  hello: function(){
    console.log('hello');
  },

  // `cleanup` will be called on `destroy` for each plugin
  cleanup: function(){
    this.off('render', this.hello, this);
  }
}
```

`Backpack.Model`, `Backpack.Collection`, `Backpack.View` are respectively subclasses of `Backbone.Model`, `Backbone.Collection`, `Backbone.View`,
which adds the capability to use this plug-in mechanism. Plug-in functionalities can be made available to these classes by passing them to `plugins` property:
```
var MyView = Backpack.View.extend({
  plugins: [MyPlugin, AnotherPlugin, ...],

  render: function(){...}
})
var view = new MyView();
```

Additionally, plug-in functionalities can be made available to each instances by passing `plugins` property to initialization options:
```
var view = new Backpack.View({
  plugins: [MyPlugin, AnotherPlugin, ...],

  render: function(){...}
});
```

Examples
------
* Open examples/index.html with a browser
 * Or access the hosted version : http://kotaroshima.github.com/backpack/examples/


Development
------
* For compiling CoffeeScript files, you need CoffeeScript installed:
```
npm install -g coffee-script
```
* To build JS files from `.coffee` files, run:
```
cake build
```
* To build CSS files from `.scss` files, run:
```
cake build-css
```

Test
------
* Open test/index.html with a browser
 * Or access the hosted version : http://kotaroshima.github.com/backpack/test/

Libraries Used
--------
* [jQuery](http://jquery.com/)
* [Underscore.js](http://underscorejs.org/)
* [Backbone.js](http://backbonejs.org/)
* [QUnit](http://qunitjs.com/)
* [CoffeeScript](http://coffeescript.org/)
* [Sass](http://sass-lang.com/)

----------
Copyright &copy; 2013 Kotaro Shima