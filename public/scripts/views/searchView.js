'use strict';

var app = app || {};

(function(module) {

  const searchView = {};

  searchView.getData = function() {
    app.Mealdata.getMealData(function() {
    });
  }

  module.searchView = searchView;

})(app);
