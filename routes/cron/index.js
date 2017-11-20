
var express = require('express')
  , router = express.Router()
  , CronRoutes = require('./CronRoutes');

router.route('/query-daily-history-table').get(CronRoutes.createCoinDailyHistoryTable);

router.route('/query-coin-list-table').get(CronRoutes.getCoinListAndMerge);

module.exports = router;