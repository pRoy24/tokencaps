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

  findCoinList: function() {
    return CoinList.getCoinDataArray()
  },

  findCoinDayHistoryData: function(coinSymbol) {
    return CoinList.getCoinDayHistoryData(coinSymbol);
  },

  findExchangeList: function() {
    return ExchangeList.getExchangeList();
  },

  saveCoinSnapshot: function (coinSnapshotData) {
    return CoinSave.saveCoinSnapshot(coinSnapshotData);
  },

  saveCoinSocialData: function(coinSocialData) {
    return CoinSave.saveCoinSocialData(coinSocialData);
  },

  saveCoinListData: function(coinListData) {
    return CoinSave.saveCoinListData(coinListData);

  },

  saveCoinDayHistoryData: function(coinDayHistoryData, coinSymbol) {
    return CoinSave.saveCoinDayHistoryData(coinDayHistoryData, coinSymbol);
  },

  saveExchangeList: function(exchangeListData) {
    return ExchangeSave.saveExchangeList(exchangeListData);
  },



}