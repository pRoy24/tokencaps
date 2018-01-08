// pRoy24 TokenPlex
const ObjectUtils = require('../../../utils/ObjectUtils');

module.exports = {
  mergeQuotesForBaseInExchange: function(exchangeActiveMarkets) {
    let exchangeMarketMap = {};
    exchangeActiveMarkets.forEach(function(activeMarket){
      if (ObjectUtils.isNonEmptyArray(exchangeMarketMap[activeMarket.base])) {
        if (exchangeMarketMap[activeMarket.base].indexOf(activeMarket.quote) === -1) {
          exchangeMarketMap[activeMarket.base].push(activeMarket.quote);
        }
      } else {
        exchangeMarketMap[activeMarket.base] = [activeMarket.quote];
      }
    });
    let normalizedExchangeList = [];
    Object.keys(exchangeMarketMap).forEach(function(base){
      normalizedExchangeList.push({
        base: base, quote: exchangeMarketMap[base],
        timestamp: exchangeActiveMarkets[0].timestamp, market: exchangeActiveMarkets[0].market
      })
    });
    return normalizedExchangeList;
  },

  groupCoinByMarketMaps: function(exchangeNormalizedArray) {
    let itemGroups = {};
    exchangeNormalizedArray.forEach(function(item){
      if (ObjectUtils.isNonEmptyObject(itemGroups[item.base])) {
        itemGroups[item.base][item.market] = item.quote;
      } else {
        itemGroups[item.base] = {};
        itemGroups[item.base][item.market] = item.quote;
      }
    });
    return itemGroups;
  }
}