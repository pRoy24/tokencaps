/**
 Copyright Church of Crypto, Baron Nashor
 */
const CoinList = require('./CoinList');
const ExchangeList  = require('./Exchange/ExchangeList');
module.exports = {
  findCoinSnapshot: function (coinSymbol) {
    return CoinList.getCoinSnapShot(coinSymbol);
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
  findExchangeList: function() {
    return ExchangeList.getExchangeList();
  },
  searchCoin: function (coinSymbol) {
    return CoinList.searchCoin(coinSymbol);
  },
  findCoinRow: function(coinSymbol) {
    return CoinList.getCoinList().then(function(coinListResponse){
      let currentCoinItem = coinListResponse.data.find((coinItem) => (coinItem.symbol === coinSymbol));
      return ({data: currentCoinItem});
    });
  }
}