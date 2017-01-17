const express = require('express');
const app = express();
const Promise = require('bluebird').Promise;
const MongoDB = Promise.promisifyAll(require("mongodb"))

const config = require('./config');
const api = require('./api/bing');

if (!config.db_uri) {
  throw new Error('Set your MONGOLAB_URI in env');
}

api.makeRequest('koty')
  .then(data => console.log(data))
  .catch(err => console.error(err));

app.get('/', (req, res) => res.end());

app.listen(process.env.PORT || 8080);
