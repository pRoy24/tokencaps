/**
proy24, TokenPlex
 */


var express = require('express')
  , router = express.Router()
  , CoinRoutes = require('./CoinRoutes');


router.route('/get-coin-detail').get(CoinRoutes.getCoinDetailSnapshot);

router.route('/get-coin-list').get(CoinRoutes.getCoinList);

router.route('/coin-day-history').get(CoinRoutes.getCoinDailyData);

router.route('/coin-week-history').get(CoinRoutes.getCoinWeekData);

router.route('/search').get(CoinRoutes.searchCoinByName);

router.route('/save-coin-list').get(CoinRoutes.saveCoinListToCache);

router.route('/get-cache-list').get(CoinRoutes.fetchCoinListFromCache);

router.route('/delete-coin-list').delete(CoinRoutes.deleteCoinList);

module.exports = router;