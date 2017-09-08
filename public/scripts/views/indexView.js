'use strict';

// Hamburger menu handler
$('.icon-menu').on('click', function(){
  $('nav').toggleClass('show');
  $('.menuLines').toggleClass('changeColor');
});
