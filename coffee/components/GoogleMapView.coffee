###
* A view that that displays Google map
###
Backpack.GoogleMapView = Backpack.View.extend

  apiKey: ''
  defaultLocation:
    lat: -34.397
    lng: 150.644

  subscribers:
    GOOGLE_MAP_SCRIPT_LOADED: '_onScriptLoaded'

  initialize:(options)->
    Backpack.View::initialize.apply @, arguments

    if !options.el
      @$el.css width: "100%", height: "100%"
    return

  ###
  * Need to call this after being added to the DOM tree
  ###
  initMap:->
    if !@apiKey || @apiKey.length is 0
      throw new Error 'You need Google Map API key to use this widget'
    return if @_mapInit
    
    script = document.createElement("script")
    script.type = "text/javascript"
    script.src = 'http://maps.googleapis.com/maps/api/js?sensor=true&callback=Backpack.GoogleMapView.onScriptLoaded&key='+@apiKey
    document.body.appendChild script
    @_mapInit = true
    return

  _onScriptLoaded:->
    @map = new google.maps.Map @$el.get(0), {
      zoom: 8
      center: new google.maps.LatLng(@defaultLocation.lat, @defaultLocation.lng)
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    @removeSubscriber 'GOOGLE_MAP_SCRIPT_LOADED', @_onScriptLoaded
    return

  ###
  * Move center of map
  * @param {Object} location
  * @param {Number} location.lat latitude
  * @param {Number} location.lng longiitude
  ###
  setLocation:(location)->
    @map.panTo new google.maps.LatLng location.lat, location.lng
    return

Backpack.GoogleMapView.onScriptLoaded = ->
  Backbone.trigger 'GOOGLE_MAP_SCRIPT_LOADED'
  return
    