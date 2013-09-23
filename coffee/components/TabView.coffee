###
* Tab panel view
###

###
* Tab button view
###
Backpack.TabButtonView = Backpack.View.extend
  tagName: 'a'
  attributes:
    href: '#'
    class: 'tab-button'

  plugins: [Backpack.TemplatePlugin]

  template: _.template '<%- title %>'

  events:
    'click': 'onClick'

  onClick:(e)->

###
* A tab panel view that contains tab button view and tab content view
###
Backpack.TabView = Backpack.StackView.extend
  allPlugins: [Backpack.TemplatePlugin, Backpack.ContainerPlugin]
  template: '<div class="tab-button-container"></div><div class="tab-content-container"></div>'
  templateNodes:
    containerNode: '.tab-content-container'
  autoRender: false

  render:->
    ### setup tab buttons ###
    @_buttonMap = {} # a map of content view cid to TabButtonView
    @buttonContainer = new Backpack.View
      el: '.tab-button-container'
      plugins: [Backpack.ContainerPlugin]

    ###
    * When autoRender=false, need to explicitly call renderContainer
    * This needs to be after tab buttons have been setup
    ###
    @renderContainer()

    Backpack.StackView::render.apply @, arguments
    @

  ###
  * Override Backpack.ContainerPlugin to add tab button
  ###
  addView:(view, options)->
    Backpack.StackView::addView.apply @, arguments
    tabView = @
    tabButtonView = new Backpack.TabButtonView
      title: view.title || view.name
      onClick:(e)->
        ###
        * If tab button view is clicked, show corresponding content view
        * `this` points to a TabButtonView instance in this scope
        ###
        tabView.showChild @_tabContentView
        return
    @buttonContainer.addChild tabButtonView
    @_buttonMap[view.cid] = tabButtonView
    tabButtonView._tabContentView = view
    return

  ###
  * Override Backpack.StackView to remove/destroy tab button
  ###
  removeChild:(view)->
    child = Backpack.StackView::removeChild.apply @, arguments
    if child
      tabButtonView = @_buttonMap[child.cid]
      @buttonContainer.removeChild tabButtonView
      tabButtonView.destroy()
      delete @_buttonMap[child.cid]
    child

  ###
  * Override Backpack.StackView to change styles of selected tab button
  ###
  showChild:(child)->
    child = Backpack.StackView::showChild.apply @, [child, true]
    if child
      CLS_SELECTED = 'selected'
      map = @_buttonMap
      map[@_previousView.cid].$el.removeClass CLS_SELECTED if @_previousView
      map[child.cid].$el.addClass CLS_SELECTED
    child