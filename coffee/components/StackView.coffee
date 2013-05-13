###
* A view that stacks its children
###
Backpack.StackView = Backpack.View.extend
  plugins: [Backpack.ContainerPlugin]

  ###
  * Constructor
  * @param {Object} [options={}] Initialization option
  * @param {Backpack.View[]} [options.children] Child views
  * @param {integer} [options.selectedIndex=0] Index of child view to be selected
  * @param {Object} [options.navigationEvents] Map to define event handler to select child.
  *    key is child view's 'name' property, and value is child view's method name to trigger selection
  ###
  initialize:(options={})->
    Backpack.View::initialize.apply @, arguments

    # select one of its child views
    selectedIndex = options.selectedIndex || 0
    if @children && (0 <= selectedIndex < @children.length)
      @_selectedView = @children[selectedIndex]
    @render()
    return

  ###
  * Select only one of its children and hide others
  * @returns {Backpack.View} this instance
  ###
  render:->
    _.each @children, (child)=>
      if child == @_selectedView
        @selectChild child
      else
        child.$el.hide()
      return
    @

  ###
  * Override Backpack.ContainerPlugin to attach navigation events
  * @param {Backbone.View} view A view to add
  ###
  addView:(view)->
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
  * Attach event of child view to select that view
  * @param {Backpack.View} view Child view
  * @param {Object} navigationDef map to define navigation event
  * @param {String} navigationDef.event Method name to trigger navigation event
  * @param {String} [navigationDef.target] `name` property of target view
  * @param {boolean} [navigationDef.back] if true, selects previously selected view
  ###
  attachNavigationEvent:(view, navigationDef)->
    if navigationDef.back == true
      view.attach view, navigationDef.event, =>
        @selectPreviousSelected()
        return
    else
      targetView = _.find @children, (child)->
        child.name == navigationDef.target
      view.attach view, navigationDef.event, =>
        @selectChild targetView
        return
    return

  ###
  * Selects one of its child views
  * @param {integer|Backbone.View} child Child view to select
  ###
  selectChild:(child)->
    if _.isNumber child
      child = @children[child]
    if @_selectedView
      @_selectedView.$el.hide()
    child.$el.show()
    @_previousSelected = @_selectedView
    @_selectedView = child
    return

  ###
  * Select previously selected child view
  ###
  selectPreviousSelected:->
    if @_previousSelected
      @selectChild @_previousSelected
    return