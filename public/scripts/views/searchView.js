'use strict';

var app = app || {};

(function(module) {

  const searchView = {};

  searchView.index = function() {
    // Return search.html
    // $('#map').show();
  }

  searchView.getData = function() {
    app.Mealdata.getMealData(function() {
      // centerOnLocation(app.Mealdata.all[0].location);
      // for(let key in app.Mealdata.all['google']) {
      //   centerOnLocation(app.Mealdata.all['google'][key]);
      // }
      console.log(`Meal array: ${app.Mealdata.all}`);
    });
  }

  module.searchView = searchView;

})(app);
