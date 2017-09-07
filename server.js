'use strict';

const fs = require('fs');
const pg = require('pg');
const express = require('express');
const request = require('superagent');
const Throttle = require('superagent-throttle');
const app = express();
const PORT = process.env.PORT || 3000;
// connection string to connect to the database locally or deployed
const conString = process.env.DATABASE_URL || 'postgres://postgres:kilovoltdb@localhost:5432/eatfreeseattle';
// create a client variable to connect to the server in our con string above
const client = new pg.Client(conString);

// attempt to connect to the database
client.connect();
// if we don't sucessfully connect, print an error on the server
client.on('error', err => console.error(err));

app.use(express.static('./public'));

// Change this to an interval that invokes daily.
app.get('/data', proxySeattle, proxyGeocode);

function proxySeattle() {
  clearTable();
  request
  .get('https://data.seattle.gov/resource/47rs-c243.json')
  .set('$limit', 5000)
  .set('$$app_token', `${process.env.SEATTLE_TOKEN}`)
  .end((err, res) => {
    proxyGeocode(res.body);
  });
}

// Convert location to lat/long and add to dataset
function proxyGeocode(data) {
  // Sets throttle options for when we call geocode api.
  let throttle = new Throttle({
    active: true,     // set false to pause queu
    rate: 50,          // how many requests can be sent every `ratePer`
    ratePer: 1000,   // number of ms in which `rate` requests may be sent
    concurrent: 1     // how many requests can be sent concurrently
  })

  // Get geocode location per address from seattle API
  data.forEach(el => {
    if (el.location) {
      let location = el.location.replace(/\s+/g, '+');
      let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${process.env.GEOCODE_TOKEN}&sensor=false`;
      request
      .get(url)
      .use(throttle.plugin())
      .end((err, res) => {
        if(res.body.status === 'OK') {
          el.location = res.body.results[0].formatted_address;
          el.latitude = res.body.results[0].geometry.location.lat;
          el.longitude = res.body.results[0].geometry.location.lng;
          loadMeal(el);
        } else {
          console.log(res.body.status);
        }
      })
    } else {
      console.log(el);
    }
  })
  console.log(`Size: ${data.length}`);
}

// this just grabs all of the meals from the database
app.get('/meals', (request, response) => {
  client.query(`
    SELECT * FROM meals;`
  )
  .then(result => {
    console.log(result.rows);
    response.send(result.rows);
  })
  .catch(console.error);
});

// this grabs a specific meal from the database
app.get('/meals/find', (request, response) => {
  let sql = `SELECT * FROM meals WHERE ${request.query.field}=$1`
  client.query(sql, [request.query.val])
  .then(result => response.send(result.rows))
  .catch(console.error);
})

<<<<<<< HEAD

// this takes a meal id and updates that row in the database
app.put('/meals/:id', (request, response) => {
  client.query(`
    UPDATE meals
    SET day_time=$1, location=$2, meal_served =$3, name_of_program=$4, people_served=$5,
    latitude=$6, longitude=$7,
    WHERE meal_id=$8
    `,
    [
      request.body.day_time, request.body.location, request.body.meal_served,
      request.body.name_of_program, request.body.people_served, request.body.latitude,
      request.body.longitude, request.body.meal_id
    ]
  )
  .then(() => response.send('Update complete'))
  .catch(console.error);
});

// for testing
// this manually adds a meal to the database
app.post('/meals', function(request, response) {
  client.query(
    `INSERT INTO meals(day_time, location, meal_served, name_of_program, people_served, latitude, longitude)
    VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING`,
    [
      request.body.day_time, request.body.location, request.body.meal_served,
      request.body.name_of_program, request.body.people_served, request.body.latitude,
      request.body.longitude
    ],
    function(err) {
      if (err) console.error(err)
      response.send('insert complete');
    }
  )});

  app.delete('/meals', (request, response) => {
    client.query('DELETE FROM meals')
    .then(() => response.send('Delete complete'))
    .catch(console.error);
  });

=======
>>>>>>> 86336dc37bec9324c3fbca1092c1745c7e6e440c
// loads up the database functions at the bottom of the page
loadDB();

// deploys app to the target port and sends a message to the server console
app.listen(PORT, function() {
  console.log(`My app is listening on port ${PORT} !`);
});

// database stuff //
////////////////////
// Clear table
function clearTable() {
  client.query('DELETE FROM meals').then(console.log('Cleared Tables'))
  .catch(console.error);
}

// Load single meal
function loadMeal(ele) {
  console.log('Meal added?');
  client.query(`
    INSERT INTO
    meals(day_time, location, meal_served, name_of_program, people_served, latitude, longitude)
    VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING`,
    [
      ele.day_time,
      ele.location,
      ele.meal_served,
      ele.name_of_program,
      ele.people_served,
      ele.latitude,
      ele.longitude
    ]
  )
  .catch(console.error);
}
// this function will load items into the database from either JSON or an array
// TODO this is still a work in progress
function loadMeals() {
  // need to change this once json is merged
  fs.readFile('./public/data/mealdata.json', (err, fd) => {
    JSON.parse(fd.toString()).forEach(ele => {
      client.query(`
        INSERT INTO
        meals(day_time, location, meal_served, name_of_program, people_served, latitude, longitude)
        VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING`,
        [
          ele.day_time,
          ele.location,
          ele.meal_served,
          ele.name_of_program,
          ele.people_served,
          ele.latitude,
          ele.longitude
        ]
      )
      .catch(console.error);
    })
  })
}

// this function creates the database table (if needed) and loads it from our data
function loadDB() {
  client.query(`
    CREATE TABLE IF NOT EXISTS
    meals (
      meal_id SERIAL PRIMARY KEY,
      day_time VARCHAR(255),
      location VARCHAR(255),
      meal_served VARCHAR(255),
      name_of_program VARCHAR(255) NOT NULL,
      people_served VARCHAR(255),
      latitude VARCHAR(255),
      longitude VARCHAR(255)
    );`
  )
  // TODO this will take us to load data into the database above here
  .then(loadMeals)
  .then(console.log('load complete?'))
  .catch(console.error);
}
