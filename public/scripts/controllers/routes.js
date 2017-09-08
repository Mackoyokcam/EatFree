'use strict';
var app = app || {};

page('/', app.indexController.init);
page('/about', app.aboutController.init);
page('/search/:location', app.searchController.getData);
// page('*', app.indexController.init);
page();
