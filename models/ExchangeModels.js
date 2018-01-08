// pRoy24 TokenPlex
const APIStorage = require('./APIStorage');
const DiskStorage = require('./DiskStorage');
const ccxt = require('ccxt');

const markets = require('./APIStorage/Exchange/ExchangeConstants');
const ObjectUtils = require('../utils/ObjectUtils');
const logger = require('../logs/logger');
var MarketUtils = require('../utils/MarketUtils');

module.exports = {
  getExchangeDetailsList: function() {
    var actions = ccxt.exchanges.map(getExchangeDetails);
    var results = Promise.all(actions); // pass array of promises
    return results.then(function(response){
      return response;
    });
  },

  /**
   * Method returns all the markets for the exchange keyed by base
   * eg. ["eth" :[{base: "1000", "quote": "1000", ...}, {}, ...], "btc": {}]
   * @param exchangeName
   */
  getMarketsForExchange: function(exchangeName) {
    return DiskStorage.getExchangeDetails(exchangeName).then(function(exchangeMarketList){
      if (ObjectUtils.isNonEmptyObject(exchangeMarketList)) {
        // Check if refresh required. Current Expiry Values support 10 Second TTL
        if (DiskStorage.hasExchangeDetailsExpired(exchangeName)) {
          APIStorage.getMarketsForExchange(exchangeName).then(function(exchangeMarketAPIList) {
            let exchangeDetailObject = {};
            let normalizedExchangeList = MarketUtils.getExchangeListKeyedByBaseToken(exchangeMarketAPIList);
            exchangeDetailObject[exchangeName] = normalizedExchangeList;
            DiskStorage.saveExchangeDetails(exchangeDetailObject);
          });
        }
        return exchangeMarketList[Object.keys(exchangeMarketList)[0]];
      } else {
        return APIStorage.getMarketsForExchange(exchangeName).then(function(exchangeMarketAPIList){
          let exchangeDetailObject = {};
          let normalizedExchangeList = MarketUtils.getExchangeListKeyedByBaseToken(exchangeMarketAPIList);
          exchangeDetailObject[exchangeName] = normalizedExchangeList;
          DiskStorage.saveExchangeDetails(exchangeDetailObject);
          let returnVal = MarketUtils.getExchangeListKeyedByBaseToken(exchangeMarketAPIList);
          return returnVal;
        });
      }
    });
  },



  listExchangeMetadata: function() {
    var actions = ccxt.exchanges.map(getExchangeMetadata);
    var results = Promise.all(actions); // pass array of promises
    return results.then(function(response){
      return response;
    }).catch(function(err){
      return err;
    });
  },


  getMarketListByToken: function() {
    let exchangeList = [];
    ccxt.exchanges.forEach(function(exchange, exIdx){
      try {
        let currentExchange = markets.getExchangeInstance(exchange);
        if (ObjectUtils.isNonEmptyObject(currentExchange)) {
          return APIStorage.getMarketActiveExchanges(currentExchange, exchange).then(function (marketsListInExchange) {
            exchangeList = exchangeList.concat(marketsListInExchange.data);
        //    return exchangeList;
          }).catch(function (err) {
            logger.log({"level": "error", "message": err});
          });
        } else {
       //   return [];
        }
      } catch (e) {
        logger.log({"level": "error", "message": e});
      }
    });
    return new Promise(resolve => {
      setTimeout(() => {
        let normalizedExchangeList = MarketUtils.groupCoinByMarketMaps(exchangeList);
        resolve(normalizedExchangeList);
      }, 12000);
    });
  },

  getMarketsForToken: function(baseToken) {
    return DiskStorage.findExchangesForToken(baseToken).then(function(marketTokenResponse){
      if (marketTokenResponse && marketTokenResponse.rows.length > 0) {
        return marketTokenResponse;
      } else {
        return APIStorage.findExchangesForToken(baseToken).then(function(apiTokenExchangeResponse){
          return apiTokenExchangeResponse;
        });
      }
    });
  },


  getMarketTrades: function(baseToken, quoteToken) {
    return DiskStorage.getMarketTrades(baseToken, quoteToken).then(function(marketTradeResponse){
      if (ObjectUtils.isNonEmptyArray(marketTradeResponse)) {
        return marketTradeResponse;
      } else {
        getMarketsForToken(baseToken).then(function(tokenMarketList){
          Object.keys(tokenMarketList.market).forEach(function(marketName){
            let currentMarketItem = markets.getExchangeInstance(marketName);
            currentMarketItem.loadMarkets().then(function(loadMarketResponse){
               currentMarketItem.fetchTickers().then(function(fetchTickerResponse){
                 Object.keys(fetchTickerResponse).forEach(function(tickerCode){
                   if (currentMarketItem.hasFetchTrades) {
                     currentMarketItem.fetchTrades(tickerCode).then(function(tradeResponse){

                     });
                   }
                 });
               });
            }).catch(function(err){
           //   console.log("error");
            });
          });
        });
/*        return APIStorage.getMarketTrades(baseToken, quoteToken).then(function(apiMarketTradeResponse){
          return apiMarketTradeResponse;
        });*/
      }
    });
  },

  getMarketPairs: function(exchangeCode) {
    let exchangeInstance = markets.getExchangeInstance(exchangeCode);
    exchangeInstance.loadMarkets().then(function(marketResponse){
      Object.keys(marketResponse).forEach(function(key){

      });
       //console.log(marketResponse);
      //return marketResponse;
      exchangeInstance.fetchTicker(Object.keys(marketResponse)[0]).then(function(tickerResponse){
        return tickerResponse;
      });
    });
  },

  getExchangeWeekHistory: function(exchangeCode, baseToken, quoteToken) {
    return DiskStorage.getExchangeWeekHistory(exchangeCode, baseToken, quoteToken).then(function(exchangeWeekHistoryResponse){
      if (ObjectUtils.isNonEmptyArray(exchangeWeekHistoryResponse.rows)) {
        return exchangeWeekHistoryResponse.rows;
      } else {
        return APIStorage.getExchangeWeekHistory(exchangeCode, baseToken, quoteToken).then(function(apiWeekHistoryResponse){
          return apiWeekHistoryResponse;
        });
      }
    });
  },

  getExchangeMonthHistory: function(exchangeCode, baseToken, quoteToken) {
    DiskStorage.getExchangeMonthHistory(exchangeCode, baseToken, quoteToken).then(function(exchangeWeekHistoryResponse){
      if (ObjectUtils.isNonEmptyArray(exchangeWeekHistoryResponse)) {
        return exchangeWeekHistoryResponse;
      } else {
        APIStorage.getExchangeMonthHistory(exchangeCode, baseToken, quoteToken).then(function(apiWeekHistoryResponse){
          return apiWeekHistoryResponse;
        });
      }
    });
  },

  getExchangeYearHistory: function(exchangeCode, baseToken, quoteToken) {
    DiskStorage.getExchangeWeekHistory(exchangeCode, baseToken, quoteToken).then(function(exchangeWeekHistoryResponse){
      if (ObjectUtils.isNonEmptyArray(exchangeWeekHistoryResponse)) {
        return exchangeWeekHistoryResponse;
      } else {
        APIStorage.getExchangeWeekHistory(exchangeCode, baseToken, quoteToken).then(function(apiWeekHistoryResponse){
          return apiWeekHistoryResponse;
        });
      }
    });
  },

  getExchangeOrderbook: function(exchangeCode, baseToken, quoteToken) {
    return DiskStorage.getExchangeOrderbook(exchangeCode, baseToken, quoteToken).then(function(diskOrderbookResponse){
      if (ObjectUtils.isNonEmptyArray(diskOrderbookResponse.rows)) {
        return diskOrderbookResponse.rows;
      } else {
        return APIStorage.getExchangeOrderbook(exchangeCode, baseToken, quoteToken).then(function(exchangeOrderbookResponse){
          return exchangeOrderbookResponse;
        });
      }
    })
  },

  getExchangeHistoryData: function(exchangeCode, baseToken, quoteToken, sampling) {
    if (sampling === "1h") {
      return getHourlySampledHistoryData(exchangeCode, baseToken, quoteToken);
    } else if (sampling === "1m") {
      return getMinutelySampledHistoryData(exchangeCode, baseToken, quoteToken);
    } else if (sampling === "1d") {
      return getDailySampledHistoryData(exchangeCode, baseToken, quoteToken);
    } else {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve( []);
        }, 10);
      });
    }
  },


}

function getMarketsForToken(baseToken) {
  return DiskStorage.findMarketsForToken(baseToken).then(function(marketTokenResponse){
    return marketTokenResponse.data;
  });
}

function getExchangeDetails(exchangeName) {
  return DiskStorage.getExchangeDetails(exchangeName).then(function (diskExchangeReponse) {
    if (diskExchangeReponse && Object.keys(diskExchangeReponse).length > 0) {
      return diskExchangeReponse;
    } else {
      return APIStorage.getExchangeDetails(exchangeName).then(function (apiExchangeResponse) {
        if (apiExchangeResponse[exchangeName].length > 0) {
          DiskStorage.saveExchangeDetails(apiExchangeResponse);
        }
        return apiExchangeResponse;
      });
    }
  }).catch(function (err) {
    return {};
  });
}

function getExchangeMetadata(exchangeName) {
  return new Promise(resolve => {
    let exchangeDetails = {};
    try {
      exchangeDetails = markets.getExchangeInstance(exchangeName);
    } catch (e) {

    }
    setTimeout(() => {
      if (ObjectUtils.isNonEmptyObject(exchangeDetails)) {
        resolve(Object.assign({}, MarketUtils.getMarketMetadata(exchangeDetails), {code: exchangeName}));
      } else {
        resolve({});
      }
    }, 100);
  });
}

function getHourlySampledHistoryData(exchangeCode, baseToken, quoteToken) {
 return DiskStorage.getHourlySampledHistoryData(exchangeCode, baseToken, quoteToken).then(function(historyDataResponse){
    if (ObjectUtils.isNonEmptyArray(historyDataResponse)) {
      return historyDataResponse;
    } else {
      return APIStorage.getSampledHistoryData(exchangeCode, baseToken, quoteToken, "1h").then(function(apiWeekHistoryResponse){
       DiskStorage.saveHourlySampledHistoryData(exchangeCode, baseToken, quoteToken, apiWeekHistoryResponse);
        return apiWeekHistoryResponse;
      });
    }
  });
}

function getMinutelySampledHistoryData(exchangeCode, baseToken, quoteToken) {
  return DiskStorage.getMinutelySampledHistoryData(exchangeCode, baseToken, quoteToken).then(function(historyDataResponse){
    if (ObjectUtils.isNonEmptyArray(historyDataResponse)) {
      return historyDataResponse;
    } else {
      return APIStorage.getSampledHistoryData(exchangeCode, baseToken, quoteToken, "1m").then(function(apiWeekHistoryResponse){
        DiskStorage.saveMinutelySampledHistoryData(exchangeCode, baseToken, quoteToken, apiWeekHistoryResponse);
        return apiWeekHistoryResponse;
      });
    }
  });
}

function getDailySampledHistoryData(exchangeCode, baseToken, quoteToken) {
  return DiskStorage.getDailySampledHistoryData(exchangeCode, baseToken, quoteToken).then(function(historyDataResponse){
    if (ObjectUtils.isNonEmptyObject(historyDataResponse)) {
      return historyDataResponse;
    } else {
      return APIStorage.getSampledHistoryData(exchangeCode, baseToken, quoteToken, "1d").then(function(apiWeekHistoryResponse){
        DiskStorage.saveDailySampledHistoryData(exchangeCode, baseToken, quoteToken, apiWeekHistoryResponse);
        return apiWeekHistoryResponse;
      });
    }
  });
}

function getExchangeObject(exchageName) {
  return new Promise(resolve => {
    let exchangeObject = markets.getExchangeInstance(exchageName);
    setTimeout(() => {
      resolve(exchangeObject);
    }, 300);
  });
}