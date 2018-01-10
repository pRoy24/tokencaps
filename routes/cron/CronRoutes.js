
const DataFetchAPI = require('../../models/CoinModels');

let express = require('express');
var DBConnection = require('../../models/DBModel');
const cassandra = require('cassandra-driver');
const cassandraClient = new cassandra.Client({contactPoints: ['127.0.0.1']});
var CronJob = require('cron').CronJob;
let _ = require('lodash');
const DiskStorage = require('../../models/DiskStorage'),
  APIStorage = require('../../models/APIStorage'),
  CacheStorage = require('../../models/CacheStorage'),
  CoinGraph = require('../../graph');
ObjectUtils = require('../../utils/ObjectUtils');
const logger = require('../../logs/logger');

module.exports = {
  getCoinDayGraph: function(req, res, next) {
    startCoinGraphCron();
    // Chart every coin graph with a timeout of 4 seconds
    // Repeat logic every hour
    const FETCH_COIN_LOOP = 3600000;
    setInterval(function(){
      try {
        startCoinGraphCron();
      } catch(e) {
        logger.log({level: "error", message: "caught exception " + e + " retry in "+FETCH_COIN_LOOP+" ms"})
      }
    }, FETCH_COIN_LOOP);
    res.send({"data": "Started 24 History Data Request"});
  },

  getCoinListAndMerge: function(req, res, next) {
    setInterval(function(){
      logger.log('info', 'querying API for Coin List', {
        "timestamp": Date.now()
      });
      try {
        APIStorage.findCoinList().then(function (apiCoinSnapshotResponse) {
          const coinListResponse = apiCoinSnapshotResponse.data;
          if (ObjectUtils.isNonEmptyArray(coinListResponse)) {
            return CacheStorage.saveCoinList(coinListResponse);
          } else {
            return null;
          }
        });
      } catch(e){
        logger.log({"level": "error", "detail": "could not fetch coinlist at timestamp"+Date.now()})
      }
    }, 10000);

    res.send({"data": "Started Coin List Data Request"});
  }
}

function startCoinGraphCron() {
  DataFetchAPI.getCoinList(1000).then(function(coinDataList) {
    if (coinDataList.length > 0) {
      function createDailyServerSideGraphMap(n, fn, delay) {
        if (ObjectUtils.isNonEmptyObject(coinDataList[n])) {
          createCoinHistoryMap(coinDataList[n]);
        }
        if (n > 0) {
          fn();
          if (n > 1) {
            setTimeout(function() {
              createDailyServerSideGraphMap(n - 1, fn, delay);
            }, delay);
          }
        }
      }
      createDailyServerSideGraphMap(coinDataList.length, function() {

      }, 4000);
    }
  });
}

function createCoinHistoryMap(coinDetailObject) {
  let coinSymbol = coinDetailObject.symbol;
  APIStorage.findCoinDayHistoryData(coinSymbol).then(function (apiCoinDayHistoryDataResponse) {
    const coinDayHistoryResponse = apiCoinDayHistoryDataResponse.data.Data;
    if (ObjectUtils.isNonEmptyArray(coinDayHistoryResponse)) {
      const responseData = {};
      responseData[coinSymbol] = coinDayHistoryResponse;
      logger.log({"level": "info", "message": "charting coin history for " + coinSymbol});
      CoinGraph.chartCoinDailyHistoryGraph(responseData);
    } else {
      logger.log({"level": "error", "message": "could not fetch coin history data"})
    }
  });

}





