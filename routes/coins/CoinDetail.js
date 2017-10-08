/**
 Copyright Church of Crypto, Baron Nashor
 */
const DataFetchAPI = require('../../models/DataFetchAPI');
const DiskStorage = require("../../models/DiskStorage");

module.exports = {

  // Coin Detail Snapshot
  getCoinDetailSnapshot: function(req, res, next){
    const coinSymbol = req.query.coin_symbol;
    if (!coinSymbol) {
      res.send ({error: "coin detail must be specified"});
    } else {
      DataFetchAPI.getCoinRow(coinSymbol).then(function (coinRowResponse) {
        let responseData = {};
        responseData[coinRowResponse.data.symbol] = {
          "detail": coinRowResponse.data
        };
        const coinID = coinRowResponse.data.id;
        const coinSymbol = coinRowResponse.data.symbol;

        function getCoinObject(objectType) {
          if (objectType === "coinSnapshot") {
            return DataFetchAPI.getCoinSnapshot(coinRowResponse.data.symbol);
          }
          if (objectType === "coinSocial") {
            return DataFetchAPI.getCoinSocialData(coinID);
          }
        }

        function callback(responseData) {
          res.send({data: responseData});

          let responseDataNormalized = responseData[Object.keys(responseData)[0]];
          DiskStorage.saveCoinSnapshot(responseDataNormalized);
        //  DiskStorage.saveCoinExtraDetails(responseDataNormalized);
        }

        const coinDetailsObjects = ["coinSnapshot", "coinSocial"];
        let counter = 0;
        coinDetailsObjects.forEach((item, index, array) => {
          getCoinObject(item).then(function (dataResponse) {
            counter++;
            responseData[coinSymbol][item] = dataResponse;
            if (counter === array.length) {
              callback(responseData);
            }
          });
        });
      }).catch(function (err) {
        res.send({"error": err});
      })
    }
  },

  // Coin List
  getCoinList: function(req, res, next) {
    let rangeRequest = 100;
    if (req.query.range) {
      rangeRequest = req.query.range * 100 ;
    }
    DataFetchAPI.getCoinList(rangeRequest).then(function(coinListResponse){
      let responseData = coinListResponse.filter(function(item){
        return ((item.rank <= rangeRequest) && (item.rank >= rangeRequest - 100));
      }).sort(function(a,b){
        return a.rank - b.rank;
      });
      res.send({data: responseData});
      DiskStorage.saveCoinListData(coinListResponse);
    })
  },

  getCoinDailyData(req, res, next) {
    let rangeRequest = 100;
    if (req.query.range) {
      rangeRequest = req.query.range * 100 ;
    }
    DataFetchAPI.getCoinList().then(function (coinListResponse) {
      let coinList = coinListResponse.filter(function(item){
        return ((item.rank <= rangeRequest) && (item.rank >= rangeRequest - 100));
      }).sort(function (a, b) {
        return a.rank - b.rank;
      });

      function callback(responseData) {
        res.send({data: responseData});
        DiskStorage.saveCoinDayHistoryData(responseData);
      }
      let responseData = {};
      let counter = 0;
      coinList.forEach(function (coinItem, coinIdx, arr) {
        let coinSymbol = coinItem.symbol;
        DataFetchAPI.getDailyHistoryData(coinSymbol).then(function (historyDataResponse) {
          responseData[coinSymbol] = historyDataResponse;
          counter++;
          if (historyDataResponse.length === 0) {
            console.log(coinSymbol);
          }
          if (counter === arr.length - 1) {
            callback(responseData);
          }
        }).catch((e)=>{counter ++;})
      })
    });
  },

  searchCoinByName(req, res, next) {
    let coinNameString = req.query.coin_symbol;
    DataFetchAPI.findCoinByName(coinNameString).then(function(coinDetailResponse){
      res.send(coinDetailResponse);
    })
  },

  getCoinDetail(req, res, next) {
    let coinSymbol = req.query.coinSymbol;
    DataFetchAPI.getCoinSnapshot(coinSymbol);
  }

}