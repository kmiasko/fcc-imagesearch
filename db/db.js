const Promise = require('bluebird').Promise;
const MongoDB = Promise.promisifyAll(require("mongodb"))
const MongoClient = MongoDB.MongoClient;

const config = require('../config');

if (!config.db_uri) {
  throw new Error('Set your MONGOLAB_URI in env');
}

const insertQuery = query => MongoClient.connectAsync(config.db_uri)
  .then((db) => {
    return db
      .collection('imagesearch')
      .insertAsync({ term: query, when: new Date() })
      .finally(db.close.bind(db));
  }).catch(err => console.error(err));

const returnLatestQueries = () => MongoClient.connectAsync(config.db_uri)
  .then((db) => {
    return db
      .collection('imagesearch')
      .aggregateAsync([
          { $sort: { when: -1 } },
          { $limit: 10 },
          { $project: { _id: 0, when: 1, term: 1 } }
      ])
      .finally(db.close.bind(db));
  }).catch(err => console.error(err));

module.exports = {
  insertQuery,
  returnLatestQueries
};
