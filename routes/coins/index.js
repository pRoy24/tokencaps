/**
 proy24, TokenPlex
 */


var express = require('express')
  , router = express.Router()
  , CoinRoutes = require('./CoinRoutes');


/**
 * @api {get} /coin/coin-detail Get details of a token.
 * @apiName getCoinDetailSnapshot
 * @apiGroup Tokens
 * @apiParam {String, String} from_symbol, to_symbol Unique To and From Coin Symbol eg. ETH.
 * @apiSuccess {Json} Coin detail object.
 * @apiError {String} Server error String.
 */

router.route('/coin-detail').get(CoinRoutes.getCoinDetailSnapshot);

/**
 * @api {get} /coin/coin-list Get list of tokens.
 * @apiName getCoinList
 * @apiGroup Tokens
 * @apiParam {Number} range Range of coins to get
 * @apiSuccess {Array} Coin List Array.
 * @apiError {String} Server error String.
 */
router.route('/coin-list').get(CoinRoutes.getCoinList);

/**
 * @api {get} /coin/coin-day-history Get daily history of coin with given symbol
 * @apiName getCoinDailyData
 * @apiGroup Tokens
 * @apiParam {String} coin_symbol symbol of the coin to get
 * @apiSuccess {Array} Coin Daily ticker data aggregated hourly
 * @apiError {String} Server error String.
 */
router.route('/coin-day-history').get(CoinRoutes.getCoinDailyData);

/**
 * @api {get} /coin/coin-week-history Get week history data for coin with given symbol
 * @apiName getCoinWeekData
 * @apiGroup Tokens
 * @apiParam {String} coin_symbol symbol of the coin to get
 * @apiSuccess {Array} Coin Weekly ticker data aggregated minutely.
 * @apiError {String} Server error String.
 */
router.route('/coin-week-history').get(CoinRoutes.getCoinWeekData);

/**
 * @api {get} /coin/search Search for a coin by name or symbol.
 * @apiName searchCoinByName
 * @apiGroup Tokens
 * @apiParam {String} coin_symbol Name of Symbol Regex Match for the coin
 * @apiSuccess {Array} Array of coins with regex approx match for given input.
 * @apiError {String} Server error String.
 */
router.route('/search').get(CoinRoutes.searchCoinByName);

router.route('/coin-social').get(CoinRoutes.getCoinSocialAndHeartbeat);

router.route('/coin-arbitrage').get(CoinRoutes.getCoinArbitrage);

/**
 *
 */
router.route('/coin-year-history').get(CoinRoutes.getCoinYearData);

/**
 *
 */
router.route('/save-coin-list').get(CoinRoutes.saveCoinListToCache);

router.route('/delete-coin-list').delete(CoinRoutes.deleteCoinList);


// Legacy routes, to be deprecated
router.route('/get-coin-detail').get(CoinRoutes.getCoinDetailSnapshot);

router.route('/get-coin-list').get(CoinRoutes.getCoinList);

module.exports = router;