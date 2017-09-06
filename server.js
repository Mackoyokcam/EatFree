'use strict';

const express = require('express');
// const requestProxy = require('express-request-proxy');
// const nocache = require('superagent-no-cache');
const request = require('superagent');
const Throttle = require('superagent-throttle');
// const prefix = require('superagent-prefix')('/static');
const app = express();
// const request = require('request');
const PORT = process.env.PORT || 3000;

var mainData;

app.use(express.static('./public'));

app.get('/data', proxySeattle, proxyGeocode);

function proxySeattle(next) {
  request
  .get('https://data.seattle.gov/resource/47rs-c243.json')
  .set('$limit', 5000)
  .set('$$app_token', `${process.env.SEATTLE_TOKEN}`)
  .end((err, res) => {
    mainData = res.body;
    console.log(res.body[0]);
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
          console.log(err);
        }
      })
    } else {
      console.log(el);
    }
  })

  console.log(`Size: ${data.length}`);
}

app.listen(PORT, function() {
  console.log(`My app is listening on port ${PORT} !`);
});
