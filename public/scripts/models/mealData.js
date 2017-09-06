'use strict';

var app = app || {};

(function(module) {
  const Mealdata = {};
  /*function Mealdata(dayTime, location, mealServed, nameOfProgram, peopleServed) {
    this.dayTime = dayTime;
    this.location = location;
    this.mealServed = mealServed;
    this.nameOfProgram = nameOfProgram;
    this.peopleServed = peopleServed;
  }*/

  Mealdata.all = [];

  Mealdata.getData = function(callback) {
    $.get('/data/', callback)
    .then(data => Mealdata.all = data, err => console.error(err))
    .then(callback);
  };

  module.Mealdata = Mealdata;

})(app);
