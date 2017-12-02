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
 * @apiParam {String} symbol Unique Coin Symbol eg. ETH.
 * @apiSuccess {Json} Coin detail object.
 * @apiError {String} Server error String.
 */

router.route('/coin-detail').get(CoinRoutes.getCoinDetailSnapshot);

/**
 * @api {get} /coin/coin-list Get list of tokens.
 * @apiName getCoinList
 * @apiGroup Coins
 * @apiParam {Number} range Range of coins to get
 * @apiSuccess {Array} Coin List Array.
 * @apiError {String} Server error String.
 */
router.route('/coin-list').get(CoinRoutes.getCoinList);

/**
 * @api {get} /coin/coin-day-history Get daily history of coin with given symbol
 * @apiName getCoinList
 * @apiGroup Coins
 * @apiParam {Number} range Range of coins to get
 * @apiSuccess {Array} Coin List Array.
 * @apiError {String} Server error String.
 */
router.route('/coin-day-history').get(CoinRoutes.getCoinDailyData);

/**
 * @api {get} /coin/coin-week-history Get week history data for coin with given symbol
 * @apiName getCoinList
 * @apiGroup Coins
 * @apiParam {Number} range Range of coins to get
 * @apiSuccess {Array} Coin List Array.
 * @apiError {String} Server error String.
 */
router.route('/coin-week-history').get(CoinRoutes.getCoinWeekData);

/**
 * @api {get} /coin/coin-list Search for a coin by name or symbol.
 * @apiName getCoinList
 * @apiGroup Coins
 * @apiParam {String} range Range of coins to get
 * @apiSuccess {Array} Array of coins with regex approx match for given input.
 * @apiError {String} Server error String.
 */
router.route('/search').get(CoinRoutes.searchCoinByName);

/**
 *
 */
router.route('/save-coin-list').get(CoinRoutes.saveCoinListToCache);

/**
 * @api {delete} /coin/delete-coin-list Get list of tokens.
 * @apiName getCoinList
 * @apiGroup Coins
 * @apiSuccess {Array} Coin List Array.
 * @apiError {String} Server error String.
 */
router.route('/delete-coin-list').delete(CoinRoutes.deleteCoinList);


// Legacy routes, to be deprecated
router.route('/get-coin-detail').get(CoinRoutes.getCoinDetailSnapshot);

router.route('/get-coin-list').get(CoinRoutes.getCoinList);

module.exports = router;