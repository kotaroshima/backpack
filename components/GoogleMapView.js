/**
* A view that that displays Google map
*/


(function() {
  Backpack.GoogleMapView = Backpack.View.extend({
    apiKey: '',
    defaultLocation: {
      lat: -34.397,
      lng: 150.644
    },
    subscribers: {
      GOOGLE_MAP_SCRIPT_LOADED: '_onScriptLoaded'
    },
    initialize: function(options) {
      Backpack.View.prototype.initialize.apply(this, arguments);
      if (!options.el) {
        this.$el.css({
          width: '100%',
          height: '100%'
        });
      }
    },
    /**
    * Need to call this after being added to the DOM tree
    */

    initMap: function() {
      var script;
      if (!this.apiKey || this.apiKey.length === 0) {
        throw new Error('You need Google Map API key to use this widget');
      }
      if (this._mapInit) {
        return;
      }
      script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'http://maps.googleapis.com/maps/api/js?sensor=true&callback=Backpack.GoogleMapView.onScriptLoaded&key=' + this.apiKey;
      document.body.appendChild(script);
      this._mapInit = true;
    },
    _onScriptLoaded: function() {
      this.map = new google.maps.Map(this.$el.get(0), {
        zoom: 8,
        center: new google.maps.LatLng(this.defaultLocation.lat, this.defaultLocation.lng),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });
      this.removeSubscriber('GOOGLE_MAP_SCRIPT_LOADED', this._onScriptLoaded);
    },
    /**
    * Move center of map
    * @param {Object} location
    * @param {Number} location.lat latitude
    * @param {Number} location.lng longitude
    */

    setLocation: function(location) {
      this.map.panTo(new google.maps.LatLng(location.lat, location.lng));
    },
    /**
    * Add marker to map
    * @param {Object} option
    * @param {Number} option.lat latitude
    * @param {Number} option.lng longitude
    * @param {String} option.title title of marker
    */

    addMarker: function(option) {
      var marker;
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(option.lat, option.lng),
        title: option.title
      });
      marker.setMap(this.map);
    }
  });

  Backpack.GoogleMapView.onScriptLoaded = function() {
    Backbone.trigger('GOOGLE_MAP_SCRIPT_LOADED');
  };

}).call(this);
