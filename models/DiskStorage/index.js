const CoinList = require('./Coin/CoinList');
const CoinUpdate = require('./Coin/CoinUpdate');
const ExchangeSave = require('./Exchange/ExchangeSave');
const ExchangeList = require('./Exchange/ExchangeList');

const MarketUpdate = require('./Exchange/ExchangeUpdate');
const MarketList = require('./Exchange/ExchangeList');

module.exports = {
  findCoinRow: function(coinSymbol) {
    return CoinList.getCoinItem(coinSymbol);
  },

  findCoinSnapshot: function(coinSymbol) {
    return CoinList.getCoinSnapShot(coinSymbol);
  },

  findCoinSocialData: function (coinID) {
    return CoinList.getCoinSocialData(coinID);
  },

  findCoinList: function(rangeRequest) {
    return CoinList.getCoinDataArray(rangeRequest)
  },

  findCoinDayHistoryData: function(coinSymbol) {
    return CoinList.getCoinDayHistoryData(coinSymbol);
  },

  findCoinWeekMinuteHistoryData: function(fromSymbol, toSymbol) {
    return CoinList.getCoinWeekHistoryData(fromSymbol, toSymbol);
  },

  findCoinYearDayHistoryData: function(fromSymbol, toSymbol) {
    return CoinList.getCoinYearDayHistoryData(fromSymbol, toSymbol);
  },

  findExchangeList: function() {
    return ExchangeList.getExchangeList();
  },

  saveCoinSnapshot: function (coinDetailData) {
    return CoinUpdate.saveCoinSnapshot(coinDetailData);
  },
  // Extra details about coin with longer TTL
  saveCoinExtraDetails: function(coinDetailData) {
    return CoinUpdate.saveCoinExtraDetails(coinDetailData);
  },

  saveCoinSocialData: function(coinID, coinSocialData) {
    return CoinUpdate.saveCoinSocialData(coinID, coinSocialData);
  },

  saveCoinListData: function(coinListData) {
    return CoinUpdate.saveCoinListData(coinListData);
  },

  saveCoinDayHistoryData: function(coinDayHistoryData) {
    return CoinUpdate.saveCoinDayHistoryData(coinDayHistoryData);
  },

  saveCoinWeekMinuteHistoryData: function(coinWeekHistoryData, toSymbol) {
    return CoinUpdate.saveCoinWeekMinuteHistoryData(coinWeekHistoryData, toSymbol);
  },

  saveCoinYearDayHistoryData: function(coinYearHistoryDataObject, toSymbol) {
    return CoinUpdate.saveCoinYearDayHistoryData(coinYearHistoryDataObject, toSymbol);
  },

  saveExchangeList: function(exchangeListData) {
    return ExchangeSave.saveExchangeList(exchangeListData);
  },


  // Search Utils
  searchCoin: function(coinString) {
    return CoinList.searchCoinByQuery(coinString);
  },

  deleteCoinDayHistoryData(coinSymbol) {
    return CoinUpdate.deleteCoinDayHistoryData(coinSymbol)
  },

  getCoinArbitrage(fromSymbol, toSymbol) {
    return CoinList.getCoinArbitrage(fromSymbol, toSymbol);
  },

  findRedisCoinList() {

  },

  saveCoinArbitrage(coinDataArray) {
    return CoinUpdate.saveCoinArbitrage(coinDataArray);
  },

  saveMarketList(marketListArray) {

  },

  saveMarketActiveExchanges(marketListInExchange) {
    MarketUpdate.saveMarketActiveExchanges(marketListInExchange);
  },

  findExchangesForToken(baseToken) {
    return MarketList.findExchangesForToken(baseToken);
  },

  createMarketListByToken(marketListResponse) {
    return MarketUpdate.saveMarketListByCoin(marketListResponse);
  },

  getMarketTrades(baseToken) {
    return MarketList.getMarketTradesForToken(baseToken);
  },



  getMarketsForExchange(exchangeName) {
    return ExchangeList.getMarketsForExchange(exchangeName);
  },

  saveExchangeMarketList(exchangeList) {

  },

  getExchangeWeekHistory(exchangeName, baseToken, quoteToken) {
    return ExchangeList.getExchangeWeekHistory(exchangeName, baseToken, quoteToken);
  },

  getExchangeMonthHistory() {
    return ExchangeList.getExchangeMonthHistory();
  },

  getExchangeYearHistory() {
    return ExchangeList.getExchangeYearHistory();
  },

  getExchangeOrderbook(exchangeCode, baseToken, quoteToken) {
    return ExchangeList.getExchangeOrderbook(exchangeCode, baseToken, quoteToken);
  },


  getExchangeDetails(exchangeName) {
    return ExchangeList.getExchangeDetails(exchangeName);
  },


  saveExchangeDetails(exchangeDetails) {
    return ExchangeSave.saveExchangeDetails(exchangeDetails);
  },

  getDailySampledHistoryData(exchangeCode, baseToken, quoteToken) {
    return ExchangeList.getDailySampledHistoryData(exchangeCode, baseToken, quoteToken);
  },

  getHourlySampledHistoryData(exchangeCode, baseToken, quoteToken) {
    return ExchangeList.getHourlySampledHistoryData(exchangeCode, baseToken, quoteToken);
  },

  getMinutelySampledHistoryData(exchangeCode, baseToken, quoteToken) {
    return ExchangeList.getMinutelySampledHistoryData(exchangeCode, baseToken, quoteToken);
  },

  saveMarketsForExchange(exchangeMarketDetails) {
    return ExchangeSave.saveMarketsForExchange(exchangeMarketDetails);
  },

  hasExchangeDetailsExpired(exchangeName) {
    return ExchangeList.hasExchangeDetailsExpired(exchangeName);
  },

  saveMinutelySampledHistoryData(exchangeCode, baseToken, quoteToken, apiWeekHistoryResponse) {
    return ExchangeSave.saveMinutelySampledHistoryData(exchangeCode, baseToken, quoteToken, apiWeekHistoryResponse);
  },

  saveHourlySampledHistoryData(exchangeCode, baseToken, quoteToken, apiWeekHistoryResponse) {
    return ExchangeSave.saveHourlySampledHistoryData(exchangeCode, baseToken, quoteToken, apiWeekHistoryResponse);
  },

  saveDailySampledHistoryData(exchangeCode, baseToken, quoteToken, apiWeekHistoryResponse) {
    return ExchangeSave.saveDailySampledHistoryData(exchangeCode, baseToken, quoteToken, apiWeekHistoryResponse);
  }



}