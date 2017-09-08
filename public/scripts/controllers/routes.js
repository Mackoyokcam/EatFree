'use strict';
var app = app || {};

page('/', app.indexController.init);
page('/search', app.searchController.getData)
page('/search/:location', app.searchController.getData);
page();
