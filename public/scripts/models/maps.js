/*global google */  //Added to make eslint play nice with google maps.

'use strict';
var app = app || {};

var currentPin;
var map;
var pinImageBlue;
var pinImageRed;
var pinShadow;
var latlng;
var prevMarker;
var prevWindow;

function myMap() {

  pinImageBlue = new google.maps.MarkerImage('http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|' + '3366FF',
      new google.maps.Size(21, 34),
      new google.maps.Point(0,0),
      new google.maps.Point(10, 34));
  pinImageRed = new google.maps.MarkerImage('http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|' + 'FE7569',
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

  if (currentPin) {
    currentPin.setMap(null);
  }

  let geocoder = new google.maps.Geocoder();
  geocoder.geocode({'address': address}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      let lat = results[0].geometry.location.lat();
      let long = results[0].geometry.location.lng();
      var latlng = new google.maps.LatLng(lat, long);
      map.setCenter(latlng);
      let currentPin = new google.maps.Marker({
        map: map,
        position: latlng,
        icon: pinImageBlue,
        shadow: pinShadow,
        animation: google.maps.Animation.BOUNCE
      });
      map.setZoom(12);
      map.panTo(currentPin.position);
    } else {
      console.error('Geocode failed.');
    }
  });
}

function createMarker(data) {
  latlng = new google.maps.LatLng(data.latitude, data.longitude);
  let marker = new google.maps.Marker({
    map: map,
    position: latlng,
    icon: pinImageRed,
    shadow: pinShadow,
    animation: google.maps.Animation.DROP
  });
  const infoWindowOptions = {
    content: `
      <strong>Meal type:</strong> ${data.meal_served}<br>
      <strong>Address:</strong> ${data.location}<br>
      <strong>Time:</strong> ${data.day_time}<br>
      <strong>Sponsor:</strong> ${data.name_of_program}<br>
      <strong>People served:</strong> ${data.people_served}
    `
  };
  const infoWindow = new google.maps.InfoWindow(infoWindowOptions);
  google.maps.event.addListener(marker,'click',function() {
    if (prevMarker) {
      prevWindow.close(map, prevMarker)
    }
    infoWindow.open(map, marker);
    prevMarker = marker;
    prevWindow = infoWindow;
  });
}
