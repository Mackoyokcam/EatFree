'use strict';

var app = app || {};

(function(module) {

  const indexController = {};

  indexController.init = function() {
    $('#form').on('submit', function(e) {
      e.preventDefault();

      $('body, html').animate({
        scrollTop: $('#map').offset().top
      }, 600);

      let input = $('input[name="location"]',this).val();
      page(`/search/${input}`);
    })
  }

  module.indexController = indexController;

})(app);
