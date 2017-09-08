'use strict';

var app = app || {};

(function(module) {

  const aboutController = {};

  aboutController.init = function() {
    $('#form').on('submit', function(e) {
      e.preventDefault();

      let input = $('input[name="location"]',this).val();
      page(`/search/${input}`);
    })
  }

  module.aboutController = aboutController;

})(app);
