'use strict';

var app = app || {};

(function(module) {
function Mealdata(dayTime, location, mealServed, nameOfProgram, peopleServed) {
  this.dayTime = dayTime;
  this.location = location;
  this.mealServed = mealServed;
  this.nameOfProgram = nameOfProgram;
  this.peopleServed = peopleServed;
}

Mealdata.all = [];

Mealdata.getData = function(callback) {
  $.get('/data', callback); //talk to george about that
};


module.Mealdata = Mealdata;

})(app);
