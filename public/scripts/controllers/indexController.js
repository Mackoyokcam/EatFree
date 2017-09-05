'use strict';

var app = app || {};

(function(module) {

  const indexController = {};

  indexController.init = function() {
    $('#form').on('submit', function(e) {
      e.preventDefault();
      let input = $('input[name="location"]',this).val();
      // $.get(`/search/${$('#form').serialize()}`);  send to server
      page(`/search/${input}`);
    })
  }

  module.indexController = indexController;

})(app);
