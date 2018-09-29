const express = require('express');
const app = express();

var body_parser = require('body-parser');

const conf = require('./config.js').get();
const models = require('./model');

app.use(body_parser.json());

var routes = require('./routes');
app.use('/', routes);

// set models on app so it can be retrieved in other places
app.set('models', models);

module.exports = app;