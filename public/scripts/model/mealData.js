'use strict';

var app = app || {};

(function(module) {
  function Mealdata(rawDataObj) {
    Object.keys(rawDataObj).forEach(key => this[key] = rawDataObj[key]);
  }

  Mealdata.all = [];

  Mealdata.getMealData = function() {
    // $.get('/data', callback); //talk to george about that
    $.getJSON('https://data.seattle.gov/resource/47rs-c243.json', function(data) {
      console.log(data);
    });
  };

  Mealdata.getGoogleData = function() {
    $.get('/data', function(data) {
      console.log(data);
    })
  }

  module.Mealdata = Mealdata;

})(app);
