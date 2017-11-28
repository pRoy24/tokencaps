/**
proy24, TokenPlex
 */


var express = require('express')
  , router = express.Router()
  , CoinRoutes = require('./CoinRoutes');


/**
 * @api {get} /coin/coin-detail Get details of a token.
 * @apiName getCoinDetailSnapshot
 * @apiGroup Coins
 *
 * @apiParam {String} symbol Unique Coin Symbol eg. ETH.
 *
 * @apiSuccess {Json} Coin detail object.
 * @apiError {String} Server error String.
 */

router.route('/coin-detail').get(CoinRoutes.getCoinDetailSnapshot);

router.route('/get-coin-detail').get(CoinRoutes.getCoinDetailSnapshot);

/**
 * @api {get} /coin/coin-list Get list of tokens.
 * @apiName getCoinList
 * @apiGroup Coins
 *
 * @apiParam {Number} range Range of coins to get
 *
 * @apiSuccess {Array} Coin List Array.
 * @apiError {String} Server error String.
 */
router.route('/coin-list').get(CoinRoutes.getCoinList);

router.route('/get-coin-list').get(CoinRoutes.getCoinList);


router.route('/coin-day-history').get(CoinRoutes.getCoinDailyData);


router.route('/coin-week-history').get(CoinRoutes.getCoinWeekData);

router.route('/search').get(CoinRoutes.searchCoinByName);

router.route('/save-coin-list').get(CoinRoutes.saveCoinListToCache);

router.route('/get-cache-list').get(CoinRoutes.fetchCoinListFromCache);

router.route('/delete-coin-list').delete(CoinRoutes.deleteCoinList);

module.exports = router;