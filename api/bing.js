const axios = require('axios');
const _ = require('lodash');
const querystring = require('querystring');
const config = require('../config');

if (!config.api_key) {
  throw new Error('You must set BING_API_KEY in your env');
}

axios.defaults.baseURL = config.api_url;
axios.defaults.headers.common = {
  'Ocp-Apim-Subscription-Key': config.api_key
};

const parseQueryString = (str, returnKey) => {
  const parsed = querystring.parse(str);
  return parsed[returnKey];
}

const transformResponse = (response) => {
  return _.map(_.get(response, 'data.value'), item => ({
    context: parseQueryString(item.hostPageUrl, 'r'),
    url: parseQueryString(item.contentUrl, 'r'),
    alt: item.name
  }));
};


const makeRequest = (query, offset = 0) => {
  return axios.get('/', {
    params: {
      q: query,
      count: config.per_page,
      offset
    }
  })
  .then(response => {
    return transformResponse(response);
  });
}

module.exports = {
  makeRequest
};
