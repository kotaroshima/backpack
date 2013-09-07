###*
* A view that has action buttons in the left/right
###
Backpack.ActionView = Backpack.View.extend
  plugins: [Backpack.TemplatePlugin]
  template: _.template '<%= leftActionHtml %><span class="main-cell"><%= text %></span><%= rightActionHtml %>'
  templateNodes:
    mainCell: '.main-cell'

  initialize:(options)->
    @$el.addClass 'action-view'

    @events = {} if !@events
    actions = options.actions || @actions
    if actions
      leftActions = actions.left
      leftActionHtml = @_processActions leftActions, true if leftActions
      rightActions = if _.isArray actions then actions else actions.right
      rightActionHtml = @_processActions rightActions, false if rightActions
    _.defaults @options,
      leftActionHtml: leftActionHtml || ''
      rightActionHtml: rightActionHtml || ''
      text: ''
    Backpack.View::initialize.apply @, arguments # template will be rendered

    @delegateEvents @events

    @itemView = options.itemView if options.itemView
    @itemOptions = options.itemOptions if options.itemOptions
    return

  _buttonTemplate: _.template '<<%- tagName %> class="<%- iconClass %>" title="<%- title %>"><%- text %></<%- tagName %>>'
  _processActions:(actions, isLeft)->
    html = '<span class="'+(if isLeft then 'left-cell' else 'right-cell')+'">'
    _.each actions, (action)=>
      iconClass = action.iconClass
      onClicked = action.onClicked

      if onClicked
        if _.isString onClicked
          onClicked = @[onClicked]
        if onClicked && _.isFunction onClicked
          @events['click .'+iconClass] = _.bind onClicked, @

      action = _.defaults action,
        tagName: if onClicked then 'button' else 'span'
        iconClass: ''
        title: ''
        text: ''
      html += @_buttonTemplate action
      return
    html += '</span>'

  render:(options)->
    if @itemView
      if !@child
        view = @child = new @itemView @itemOptions
        @mainCell.append view.$el
      view.render()
    else
      @mainCell.text if options then options.text else ''
    @

  destroy:->
    @child.destroy() if @itemView && @itemView.destroy
    Backpack.View::destroy @, arguments
    return
