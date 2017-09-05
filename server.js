'use strict';

const express = require('express');
const requestProxy = require('express-request-proxy');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('./public'));

app.get('/data/*', proxySeattle);
function proxySeattle(request, response){
  (requestProxy({
    url: 'https://data.seattle.gov/resource/47rs-c243.json',
    headers: {
      '$limit' : 5000,
      '$$app_token' : '${process.env.SEATTLE_TOKEN}'}
  }))(request, response);
}

app.listen(PORT, function() {
  console.log(`My app is listening on port ${PORT} !`);
});
