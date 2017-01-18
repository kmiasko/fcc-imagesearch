const express = require('express');
const app = express();
const config = require('./config');
const api = require('./api/bing');
const db = require('./db');

if (!config.db_uri) {
  throw new Error('Set your MONGOLAB_URI in env');
}

app.get('/api/imagesearch/:query', (req, res) => {
  const offset = req.query.offset || 0;
  const query = req.params.query;

  db.insertQuery(query);

  api.makeRequest(query, offset)
    .then(data => {
      res.send(JSON.stringify(data));
      res.end();
    }).catch(err => {
      res.end();
      console.err(err)
    });
});

app.get('/api/latest/imagesearch/', (req, res) => {
  db.returnLatestQueries()
    .then((data) => {
      res.send(JSON.stringify(data));
      res.end();
    }).catch(err => console.error(err));
});

app.get('*', (req, res) => {
  res.send('404');
  res.end();
});

app.listen(process.env.PORT || 8080);
