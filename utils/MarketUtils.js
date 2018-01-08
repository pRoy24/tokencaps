// pRoy24 TokenPlex
var ObjectUtils = require('./ObjectUtils');
var APIUtils = require('./APIUtils');

module.exports = {
  getMarketMetadata: function (marketObject) {
    let locations = {};
    if (ObjectUtils.isNonEmptyArray(marketObject["countries"]) && Array.isArray(marketObject["countries"])) {
      marketObject["countries"].forEach(function (country) {
        let marketCountryCode = country.toLowerCase();
        if (marketCountryCode) {
          let countryLocation = APIUtils.countryCodeToLatLong[marketCountryCode];
          locations[marketCountryCode] = countryLocation;
        }
      })
    } else {
      let marketCountryCode = marketObject["countries"].toLowerCase();
      if (marketCountryCode) {
        let countryLocation = APIUtils.countryCodeToLatLong[marketCountryCode];
        locations[marketCountryCode] = countryLocation
      }
    }
    if ((marketObject.hasFetchTicker || marketObject.hasFetchTickers)
      && marketObject.hasFetchOrderBook) {
      return {
        "name": marketObject["name"], "locations": locations,
        "urls": marketObject["urls"], "currencies": marketObject["currencies"],
        "markets": marketObject["markets"], "info": marketObject
      }
    } else {
      return null;
    }
  },


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
  },

  normalizeMarketListForExchange(exchangeMarketListResponse) {
    let marketItem = {};
    marketItem["base"] = exchangeMarketListResponse.base;
    marketItem["quote"] = exchangeMarketListResponse.quote;
    marketItem["symbol"] = exchangeMarketListResponse.symbol;
    marketItem["lastupdate"] = exchangeMarketListResponse.timestamp;
    marketItem["high"] = exchangeMarketListResponse.high;
    marketItem["low"] = exchangeMarketListResponse.low;
    marketItem["bid"] = exchangeMarketListResponse.bid;
    marketItem["ask"] = exchangeMarketListResponse.ask;
    marketItem["vwap"] = exchangeMarketListResponse.vwap;
    marketItem["open"] = exchangeMarketListResponse.open;
    marketItem["close"] = exchangeMarketListResponse.close;
    marketItem["first"] = exchangeMarketListResponse.first;
    marketItem["last"] = exchangeMarketListResponse.last;
    marketItem["change"] = exchangeMarketListResponse.change;
    marketItem["percentage"] = exchangeMarketListResponse.percentage;
    marketItem["average"] = exchangeMarketListResponse.average;
    marketItem["baseVolume"] = exchangeMarketListResponse.baseVolume;
    marketItem['quoteVolume'] = exchangeMarketListResponse.quoteVolume;
    return marketItem;

  },

  fetchMarketCodeFromQuery(reqURI) {
    try {
      return reqURI.split("/markets")[0].split("/")[1].toLowerCase();
    } catch(e) {
      return null;
    }
  },

  getExchangeNameToDetailsArray(exchangeMarketListArray) {
    return exchangeMarketListArray.map(function(marketListItem, mIdx, mArr){
       let obj = {high: marketListItem.high, low: marketListItem.low, bid: marketListItem.bid,
          ask: marketListItem.ask, baseVolume: marketListItem.baseVolume ? marketListItem.baseVolume : 0,
         quote: marketListItem.quote, quoteVolume: marketListItem.quoteVolume, open: marketListItem.open,
         close: marketListItem.close, symbol: marketListItem.symbol, base: marketListItem.base
        };
        let finalObj = {};
        finalObj[marketListItem.base] = obj;
        return finalObj;
      }).filter(Boolean);
  },

  getExchangeListKeyedByBaseToken(exchangeDetailArray) {
    let exchangeKeyedArray = [];
    let returnListArray = exchangeDetailArray.map(function(exchangeItem) {
      let returnObj = {};
      let baseItem = exchangeItem.base;
      returnObj[baseItem] = exchangeItem;
      return returnObj;
    });
    return returnListArray;
  }
}