/**
 Copyright Tokenplex
 */

const CoinDailyHistoryGraph = require('../graph/CoinDailyHistoryGraph');
module.exports = {
  chartCoinDailyHistoryGraph: function (responseData) {
    return CoinDailyHistoryGraph.chartDailyCoinHistory(responseData);
  }
}