'use strict';

var app = app || {};

(function(module) {

  const searchController = {};

  searchController.getData = function(ctx) {
    app.searchView.getData();
    console.log(ctx.params.location);
    if (ctx.params) {
      centerOnLocation('Seattle');
    } else {
      centerOnLocation(ctx.params.location);
    }
  }

  module.searchController = searchController;

})(app);
