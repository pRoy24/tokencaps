// pRoy24 TokenPlex
var ccxt = require ('ccxt')


let ObjectUtils = require('../../../utils/ObjectUtils');
const markets = require('./ExchangeConstants');
const MarketUtils = require('../../../utils/MarketUtils');
const logger = require('../../../logs/logger');

module.exports = {
  getMarketList: function (exchangeName) {
    let currentExchange = markets.getExchangeInstance(exchangeName);
    return currentExchange.loadMarkets().then(function (exchangeMarketList) {
      return getExchangeTicker(currentExchange).then(function (currentExchangeTickerResponse) {
        let tickerNormalizedResponse = [];
        Object.keys(currentExchangeTickerResponse).forEach(function (tickerKey) {
          let responseMarket = exchangeMarketList[tickerKey];
          let mergedMarketResponse = Object.assign({}, responseMarket, currentExchangeTickerResponse[tickerKey]);
          tickerNormalizedResponse.push(MarketUtils.normalizeMarketListForExchange(mergedMarketResponse));
        });
        return tickerNormalizedResponse;
      });
    });
  },

  getMarketActiveExchanges(currentExchange, exchangeName) {
    try {
      return currentExchange.fetchMarkets().then(function (exchangeMarket) {
        let exchangeRows = [];
        let timeStamp = Date.now();
        Object.keys(exchangeMarket).forEach(function (marketKey) {
          exchangeRows.push({
            "base": exchangeMarket[marketKey].base, "quote": exchangeMarket[marketKey].quote,
            "symbol": exchangeMarket[marketKey].symbol, "market": exchangeName,
            "timestamp": timeStamp
          })
        });
        let normalizedExchangeRows = MarketUtils.mergeQuotesForBaseInExchange(exchangeRows);
        return ({data: normalizedExchangeRows});
      }).catch(function (ex) {
        return ({data: [], error: ex});
      });
    } catch (e) {

    }
  },

  getMarketExchangeByToken() {
    let exchangeNormalizedArray = [];

    function marketCallback(responseData) {
      return responseData;
    }

    ccxt.exchanges.forEach(function (exchangeName, exIdx, exchangeArr) {
      try {
        let currentExchange = markets.getExchangeInstance(exchangeName);
        currentExchange.fetchMarkets().then(function (exchangeMarket) {
          let exchangeRows = [];
          let timeStamp = Date.now();
          Object.keys(exchangeMarket).forEach(function (marketKey) {
            exchangeRows.push({
              "base": exchangeMarket[marketKey].base, "quote": exchangeMarket[marketKey].quote,
              "symbol": exchangeMarket[marketKey].symbol, "market": exchangeName,
              "timestamp": timeStamp
            })
          });
          exchangeNormalizedArray = exchangeNormalizedArray.concat(MarketUtils.mergeQuotesForBaseInExchange(exchangeRows));
          // console.log(exchangeNormalizedArray.length);
          if (exIdx === exchangeArr.length - 1) {
            marketCallback(MarketUtils.groupCoinByMarketMaps(exchangeNormalizedArray));
          }
        }).catch(function (fetchMarketException) {
          logger.log({"level": "error", message: fetchMarketException});
          //  marketCallback({error: fetchMarketException});
        });
      }
      catch (e) {
        logger.log({"level": "error", "message": e});
      }
    });

    setTimeout(function () {
      return MarketUtils.groupCoinByMarketMaps(exchangeNormalizedArray);
    }, 6000);
  },

  getMarketTrades: function (baseToken, quoteToken) {

  },

  getExchangeWeekHistory: function (exchangeCode, baseToken, quoteToken) {
    let currentExchange = markets.getExchangeInstance(exchangeCode);
    return currentExchange.loadMarkets().then(function (loadMarketResponse) {
      let marketList = Object.keys(loadMarketResponse).map(function (item) {
        return loadMarketResponse[item];
      }).find(function (item) {
        return item.base === baseToken && item.quote === quoteToken;
      });
      let marketSymbol = marketList.symbol;
      return currentExchange.fetchOHLCV(marketSymbol, "1m").then(function (ohclvResponse) {
        return ohclvResponse;
      });
    }).catch(function (err) {
      throw err;
    });
  },

  getMinutelySampledHistoryData: function(exchangeCode, baseToken, quoteToken) {
    return getExchangeObject(exchangeCode).then(function(currentExchange){
      return currentExchange.loadMarkets().then(function (loadMarketResponse) {
        let marketList = Object.keys(loadMarketResponse).map(function (item) {
          return loadMarketResponse[item];
        }).find(function (item) {
          return item.base === baseToken && item.quote === quoteToken;
        });
        let marketSymbol = marketList.symbol;
        return currentExchange.fetchOHLCV(marketSymbol, "1m").then(function (ohclvResponse) {
          return ohclvResponse;
        });
      }).catch(function (err) {
        return [];
      });
    });
  },

  getHourlySampledHistoryData: function() {

  },

  getSampledHistoryData: function(exchangeCode, baseToken, quoteToken, rate) {
    return getExchangeObject(exchangeCode).then(function(currentExchange){
      return currentExchange.loadMarkets().then(function (loadMarketResponse) {
        let marketList = Object.keys(loadMarketResponse).map(function (item) {
          return loadMarketResponse[item];
        }).find(function (item) {
          return item.base === baseToken && item.quote === quoteToken;
        });
        let marketSymbol = marketList.symbol;
        if (currentExchange.hasFetchOHLCV) {
          return currentExchange.fetchOHLCV(marketSymbol, rate).then(function (ohclvResponse) {
            return ohclvResponse;
          });
        } else {
          return new Promise(resolve => {
            setTimeout(() => {
              resolve([]);
            }, 100);
          });
        }
      }).catch(function (err) {
        console.log(err);
        return [];
      });
    });
  },

  getExchangeOrderbook: function (exchangeCode, baseToken, quoteToken) {
    return getExchangeObject(exchangeCode).then(function(currentExchange){
      return currentExchange.loadMarkets().then(function (loadMarketResponse) {
        let marketList = Object.keys(loadMarketResponse).map(function (item) {
          return loadMarketResponse[item];
        }).find(function (item) {
          return item.base === baseToken && item.quote === quoteToken;
        });
        let marketSymbol = marketList.symbol;
        return currentExchange.fetchOrderBook(marketSymbol).then(function (orderBookResponse) {
           return orderBookResponse;
        });
      });
    }).catch(function(err){
        return [];
    });
  },

  findExchangeDetails: function (exchangeName) {
    let currentExchange = markets.getExchangeInstance(exchangeName);
    if (ObjectUtils.isNonEmptyObject(currentExchange)) {
      return getExchangeTicker(currentExchange).then(function (currentExchangeTickerResponse) {
        let marketDetail = {};
        if (!ObjectUtils.isEmptyString(exchangeName)) {
          marketDetail[exchangeName] = MarketUtils.getExchangeNameToDetailsArray(currentExchangeTickerResponse);
        }
        return marketDetail;
      }).catch(function(e){
        return {};
      });
    } else {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({});
        }, 1);
      });
    }
  },

  findExchangesForToken: function(baseToken) {
    ccxt.exchanges.forEach(function(exchangeName){
      let currentExchange = markets.getExchangeInstance(exchangeName);
      currentExchange.fetchMarkets().then(function (exchangeMarket) {

      });
    });
    return new Promise(resolve => {
      setTimeout(() => {
        let normalizedExchangeList = [];
        resolve(normalizedExchangeList);
      }, 100);
    });
  }
}

function getExchangeTicker(currentExchange) {
  return currentExchange.loadMarkets().then(function (exchangeMarketList) {
    if (currentExchange.hasFetchTickers) {
      return currentExchange.fetchTickers().then(function(tickerResponse){
        let tickerNormalizedResponse = [];
        Object.keys(tickerResponse).forEach(function(tickerKey){
          let responseMarket = exchangeMarketList[tickerKey];
          let mergedMarketResponse = Object.assign({}, responseMarket, tickerResponse[tickerKey], {exchangeName: currentExchange.name});
          tickerNormalizedResponse.push(MarketUtils.normalizeMarketListForExchange(mergedMarketResponse));
        });
       return tickerNormalizedResponse;
      }).catch(function(err){
        return [];
      });
    } else if (currentExchange.hasFetchTicker) {
      // If exchange does not provide a fetchTickers endpoint
      // then we fetch individual ticker data with timeout = exchange.rateLimit

      let rateLimit = 1000;
      if (Number(currentExchange.rateLimit) > 0) {
        rateLimit = Number(currentExchange.rateLimit);
      }

      let actions = Object.keys(exchangeMarketList).map(function(item){
        return fetchMarketTicker(exchangeMarketList, currentExchange, item, rateLimit);
      })

      var results = Promise.all(actions); // pass array of promises
      return results.then(function(response){
        return response;
      }).catch(function(err){
        return err;
      });
    }
  });
}

function fetchMarketTicker(exchangeMarketList, currentExchange, marketSymbol, rateLimit) {
  return currentExchange.fetchTicker(marketSymbol).then(function(tickerResponse) {
      let mergedMarketResponse = Object.assign({}, exchangeMarketList[marketSymbol], tickerResponse, {exchangeName: currentExchange.name});
      return mergedMarketResponse;
    }).then(function(mergedMarketResponse){
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(mergedMarketResponse);
        }, rateLimit);
      });
    }).catch(function(err){
      return [];
    });
}

function getExchangeObject(exchangeName) {
  return new Promise(resolve => {
    let exchangeObject = markets.getExchangeInstance(exchangeName);
    setTimeout(() => {
      resolve(exchangeObject);
    }, 300);
  });
}