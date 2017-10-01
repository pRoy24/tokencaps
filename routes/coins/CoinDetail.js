/**
 Copyright Church of Crypto, Baron Nashor
 */
const DataFetchAPI = require('../../models/DataFetchAPI');
const DiskStorage = require("../../models/DiskStorage");

module.exports = {

  // Coin Detail Snapshot
  getCoinDetailSnapshot: function(req, res, next){
    const coinSymbol = req.query.symbol;
    DataFetchAPI.getCoinRow(coinSymbol).then(function(coinRowResponse) {
      return coinRowResponse;
    }).then(function(coinRowResponse){
      let responseData = {};
      responseData[coinRowResponse.symbol] = {
       "detail": coinRowResponse
      }
      const coinID = coinRowResponse.id;
      const coinSymbol = coinRowResponse.symbol;

      function getCoinObject(objectType) {
        if (objectType === "coinSnapshot") {
          return DataFetchAPI.getCoinSnapshot(coinSymbol);
        }
        if (objectType === "coinSocial") {
          return DataFetchAPI.getCoinSocialData(coinID);
        }
      }
      function callback(responseData) {
        res.send({data: responseData});
      }
      const coinDetailsObjects = ["coinSnapshot", "coinSocial"];
      let counter = 0;
      coinDetailsObjects.forEach((item, index, array) => {
        getCoinObject(item).then(function(dataResponse){
          counter ++;
          responseData[coinRowResponse.symbol][item] = dataResponse;
          if (counter === array.length) {
            callback(responseData);
          }
        });
      });
    }).catch(function(err){
      res.send({"error": err});
    })
  },

  // Coin List
  getCoinList: function(req, res, next) {
    DataFetchAPI.getCoinList().then(function(coinListResponse){
      let responseData = coinListResponse.sort(function(a,b){
        return a.rank - b.rank;
      });
      res.send({data: responseData.slice(0,100)});
    })
  },

  getCoinDailyData(req, res, next) {
    DataFetchAPI.getCoinList().then(function (coinListResponse) {
      let coinList = coinListResponse.sort(function (a, b) {
        return a.rank - b.rank;
      }).slice(0, 100);
      function callback(responseData) {
        res.send({data: responseData});
      }
      let responseData = {};
      let counter = 0;
      coinList.forEach(function (coinItem, coinIdx, arr) {
        let coinSymbol = coinItem.symbol;
        DataFetchAPI.getDailyHistoryData(coinSymbol).then(function (historyDataResponse) {
          responseData[coinSymbol] = historyDataResponse;
          DiskStorage.saveCoinDayHistoryData(historyDataResponse, coinSymbol);
          counter++;
          if (counter === arr.length - 1) {
            callback(responseData);
          }
        }).catch((e)=>{counter ++;})
      })

    });
  }
}