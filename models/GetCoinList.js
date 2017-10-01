var axios = require('axios');
// call the GitHub API to fetch information about the user's repositories

module.exports = {
  getCoinMarketCapCoinList: function()
  {
    const getCoinMarketCapListEndpoint = "https://api.coinmarketcap.com/v1/ticker";
    return axios.get(getCoinMarketCapListEndpoint);
  },

  getCryptoCompareCoinList: function () {
    const getCruptoCompreListEndpoint = "https://www.cryptocompare.com/api/data/coinlist/";
    return axios.get(getCruptoCompreListEndpoint);
  },
  getCoinDayHistogram: function(coinSymbol) {
    const histogramDataEndpoint = "https://min-api.cryptocompare.com/data/histohour?fsym="+coinSymbol+"&tsym=USD&limit=24&aggregate=1";
    return axios.get(histogramDataEndpoint);
  },

  getCoinSnapShot: function(coinSymbol) {
    const histogramDataEndpoint = "https://www.cryptocompare.com/api/data/coinsnapshot/?fsym="+coinSymbol+"&tsym=BTC";
    return axios.get(histogramDataEndpoint);
  },

  getCoinMinuteData(coinSymbol) {
    const histogramDataEndpoint = "https://min-api.cryptocompare.com/data/histominute?fsym="+coinSymbol+"&tsym=USD&&aggregate=3&e=CCCAGG";
    return axios.get(histogramDataEndpoint);
  },
  getCoinSocialData(coinID) {
    const histogramDataEndpoint = "https://www.cryptocompare.com/api/data/socialstats/?id="+coinID;
    return axios.get(histogramDataEndpoint);
  },


  getCoinDailyData() {
    const dailyHistogramEndpoint = "https://min-api.cryptocompare.com/data/histoday?fsym=BTC&tsym=USD&limit=60&aggregate=3&e=CCCAGG,";

  },

  getCoinDetailSnapshot(coinID) {
    const detailSnapshotEndpoint = "https://www.cryptocompare.com/api/data/coinsnapshotfullbyid/?id="+coinID;
  },

  getCoinMonthPriceData(fromCoinSymbol, toCoinSymbol) {

  },

  getCoinGenesisPriceData(fromCoinSymbol, toCoinSymbol) {

  },
}