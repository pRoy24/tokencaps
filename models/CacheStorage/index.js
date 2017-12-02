// pRoy24 TokenPlex
var Coins = require('./Coins');

module.exports = {
  saveCoinList: function(coinList) {
    return Coins.saveCoinList(coinList);
  },
  getCoinList: function(rangeRequest) {
    return Coins.getCoinList(rangeRequest);
  },
  searchCoin: function (coinSearchString) {
    return Coins.searchCoin(coinSearchString);
  },
  deleteCoinList: function(token) {
    return Coins.deleteCoinList(token);
  },
  findCoinRow: function(coinSymbol) {
    return Coins.findCoinRow(coinSymbol);
  }
}