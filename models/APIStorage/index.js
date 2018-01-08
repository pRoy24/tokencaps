// pRoy24 tokenplex

const CoinList = require('./Coin/CoinList');
const ExchangeList  = require('./Exchange/ExchangeList');
const MarketList = require('./Exchange/ExchangeList');

module.exports = {
  findCoinSnapshot: function (coinSymbol, toSymbol) {
    return CoinList.getCoinSnapShot(coinSymbol, toSymbol);
  },

  findCoinSocialData: function(coinID) {
    return CoinList.getCoinSocialData(coinID);
  },

  findExchangeList: function() {
    return ExchangeList.getExchangeList();
  },

  findCoinList: function() {
    return CoinList.getCoinList();
  },

  findCoinDayHistoryData: function(coinSymbol) {
    return CoinList.getCoinDayHistoryData(coinSymbol);
  },

  findCoinWeekMinuteHistoryData: function(fromSymbol, toSymbol) {
    return CoinList.getCoinWeekHistoryData(fromSymbol, toSymbol);
  },

  findCoinYearDayHistoryData: function(fromSymbol, toSymbol) {
    return CoinList.getCoinYearHistoryData(fromSymbol, toSymbol);
  },

  searchCoin: function (coinSymbol) {
    return CoinList.searchCoin(coinSymbol);
  },
  findCoinRow: function(coinSymbol) {
    return CoinList.getCoinList().then(function(coinListResponse){
      let currentCoinItem = coinListResponse.data.find((coinItem) => (coinItem.symbol === coinSymbol));
      return ({data: currentCoinItem});
    });
  },
  getCoinHistoricalPrice: function(fromSymbol, exchange, timeStamp) {
    return CoinList.getCoinHistoricalPrice(fromSymbol, exchange, timeStamp);
  },

  getCoinArbitrage: function(fromSymbol, toSymbol) {
    return CoinList.getCoinArbitrage(fromSymbol, toSymbol);
  },


   // Market Operations
   getMarketList: function() {
     return MarketList.getMarketList();
   },

   getMarketActiveExchanges: function(currentExchange, exchangeName) {
     return MarketList.getMarketActiveExchanges(currentExchange, exchangeName);
   },

  getMarketExchangeByToken: function() {
    return MarketList.getMarketExchangeByToken();
  },

  getMarketTrades: function(baseToken, quoteToken) {
    return MarketList.getMarketTrades(baseToken, quoteToken);
  },


  getMarketsForExchange: function(exchangeName){
    return ExchangeList.getMarketList(exchangeName);
  },

  getExchangeWeekHistory: function(exchangeCode, baseToken, quoteToken) {
    return ExchangeList.getExchangeWeekHistory(exchangeCode, baseToken, quoteToken);
  },

  getExchangeOrderbook: function(exchangeCode, baseToken, quoteToken) {
    return ExchangeList.getExchangeOrderbook(exchangeCode, baseToken, quoteToken);
  },

 getExchangeDetails: function(exchangeName) {
    return ExchangeList.findExchangeDetails(exchangeName);
 },

  findExchangesForToken: function(baseToken) {
    return ExchangeList.findExchangesForToken(baseToken);
  },

  getMinutelySampledHistoryData: function(exchangeCode, baseToken, quoteToken) {
    return ExchangeList.getMinutelySampledHistoryData(exchangeCode, baseToken, quoteToken);
  },

  getDailySampledHistoryData: function(exchangeCode, baseToken, quoteToken) {
    return ExchangeList.getDailySampledHistoryData(exchangeCode, baseToken, quoteToken);
  },

  getSampledHistoryData: function(exchangeCode, baseToken, quoteToken, rate) {
    return ExchangeList.getSampledHistoryData(exchangeCode, baseToken, quoteToken, rate);
  }


 // findCoinArbitrageResponse: function(fromS)
}