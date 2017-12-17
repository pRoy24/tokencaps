// pRoy24 tokenplex

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
  }
 // findCoinArbitrageResponse: function(fromS)
}