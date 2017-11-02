
var express = require('express')
  , router = express.Router()
  , CronRoutes = require('./CronRoutes');

router.route('/create-week-history-table').get(CronRoutes.createCoinDailyHistoryTable)

module.exports = router;