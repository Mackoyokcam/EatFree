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
    if (ctx.params.location === '') {
      centerOnLocation('Seattle');
    } else {
      centerOnLocation(ctx.params.location);
    }
  }

  module.searchController = searchController;

})(app);
