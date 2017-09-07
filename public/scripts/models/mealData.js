'use strict';

var app = app || {};

(function(module) {
  const Mealdata = {};
  Mealdata.all = [];

  Mealdata.getMealData = function(callback) {
      // this is working
    $.get('/data/')
     .then(data => Mealdata.all = data, err => console.error(err))
     .then(callback);
     // TEST
    /*$.getJSON('https://data.seattle.gov/resource/47rs-c243.json', function(data) {
      console.log(data);
    });*/
  };
// TEST
  Mealdata.getGoogleData = function() {
    $.get('/data', function(data) {
      console.log(data);
    })
  }

  module.Mealdata = Mealdata;

})(app);
