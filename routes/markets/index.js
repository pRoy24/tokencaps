// pRoy24 TokenPlex

// pRoy24 TokenPlex

var express = require('express')
  , router = express.Router()
  , Market = require('./MarketRoutes');


router.route('/market-list').post(Market.listMarkets);



module.exports = router;