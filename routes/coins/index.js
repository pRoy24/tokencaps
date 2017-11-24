/**
 Copyright Church of Crypto, Baron Nashor
 */


var express = require('express')
  , router = express.Router()
  , CoinDetail = require('./CoinDetail');


router.route('/get-coin-detail').get(CoinDetail.getCoinDetailSnapshot);
router.route('/get-coin-list').get(CoinDetail.getCoinList);
router.route('/coin-day-history').get(CoinDetail.getCoinDailyData);
router.route('/coin-week-history').get(CoinDetail.getCoinWeekData);
router.route('/search').get(CoinDetail.searchCoinByName);

router.route('/save-coin-list').get(CoinDetail.saveCoinListToCache);
router.route('/get-cache-list').get(CoinDetail.fetchCoinListFromCache);


router.route('/delete-coin-list').delete(CoinDetail.deleteCoinList);

module.exports = router;