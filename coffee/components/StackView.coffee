###
* A view that stacks its children
###
Backpack.StackView = Backpack.View.extend
  plugins: [Backpack.ContainerPlugin]

  effects:
    HIDE_BACKWARD: ["slide", { direction: "right" }, "slow"]
    HIDE_FORWARD: ["slide", { direction: "left" }, "slow"]
    SHOW_BACKWARD: ["slide", { direction: "left" }, "slow"]
    SHOW_FORWARD: ["slide", { direction: "right" }, "slow"]

  ###
  * Constructor
  * @param {Object} [options={}] Initialization option
  * @param {Backpack.View[]} [options.children] Child views
  * @param {integer} [options.showIndex=0] Index of child view to show on init
  * @param {Object} [options.navigationEvents] Map to define event handler to show child.
  *    key is child view's 'name' property, and value is child view's method name to trigger selection
  ###
  initialize:(options={})->
    Backpack.View::initialize.apply @, arguments
    @$el.css position: "relative", width: "100%"

    # show one of its child views on init
    showIndex = options.showIndex || 0
    if @children && (0 <= showIndex < @children.length)
      @_currentView = @children[showIndex]
      @_previousView = @_currentView
    @render()
    return

  ###
  * Select only one of its children and hide others
  * @returns {Backpack.View} this instance
  ###
  render:->
    _.each @children, (child)=>
      if child == @_currentView
        child.$el.show()
      else
        child.$el.hide()
      return
    @

  ###
  * Override Backpack.ContainerPlugin to attach navigation events
  * @param {Backbone.View} view A view to add
  ###
  addView:(view)->
    view.$el.css position: "absolute", width: "99%"
    Backpack.ContainerPlugin.addView.apply @, arguments

    navigationEvents = @navigationEvents
    if navigationEvents
      stackEvent = navigationEvents[view.name]
      if stackEvent
        if _.isArray stackEvent
          eventDef = stackEvent
        else
          eventDef = [stackEvent]
        _.each eventDef, (def)=>
          @attachNavigationEvent view, def
          return
    return

  ###
  * Attaches event of child view to show that view
  * @param {Backpack.View} view Child view
  * @param {Object} navigationDef map to define navigation event
  * @param {String} navigationDef.event Method name to trigger navigation event
  * @param {String} [navigationDef.target] `name` property of target view
  * @param {boolean} [navigationDef.back] if true, shows previously shown child view
  ###
  attachNavigationEvent:(view, navigationDef)->
    if navigationDef.back == true
      view.attach view, navigationDef.event, =>
        @showPreviousChild()
        return
    else
      targetView = _.find @children, (child)->
        child.name == navigationDef.target
      view.attach view, navigationDef.event, =>
        @showChild targetView
        return
    return

  ###
  * Hides previously shown child view and shows another child view
  * @param {Integer|String|Backbone.View} child Child view instance or child index or 'name' property of child view
  ###
  showChild:(child)->
    if _.isNumber child
      child = @children[child]
    else if _.isString child
      child = _.find @children, (view)->
        view.name == child
    bBack = (_.indexOf(@children, child) < _.indexOf(@children, @_currentView))
    if @_currentView
      hideKey = if bBack then 'HIDE_BACKWARD' else 'HIDE_FORWARD'
      @_currentView.$el.hide.apply @_currentView.$el, @effects[hideKey]
    showKey = if bBack then 'SHOW_BACKWARD' else 'SHOW_FORWARD'
    child.$el.show.apply child.$el, @effects[showKey]
    @_previousView = @_currentView
    @_currentView = child
    return

  ###
  * Shows previously shown child view again and hides currently shown child view
  ###
  showPreviousChild:->
    if @_previousView
      @showChild @_previousView
    return