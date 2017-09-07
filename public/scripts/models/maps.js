'use strict';
var app = app || {};

var map;
var pinImage;
var pinShadow;
var pinColor;
var latlng;

function myMap() {

  pinColor = 'FE7569';
  pinImage = new google.maps.MarkerImage('http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|' + pinColor,
      new google.maps.Size(21, 34),
      new google.maps.Point(0,0),
      new google.maps.Point(10, 34));
  pinShadow = new google.maps.MarkerImage('http://chart.apis.google.com/chart?chst=d_map_pin_shadow',
      new google.maps.Size(40, 37),
      new google.maps.Point(0, 0),
      new google.maps.Point(12, 35));

  let mapOptions = {
    center: new google.maps.LatLng(37.7831, -122.4039),
    zoom: 8,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }

  map = new google.maps.Map(document.getElementById('map'), mapOptions);
}


function centerOnLocation(address) {
  let geocoder = new google.maps.Geocoder();
  geocoder.geocode({'address': address}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      let lat = results[0].geometry.location.lat();
      let long = results[0].geometry.location.lng();
      var latlng = new google.maps.LatLng(lat, long);
      console.log(latlng);
      map.setCenter(latlng);
      let marker = new google.maps.Marker({
        map: map,
        position: latlng,
        icon: pinImage,
        shadow: pinShadow
      });
      map.setZoom(17);
      map.panTo(marker.position);
    } else {
      console.error('Geocode failed.');
    }
  });
}


// const mapOptions = {
//   center: new google.maps.LatLng(37.7831, -122.4039),
//   zoom: 12,
//   mapTypeId: google.maps.MapTypeId.ROADMAP
// }
//
// const map = new google.maps.Map(document.getElementById('map'), mapOptions);
//
// const markerOptions = {
//   position: new google.maps.LatLng(37.7831, -122.4039),
//   map: map
// };
//
// const marker = new google.maps.Marker(markerOptions);
// marker.setMap(map);
//
// const infoWindowOptions = {
//   content: 'WTF'
// };
//
// const infoWindow = new google.maps.InfoWindow(infoWindowOptions);
// google.maps.event.addListener(marker,'click',function(e) {
//   infoWindow.open(map, marker);
// });
