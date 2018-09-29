const app = require('./app');

let models = app.get('models');

console.log("Syncing database models ...");
module.exports = models.sequelize.sync({ force: true })
    .then(() => {

        console.log("Database models synced.");

        return app.listen(3003, () => console.log('App listening on port 3003!'));
    });