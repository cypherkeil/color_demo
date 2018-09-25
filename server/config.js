const nconf = require('nconf');
const path = require('path');

nconf.file(path.resolve('config.json'));

module.exports = nconf;