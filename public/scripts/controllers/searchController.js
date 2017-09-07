'use strict';

var app = app || {};

(function(module) {

  const searchController = {};

  searchController.index = function() {
    app.searchView.index();
  }

  searchController.getData = function(ctx) {
    app.searchView.getData();
    searchController.index();
    console.log(ctx.params.location);
    if (ctx) {
      centerOnLocation(ctx.params.location);
    } else {
      centerOnLocation('Seattle');
    }
  }

  module.searchController = searchController;

})(app);
