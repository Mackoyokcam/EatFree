'use strict';

var app = app || {};

(function(module) {

  const searchView = {};

  searchView.index = function() {
    // Return search.html
    $('#map').show();
  }

  searchView.getData = function() {
    app.Mealdata.getMealData();
  }

  module.searchView = searchView;

})(app);
