'use strict';

var app = app || {};

(function(module) {

  const searchView = {};

  searchView.index = function() {
    $('#map').show();
  }

  searchView.getData = function() {
    app.Mealdata.getMealData(function() {
    });
  }

  module.searchView = searchView;

})(app);
