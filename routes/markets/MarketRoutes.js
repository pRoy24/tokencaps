// pRoy24 TokenPlex

var MarketConstants = require('./MarketConstants');
module.exports = {
  listMarkets: function(req, res, next) {
    res.send({"data": marketCodesList})
  }
}