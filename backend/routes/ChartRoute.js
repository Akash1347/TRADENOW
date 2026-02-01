const route = require('express').Router();
const { candleChart } = require('../controllers/ChartController');
route.get('/:symbol' ,candleChart);

module.exports = route;