'use strict';

const express = require('express');
const requestProxy = require('express-request-proxy');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('./public'));

app.listen(PORT, function() {
  console.log(`My app is listening on port ${PORT} !`);
});
