'use strict';
const mapOptions = {
  center: new google.maps.LatLng(37.7831, -122.4039),
  zoom: 12,
  mapTypeId: google.maps.MapTypeId.ROADMAP
}
const map = new google.maps.Map(document.getElementById('map'), mapOptions);
const geocoder = new google.maps.Geocoder();

function centerOnLocation(address) {

  geocoder.geocode({ 'address' : address }, function(results, status) {
    if(status === google.maps.GeocoderStatus.OK) {

      //In this case it creates a marker, but you can get the lat and lng from the location.LatLng
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker( {
        map     : map,
        position: results[0].geometry.location
      } );
    } else {
      alert( 'Geocode was not successful for the following reason: ' + status );
    }
  } );
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
