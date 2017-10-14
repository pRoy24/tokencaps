const CoinList = require('./Coin/CoinList');
const CoinSave = require('./Coin/Save');
const ExchangeSave = require('./Exchange/ExchangeSave');
const ExchangeList = require('./Exchange/ExchangeList');

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

  findExchangeList: function() {
    return ExchangeList.getExchangeList();
  },

  saveCoinSnapshot: function (coinDetailData) {
    return CoinSave.saveCoinSnapshot(coinDetailData);
  },
  // Extra details about coin with longer TTL
  saveCoinExtraDetails: function(coinDetailData) {
    return CoinSave.saveCoinExtraDetails(coinDetailData);
  },
  saveCoinSocialData: function(coinID, coinSocialData) {
    return CoinSave.saveCoinSocialData(coinID, coinSocialData);
  },

  saveCoinListData: function(coinListData) {
    return CoinSave.saveCoinListData(coinListData);
  },

  saveCoinDayHistoryData: function(coinDayHistoryData) {
    return CoinSave.saveCoinDayHistoryData(coinDayHistoryData);
  },

  saveExchangeList: function(exchangeListData) {
    return ExchangeSave.saveExchangeList(exchangeListData);
  },


  // Search Utils
  searchCoin: function(coinString) {
    return CoinList.searchCoinByQuery(coinString);
  }
}