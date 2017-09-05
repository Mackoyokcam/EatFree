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
    console.log(ctx);
    centerOnLocation(ctx.params.location);
  }

  module.searchController = searchController;

})(app);
