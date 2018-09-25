const express = require('express');
const app = express();

var body_parser = require('body-parser');

const conf = require('./config.js').get();
const models = require('./model');

app.use(body_parser.json());

var routes = require('./routes');
app.use('/', routes);

console.log("Syncing database models ...");
models.sequelize.sync({ force: true })
    .then(() => {

        console.log("Database models synced.");
        app.set('models', models);

        return app.listen(3003, () => console.log('App listening on port 3003!'));
    });
