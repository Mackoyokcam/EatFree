'use strict';

var app = app || {};

(function(module) {

  function Mealdata(rawDataObj) {
    Object.keys(rawDataObj).forEach(key => this[key] = rawDataObj[key]);
  }
  // I think this is needed
  //const Mealdata = {};

  Mealdata.all = [];

  Mealdata.getMealData = function(callback) {
      // this is working
     $.get('/data');
     .then(data => Mealdata.all = data, err => console.error(err))
     .then(callback);
     // not sure why this is needed?
    /*$.getJSON('https://data.seattle.gov/resource/47rs-c243.json', function(data) {
      console.log(data);
    });*/
  };

  Mealdata.getGoogleData = function() {
    $.get('/data', function(data) {
      console.log(data);
    })
  }

  module.Mealdata = Mealdata;

})(app);
