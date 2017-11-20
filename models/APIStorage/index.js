/**
 Copyright Church of Crypto, Baron Nashor
 */
const CoinList = require('./CoinList');
const ExchangeList  = require('./Exchange/ExchangeList');
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
  findCoinWeekMinuteHistoryData: function(coinSymbol) {
    return CoinList.getCoinWeekHistoryData(coinSymbol);
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
  }
}