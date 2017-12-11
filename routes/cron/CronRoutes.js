
const DataFetchAPI = require('../../models/DataFetchAPI');

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
    DataFetchAPI.getCoinList(600).then(function (coinListResponse) {
      let counter  = 0;

      setInterval(function(){
        if (counter < coinListResponse.length - 1) {
          if (coinListResponse[counter].symbol) {
            saveCoinDailyGraph(coinListResponse[counter].symbol);
            counter++;
          }
        } else {
          counter = 0;
        }
      }, 30000);
    });
    res.send({"data": "Started 24 History Data Request"});
  },

  getCoinListAndMerge: function(req, res, next) {
    setInterval(function(){
      logger.log('info', 'querying API for Coin List', {
        "timestamp": Date.now()
      });
      APIStorage.findCoinList().then(function(apiCoinSnapshotResponse){
        const coinListResponse = apiCoinSnapshotResponse.data;
        if (ObjectUtils.isNonEmptyArray(coinListResponse)) {
          return CacheStorage.saveCoinList(coinListResponse);
        } else {
          return null;
        }
      });
    }, 60000);

    res.send({"data": "Started Coin List Data Request"});
  }
}

function saveCoinGraphResponse(coinListResponse, currentTimeSchedulerSeconds) {
  let counter = 0;
  return new CronJob(currentTimeSchedulerSeconds, function() {
    if (coinListResponse[counter]) {
      let coinSymbol = coinListResponse[counter].symbol;
      logger.log('info', 'querying API for Coin Daily History Data', {
        "timestamp": Date.now(),
        'coin': coinSymbol
      })
      APIStorage.findCoinDayHistoryData(coinSymbol).then(function (apiCoinDayHistoryDataResponse) {
        const coinDayHistoryResponse = apiCoinDayHistoryDataResponse.data.Data;
        if (coinDayHistoryResponse && coinDayHistoryResponse.length > 0) {
          const responseData = {};
          responseData[coinSymbol] = coinDayHistoryResponse;
          CoinGraph.chartCoinDailyHistoryGraph(responseData);
          return DiskStorage.deleteCoinDayHistoryData(coinSymbol).then(function (deleteResponse) {
            return DiskStorage.saveCoinDayHistoryData(responseData);
          });
        }
      });
      counter ++;
    }
   if (counter === coinListResponse.length) {
     counter = 0;
   }
  }, null, true, 'America/Los_Angeles');
}

function saveCoinDailyGraph(coinSymbol) {
  logger.log('info', 'Saving Coin Daily History Data', {
    "timestamp": Date.now(),
    'coin': coinSymbol
  });
  return APIStorage.findCoinDayHistoryData(coinSymbol).then(function (apiCoinDayHistoryDataResponse) {
    const coinDayHistoryResponse = apiCoinDayHistoryDataResponse.data.Data;
    if (coinDayHistoryResponse && coinDayHistoryResponse.length > 0) {
      const responseData = {};
      responseData[coinSymbol] = coinDayHistoryResponse;
     return CoinGraph.chartCoinDailyHistoryGraph(responseData);
    } else {
      // ObjectUtils.writeFileToS3Location(coinSymbol, "ETH");
    }
  }).catch(function(err){
    return null;
  });
}


