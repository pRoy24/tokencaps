// pRoy24 TokenPlex

var express = require('express')
  , router = express.Router()
  , Exchange = require('./ExchangeRoutes');

/**
 * @api {get} /list Get list of all supported exchanges
 * @apiName listExchangeMetadata
 * @apiGroup Exchange
 * @apiSuccess {String} Exchange List Array
 * @apiError {String} Server error String.
 */
router.route('/list').get(Exchange.listExchangeMetadata);

router.route('/list-metadata').get(Exchange.listExchangeMetadata);

/**
 * @api {get} /list-details Get list of details for each exchange keyed by market
 * @apiName listExchangeDetails
 * @apiGroup Exchange
 * @apiSuccess {String} Exchange List Array
 * @apiError {String} Server error String
 */
router.route('/list-details').get(Exchange.listExchangeDetails);

/**
 * @api {get} /list Get list markets for given exchange
 * @apiName getExchangeMarkets
 * @apiGroup Exchange
 * @apiSuccess {String} Market List Array keyed by Base token
 * @apiError {String} Server error String.
 */
router.route('/:exchangeName/markets').get(Exchange.getExchangeMarkets);

/**
 * @api {get} /list Get list of all supported exchanges
 * @apiName getExchangeOrderBook
 * @apiGroup Exchange
 * @apiSuccess {String} Exchange Order-book array
 * @apiError {String} Server error String.
 */
router.route('/:exchangeName/order-book').get(Exchange.getExchangeOrderBook);

/**
 * @api {get} /list Get list of all supported exchanges
 * @apiName getExchangeHistoryData
 * @apiGroup Exchange
 * @apiSuccess {String} Exchange History data array
 * @apiError {String} Server error String.
 */
router.route('/:exchangeName/history-data').get(Exchange.getExchangeHistoryData);

module.exports = router;