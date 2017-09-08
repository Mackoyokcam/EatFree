'use strict';

var app = app || {};

(function(module) {
  const Mealdata = {};
  Mealdata.all = [];

  Mealdata.getMealData = function(callback) {
    // Request meal data from server
    $.get('/meals')
     .then(data => {
       Mealdata.all = data;
       app.Mealdata.all.forEach(el => createMarker(el));
     }, err => console.error(err))
     .then(callback);
  };

  module.Mealdata = Mealdata;

})(app);
