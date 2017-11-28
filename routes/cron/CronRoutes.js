
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
const winston = require('winston')


module.exports = {
  createCoinDailyHistoryTable: function(req, res, next) {
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
      }, 10000);
    });
    res.send({"data": "Started 24 History Data Request"});
  },

  getCoinListAndMerge: function(req, res, next) {

    setInterval(function(){
      winston.log('info', 'querying API for Coin List', {
        "timestamp": Date.now()
      })
      return APIStorage.findCoinList().then(function(apiCoinSnapshotResponse){
        const coinListResponse = apiCoinSnapshotResponse.data;
        return CacheStorage.saveCoinList(coinListResponse);
      });
    }, 2000);

    res.send({"data": "Stated Coin List Data Request"});
  }
}

function saveCoinGraphResponse(coinListResponse, currentTimeSchedulerSeconds) {
  let counter = 0;
  return new CronJob(currentTimeSchedulerSeconds, function() {

    if (coinListResponse[counter]) {
      let coinSymbol = coinListResponse[counter].symbol;
      winston.log('info', 'querying API for Coin Daily History Data', {
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
  winston.log('info', 'Saving Coin Daily History Data', {
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
   //   ObjectUtils.writeFileToS3Location(coinSymbol, "ETH");
    }
  });
}


