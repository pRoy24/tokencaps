
var express = require('express')
  , router = express.Router()
  , CronRoutes = require('./CronRoutes');

/**
 * @api {get} /cron/query-daily-history-table Run timed query for coin day data and generate graph.
 * @apiName getCoinDayGraph
 * @apiGroup Cron Request
 * @apiParam {String} App Secret Key
 * @apiSuccess {String} Success Message String.
 * @apiError {String} Server error String.
 */
router.route('/query-daily-history-table').get(CronRoutes.getCoinDayGraph);

/**
 * @api {get} /cron/query-coin-list-table Start Coin List query and save coin ticker array to Redis server.
 * @apiName getCoinListAndMerge
 * @apiGroup Cron Request
 * @apiParam {String} App Secret Key
 * @apiSuccess {String} Success Message String.
 * @apiError {String} Server error String.
 */
router.route('/query-coin-list-table').get(CronRoutes.getCoinListAndMerge);

module.exports = router;