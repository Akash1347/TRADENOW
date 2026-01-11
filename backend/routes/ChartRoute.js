const route = require('express').Router();
const { candleChart } = require('../controllers/chartController');
route.get('/:symbol' ,candleChart);

module.exports = route;