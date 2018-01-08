// pRoy24 TokenPlex

const ExchangeModels = require('../../models/ExchangeModels');
const DiskStorage = require('../../models/DiskStorage');
const MarketUtils = require('../../utils/MarketUtils');
var ObjectUtils = require('../../utils/ObjectUtils');
const url = require('url');

module.exports = {

  listExchangeMetadata: function(req, res, next) {
    ExchangeModels.listExchangeMetadata().then(function(marketMetadata){
      let formattedMarketMetadata = marketMetadata.filter(function(item){
        return ObjectUtils.isNonEmptyObject(item);
      })
      res.send({data: formattedMarketMetadata});
    });
  },

  listExchangeDetails: function(req, res, next) {
    ExchangeModels.getExchangeDetailsList().then(function(exchangeDetailResponse){
      let filteredData = exchangeDetailResponse.filter(function(item){
        if (ObjectUtils.isNonEmptyObject(item) && ObjectUtils.isNonEmptyArray(item[Object.keys(item)[0]])) {
          return item;
        }
      });
      res.send({data: filteredData});
    }).catch(function(err){
      res.send({error: err});
    });
  },

  getExchangeMarkets: function(req, res, next) {
    const marketCode = req.url.split("/markets")[0].split("/")[1].toLowerCase();
    ExchangeModels.getMarketsForExchange(marketCode).then(function(marketListForExchangeResponse){
      res.send({data: marketListForExchangeResponse});
    });
  },

  // Get current open orders for exchange
  getExchangeOrderBook: function(req, res, next) {
    const marketCode = MarketUtils.fetchMarketCodeFromQuery(req.url);
    const base = req.query.base;
    const quote = req.query.quote;
    return ExchangeModels.getExchangeOrderbook(marketCode, base, quote).then(function(exchangeOrderbookResponse){
      res.send({data: exchangeOrderbookResponse});
    });
  },

  //History Data Controllers
  getExchangeHistoryData: function(req, res, next) {
    const marketCode = MarketUtils.fetchMarketCodeFromQuery(req.url);
    const base = req.query.base;
    const quote = req.query.quote;
    let sampleQuery = req.query.rate;

    let rate = "1h";
    if (sampleQuery === "min") {
      rate = "1m";
    } else if (sampleQuery === "hour") {
      rate = "1h";
    } else {
      rate = "1d";
    }
    ExchangeModels.getExchangeHistoryData(marketCode, base, quote, rate).then(function(exchangeModelResponse){
      res.send({data: exchangeModelResponse});
    });
  }

}