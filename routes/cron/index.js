
var express = require('express')
  , router = express.Router()
  , CronRoutes = require('./CronRoutes');

router.route('/create-daily-history-table').get(CronRoutes.createCoinDailyHistoryTable)

module.exports = router;