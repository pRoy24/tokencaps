// pRoy24 TokenPlex

const MarketConstants = require('./MarketConstants');

module.exports = {
  listMarkets: function(req, res, next) {
    res.send({"data": marketCodesList})
  }
}