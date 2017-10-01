/**
 Copyright Church of Crypto, Baron Nashor
 */


var express = require('express')
  , router = express.Router()
  , CoinDetail = require('./CoinDetail');
router.route('/get-coin-detail').get(CoinDetail.getCoinDetailSnapshot)
router.route('/get-coin-list').get(CoinDetail.getCoinList)
router.route('/daily-coin-history').get(CoinDetail.getCoinDailyData)


module.exports = router;