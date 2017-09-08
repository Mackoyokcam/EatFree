'use strict';
var app = app || {};

page('/', app.indexController.init);
page('/search/:location', app.searchController.getData);
// page('*', app.indexController.init);
page();
