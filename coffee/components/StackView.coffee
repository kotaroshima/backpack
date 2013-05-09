###
* A view that stacks its children
###
Backpack.StackView = Backpack.View.extend
  plugins: [Backpack.Container]

  ###
  * Constructor
  * @param {Object} [options] Initialization option
  * @param {Backpack.View[]} [options.children] Child views
  * @param {int} [options.selectedIndex=0] Index of child view to be selected
  * @param {Hash} [options.stackEvents] Map to define event handler to select child.
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

  addView:(view)->
    Backpack.Container.addView.apply @, arguments

    stackEvents = @stackEvents
    if stackEvents
      stackEvent = stackEvents[view.name]
      if stackEvent
        targetView = _.find @children, (child)->
          child.name == stackEvent.target
        @attachView view, stackEvent.event, targetView
    return

  ###
  * Attach event of child view to select that view
  * @param {Backpack.View} view Child view
  * @param {String} method Name of the child view method
  ###
  attachView:(view, method, targetView)->
    view.attach view, method, =>
      @selectChild targetView
      return
    return

  ###
  * Selects one of its child views
  * @param {int|Backbone.View} child Child view to select
  ###
  selectChild:(child)->
    if _.isNumber child
      child = @children[child]
    if @_selectedView
      @_selectedView.$el.hide()
    child.$el.show()
    @_selectedView = child
    return