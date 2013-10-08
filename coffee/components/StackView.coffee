###*
* A view that stacks its children
###
Backpack.StackView = Backpack.View.extend
  plugins: [Backpack.ContainerPlugin]

  effects:
    HIDE_BACKWARD: ["slide", { direction: "right" }, "slow"]
    HIDE_FORWARD: ["slide", { direction: "left" }, "slow"]
    SHOW_BACKWARD: ["slide", { direction: "left" }, "slow"]
    SHOW_FORWARD: ["slide", { direction: "right" }, "slow"]

  ###*
  * Constructor
  * @param {Object} [options={}] Initialization option
  * @param {Backpack.View[]} [options.children] Child views
  * @param {integer} [options.showIndex=0] Index of child view to show on init
  * @param {Object} [options.navigationEvents] Map to define event handler to show child.
  *    key is child view's 'name' property, and value is child view's method name to trigger selection
  ###
  initialize:(options={})->
    Backpack.View::initialize.apply @, arguments

    @$el.css position: "relative"

    @attach 'addView', (view, options)=>
      @showChild view, true if options?.showOnAdd == true
      return

    # show one of its child views on init
    showIndex = options.showIndex || 0
    if @children && (0 <= showIndex < @children.length)
      @_currentView = @children[showIndex]
      @_previousView = @_currentView

    @render()
    return

  ###*
  * Select only one of its children and hide others
  * @returns {Backpack.View} this instance
  ###
  render:->
    @showChild @_currentView, true
    @

  ###*
  * Override Backpack.ContainerPlugin to attach navigation events
  * @param {Backbone.View} view A view to add
  * @param {Object} options optional parameters
  * @param {boolean} options.showOnAdd if true, this view will be shown when added
  ###
  addView:(view, options)->
    view.$el.css position: "absolute", width: "99%"
    Backpack.ContainerPlugin.addView.apply @, arguments

    navigationEvents = @navigationEvents
    if navigationEvents
      stackEvent = navigationEvents[view.name]
      if stackEvent
        eventDef = if _.isArray stackEvent then stackEvent else [stackEvent]
        _.each eventDef, (def)=>
          @attachNavigationEvent view, def
          return

    view.$el.hide()
    return

  ###*
  * Override Backpack.ContainerPlugin to show added view if this is the only child
  ###
  addChild:(view, options)->
    if @children.length == 0
      options = {} if !options
      options.showOnAdd = true
    Backpack.ContainerPlugin.addChild.apply @, [view, options]

  ###*
  * Override Backpack.ContainerPlugin to show different child if selected child has been removed
  ###
  removeChild:(view)->
    view = @getChild view
    if view == @_currentView
      index = _.indexOf @children, view
      if @children.length > 1
        if index > 0
          child = @getChild index-1, true
        else if index == 0
          child = @getChild 1, true
      else
        child = null
      @showChild child, true
    Backpack.ContainerPlugin.removeChild.apply @, arguments

  ###*
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
        @onBack()
        return
    else if navigationDef.target
      targetView = _.find @children, (child)->
        child.name == navigationDef.target
      view.attach view, navigationDef.event, =>
        @showChild targetView
        return
    return

  onBack:->
    @showPreviousChild()
    return

  ###*
  * Hides previously shown child view and shows another child view
  * @param {Backbone.View|Integer|String} child Child view instance or child index or 'name' property of child view
  * @param {boolean} bNoAnimation if true, show child without animation
  * @return {Backbone.View} shown child view
  ###
  showChild:(child, bNoAnimation)->
    child = @getChild child
    bBack = (_.indexOf(@children, child) < _.indexOf(@children, @_currentView))
    if @_currentView
      hideKey = if bBack then 'HIDE_BACKWARD' else 'HIDE_FORWARD'
      hideEffect = @effects[hideKey] if !bNoAnimation
      @_currentView.$el.hide.apply @_currentView.$el, hideEffect
    if child
      showKey = if bBack then 'SHOW_BACKWARD' else 'SHOW_FORWARD'
      showEffect = @effects[showKey] if !bNoAnimation
      child.$el.show.apply child.$el, showEffect
    @_previousView = @_currentView
    @_currentView = child

  ###*
  * Shows previously shown child view again and hides currently shown child view
  ###
  showPreviousChild:->
    if @_previousView
      @showChild @_previousView
    return