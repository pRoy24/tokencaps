/**
 Copyright Church of Crypto, Baron Nashor
 */

const CoinDailyHistoryGraph = require('../graph/CoinDailyHistoryGraph');
module.exports = {
  chartCoinDailyHistoryGraph: function (responseData) {
    return CoinDailyHistoryGraph.chartDailyCoinHistory(responseData);
  }
}