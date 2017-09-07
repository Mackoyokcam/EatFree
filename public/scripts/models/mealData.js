'use strict';

var app = app || {};

(function(module) {
  const Mealdata = {};
  Mealdata.all = [];

  Mealdata.getMealData = function(callback) {
    // Request meal data from server
    $.get('/meals')
     .then(data => {
      //  console.log(`Response data: ${data}`);
       Mealdata.all = data;
     }, err => console.error(err))
     .then(callback);
  };

  module.Mealdata = Mealdata;

})(app);
