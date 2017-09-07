'use strict';

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
var mainData = [
  {
    'seattle': [],
    'google': []
  }
];

// attempt to connect to the database
client.connect();
// if we don't sucessfully connect, print an error on the server
client.on('error', err => console.error(err));

app.use(express.static('./public'));

app.get('/data', proxySeattle, proxyGeocode);

function proxySeattle() {
  request
  .get('https://data.seattle.gov/resource/47rs-c243.json')
  .set('$limit', 5000)
  .set('$$app_token', `${process.env.SEATTLE_TOKEN}`)
  .end((err, res) => {
    console.log(res.body[0]);
    mainData.seattle = res.body;
    proxyGeocode(res.body);
  });
}

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
      let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${process.env.GEOCODE_TOKEN}`;
      console.log(url);
      request
      .get(url)
      .use(throttle.plugin())
      .end((err, res) => {
        if(res.body.status === 'OK') {
          console.log(res.body.results[0].geometry.location);
          mainData.google.push(res.body.results[0].geometry);
          console.log(err);
        }
      })
    } else {
      console.log(el);
    }
    console.log();
  })

  console.log(`Size: ${data.length}`);
}


// this just grabs all of the meals from the database
app.get('/meals', (request, response) => {
  client.query(`
    SELECT * FROM meals;`
  )
  .then(result => response.send(result.rows))
  .catch(console.error);
});

// this grabs a specific meal from the database
app.get('/meals/find', (request, response) => {
  let sql = `SELECT * FROM meals WHERE ${request.query.field}=$1`
  client.query(sql, [request.query.val])
  .then(result => response.send(result.rows))
  .catch(console.error);
})


// this takes a meal id and updates that row in the database
app.put('/meals/:id', (request, response) => {
  client.query(`
    UPDATE authors
    SET daytime=$1, address=$2, mealserved =$3, program=$4, people=$5,
    latitude=$6, longitude=$7,
    WHERE meal_id=$8
    `,
    [
      request.body.daytime, request.body.address, request.body.mealserved,
      request.body.program, request.body.people, request.body.latitude,
      request.body.longitude, request.body.meal_id
    ]
  )
  .then(() => response.send('Update complete'))
  .catch(console.error);
});

// for testing
// this manually adds a meal to the database
app.post('/articles', function(request, response) {
  client.query(
    `INSERT INTO meals(dayTime, address, mealserved, program, people, latitude, longitude)
    VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING`,
    [
      request.body.daytime, request.body.address, request.body.mealserved,
      request.body.program, request.body.people, request.body.latitude,
      request.body.longitude
    ],
    function(err) {
      if (err) console.error(err)
      response.send('insert complete');
    }
  )});

// loads up the database functions at the bottom of the page
loadDB();

// deploys app to the target port and sends a message to the server console
app.listen(PORT, function() {
  console.log(`My app is listening on port ${PORT} !`);
});

// database stuff //
////////////////////
// this function will load items into the database from either JSON or an array
// TODO this is NOT functional yet
function loadMeals() {
  // need to change this line to read from our array
  fs.readFile('./public/data/hackerIpsum.json', (err, fd) => {
    // need to change this line to also read from array
    JSON.parse(fd.toString()).forEach(ele => {
      client.query(`
        INSERT INTO
        meals(dayTime, address, mealserved, program, people, latitude, longitude)
        VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING`,
        [
          ele.daytime, ele.address, ele.mealserved, ele.program, ele.people,
          ele.latitude, ele.longitude
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
      daytime VARCHAR(60),
      address VARCHAR(255),
      mealserved VARCHAR(20),
      program VARCHAR(255) NOT NULL,
      people VARCHAR(255),
      latitude VARCHAR(255),
      longitude VARCHAR(255)
    );`
  )
  // TODO this will take us to load data into the database above here
  //.then(loadMeals)
  .then(console.log('load complete?'))
  .catch(console.error);
}
