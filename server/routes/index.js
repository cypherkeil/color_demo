var express = require('express');
var router = express.Router();
var path = require('path')

router.use('/', express.static(path.resolve('./client/build')))
//router.get('/', (req, res) => res.send('Hello World!'));

var color_routes = require('./color');
router.use('/', color_routes);

module.exports = router;