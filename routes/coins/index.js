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
 * @apiParam {String} from_symbol symbol of the coin you wish to fetch
 * @apiParam {String} to_symbol=USD symbol of the pairing currency
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
 * @api {get} /coin/search Search for a coin by name or symbol.
 * @apiName searchCoinByName
 * @apiGroup Tokens
 * @apiParam {String} coin_symbol Name of Symbol Regex Match for the coin
 * @apiSuccess {Array} Array of coins with regex approx match for given input.
 * @apiError {String} Server error String.
 */
router.route('/search').get(CoinRoutes.searchCoinByName);

/**
 * @api {get} /coin/coin-social Get Github, Reddit, Twitter, Facebook data points for a token.
 * @apiName getCoinSocialAndHeartbeat
 * @apiGroup Tokens
 * @apiParam {String} coin_symbol Symbol of the coin to get social data for.
 * @apiSuccess {Array} Array of coins with regex approx match for given input.
 * @apiError {String} Server error String.
 */
router.route('/coin-social').get(CoinRoutes.getCoinSocialAndHeartbeat);

/**
 * @api {get} /coin/coin-arbitrage Get coin detail and arbitrage data across exchanges.
 * @apiName getCoinArbitrage
 * @apiGroup Tokens
 * @apiParam {String} from_symbol symbol of the coin you wish to fetch
 * @apiParam {String} to_symbol=USD symbol of the pairing currency
 * @apiSuccess {Object} Data object containing exchange array and details object
 * @apiError {String} Server error String.
 */
router.route('/coin-arbitrage').get(CoinRoutes.getCoinArbitrage);

/**
 * @api {get} /coin/coin-day-history Get daily history of coin with given symbol
 * @apiName getCoinDailyData
 * @apiGroup Tokens
 * @apiParam {String} from_symbol symbol of the coin you wish to fetch
 * @apiParam {String} to_symbol=USD symbol of the pairing currency
 * @apiSuccess {Array} Coin Daily ticker data aggregated hourly
 * @apiError {String} Server error String.
 */
router.route('/coin-day-history').get(CoinRoutes.getCoinDailyData);

/**
 * @api {get} /coin/coin-week-history Get week history data for coin with given symbol aggregated per minute
 * @apiName getCoinWeekData
 * @apiGroup Tokens
 * @apiParam {String} from_symbol symbol of the coin you wish to fetch
 * @apiParam {String} to_symbol=USD symbol of the pairing currency
 * @apiSuccess {Array} Coin Weekly ticker data aggregated minutely.
 * @apiError {String} Server error String.
 */
router.route('/coin-week-history').get(CoinRoutes.getCoinWeekData);

/**
 * @api {get} /coin/coin-year-history Get yearly history data for coin with given symbol aggregated per day
 * @apiName getCoinYearData
 * @apiGroup Tokens
 * @apiParam {String} from_symbol symbol of the coin you wish to fetch
 * @apiParam {String} to_symbol=USD symbol of the pairing currency
 * @apiSuccess {Array} Coin Yearly ticker data aggregated daily.
 * @apiError {String} Server error String.
 */
router.route('/coin-year-history').get(CoinRoutes.getCoinYearData);

/**
 * @api {get} /coin/coin-trade-quote Get list of currencies the coin trades against.
 */



router.route('/save-coin-list').get(CoinRoutes.saveCoinListToCache);

router.route('/delete-coin-list').delete(CoinRoutes.deleteCoinList);




// Legacy routes, to be deprecated
router.route('/get-coin-detail').get(CoinRoutes.getCoinDetailSnapshot);

router.route('/get-coin-list').get(CoinRoutes.getCoinList);

router.route('/:coinID/exchanges').get(CoinRoutes.getCoinExchanges);

module.exports = router;