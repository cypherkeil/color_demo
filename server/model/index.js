const Sequelize = require('sequelize');
const conf = require('../config.js');

var db_config = conf.get('db');

const sequelize = new Sequelize(db_config.connection_string, {
    "define": {
        "underscored": true,
    }
});

/* Extremely simple. If we were adding functionality, we'd probably have a separate User entity. */

const SavedColors = sequelize.define('saved_colors', {
    color: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    user_email: {
        type: Sequelize.STRING,
        primaryKey: true
    }
});

// force: true will drop the table if it already exists
//sequelize.sync({ force: true })

module.exports = {
    saved_colors: SavedColors,
    sequelize: sequelize
};