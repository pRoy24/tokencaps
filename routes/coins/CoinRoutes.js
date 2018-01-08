// pRoy24 tokenplex

const ObjectUtils = require('../../utils/ObjectUtils');
const DataFetchAPI = require('../../models/CoinModels');
const DiskStorage = require("../../models/DiskStorage");
const ExchangeModels = require('../../models/ExchangeModels');

module.exports = {
  // Coin Detail Snapshot
  getCoinDetailSnapshot: function(req, res, next){
    let fromSymbol = req.query.from_symbol;
    let toSymbol = req.query.to_symbol;
    let coinSymbol = req.query.coin_symbol;
    if (ObjectUtils.isEmptyString(fromSymbol) && !ObjectUtils.isEmptyString(coinSymbol)) {
      fromSymbol = coinSymbol;
    }
    if (ObjectUtils.isEmptyString(toSymbol)) {
      toSymbol = "USD";
    }
    if (ObjectUtils.isEmptyString(fromSymbol)) {
      res.send ({error: "coin symbol must be specified"});
    } else {
      DataFetchAPI.getCoinRow(fromSymbol).then(function(coinRowResponse) {
        let responseData = {};
        responseData[coinRowResponse.data.symbol] = {
          "detail": coinRowResponse.data
        };
        const coinID = coinRowResponse.data.id;
        const coinSymbol = coinRowResponse.data.symbol;

        function getCoinObject(objectType) {
          if (objectType === "coinSnapshot") {
            return DataFetchAPI.getCoinSnapshot(fromSymbol, toSymbol);
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
    function promiseFullfilled(responseData) {
      res.send({data: responseData});
    }
    DataFetchAPI.getCoinList(rangeRequest).then(function(coinListResponse){
      let responseData = coinListResponse.filter(function(item){
        return ((item.rank <= rangeRequest) && (item.rank >= rangeRequest - 100));
      }).sort(function(a,b){
        return a.rank - b.rank;
      });
      promiseFullfilled(responseData);
    });
  },

  getCoinDailyData(req, res, next) {
    let coinSymbol = req.query.coin_symbol;
    DataFetchAPI.getDailyHistoryData(coinSymbol).then(function (historyDataResponse) {
      return {data: historyDataResponse}
    });
  },

  getCoinWeekData(req, res, next) {
    let fromSymbol = req.query.from_symbol;
    let toSymbol = req.query.to_symbol;
    DataFetchAPI.getWeekMinuteHistoryData(fromSymbol, toSymbol).then(function (historyDataResponse) {
      res.send({data: historyDataResponse});
    });
  },

  getCoinYearData(req, res, next) {
    let fromSymbol = req.query.from_symbol;
    let toSymbol = req.query.to_symbol;
    if (ObjectUtils.isEmptyString(toSymbol)) {
      toSymbol = "USD";
    }

    DataFetchAPI.getCoinYearHistoryData(fromSymbol, toSymbol).then(function(coinHistoryDataResponse){
      res.send({data: coinHistoryDataResponse});
    });
  },

  searchCoinByName(req, res, next) {
    let coinNameString = req.query.coin_symbol;
    DataFetchAPI.findCoinByName(coinNameString).then(function(coinDetailResponse){
      res.send(coinDetailResponse);
    });
  },

  getCoinDetail(req, res, next) {
    let coinSymbol = req.query.coinSymbol;
    DataFetchAPI.getCoinSnapshot(coinSymbol);
  },

  saveCoinListToCache(req, res, next) {
    DataFetchAPI.saveCoinListToCache();
  },

  fetchCoinListFromCache(req, res, next) {
    DataFetchAPI.getCoinListFromCache();
  },

  deleteCoinList(req, res, next) {
    let token = req.query.token;
    DataFetchAPI.deleteCoinList(token);
    res.send({"data": "deleting data now"});
  },

  getCoinArbitrage(req, res, next) {
    const toSymbol = req.query.to_symbol;
    let fromSymbol = req.query.from_symbol;
    if (ObjectUtils.isEmptyString(fromSymbol)) {
      fromSymbol = "USD";
    }
    // Search is slow currently, need to add sorted set removing coinList.get for now
    DataFetchAPI.getCoinArbitrage(fromSymbol, toSymbol).then(function (coinArbitrageResponse) {
       res.send({data: {exchange: coinArbitrageResponse}});
    });
  },

  getCoinSocialAndHeartbeat(req, res, next) {
    const fromSymbol = req.query.coin_symbol;

    if (ObjectUtils.isEmptyString(fromSymbol)) {
      res.send ({error: "coin symbol must be specified"});
    } else {
      DataFetchAPI.getCoinRow(fromSymbol).then(function(coinRowResponse) {
        const coinID = coinRowResponse.data.id;
        return DataFetchAPI.getCoinSocialData(coinID).then(function(coinSocialResponse){
          res.send({data: coinSocialResponse});
        });

      }).catch(function (err) {
        res.send({"error": err});
      })
    }
  },

  getCoinExchanges(req, res, next) {
    let coinID = req.url.split("/coin")[0].split("/")[1].toLowerCase();
    ExchangeModels.getMarketsForToken(coinID).then(function(coinResponse){

    });
    res.send({data: []});
  }
}