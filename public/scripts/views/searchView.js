'use strict';

var app = app || {};

(function(module) {

  const searchView = {};

  searchView.index = function() {
    $('#map').show();
  }

  searchView.getData = function() {
    app.Mealdata.getMealData(function() {
      // console.log(`Meal array: ${app.Mealdata.all}`);
    });
  }

  module.searchView = searchView;

})(app);
