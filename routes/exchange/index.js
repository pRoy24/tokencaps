// pRoy24 TokenPlex

var express = require('express')
  , router = express.Router()
  , Exchange = require('./ExchangeRoutes');

router.route('/list').get(Exchange.listExchangeMetadata);

router.route('/list-metadata').get(Exchange.listExchangeMetadata);

router.route('/list-details').get(Exchange.listExchangeDetails);

router.route('/:exchangeName/markets').get(Exchange.getExchangeMarkets);

router.route('/:exchangeName/order-book').get(Exchange.getExchangeOrderBook);

router.route('/:exchangeName/history-data').get(Exchange.getExchangeHistoryData);

module.exports = router;