/**
 Copyright Church of Crypto, Baron Nashor
 */
const DataFetchAPI = require('../../models/DataFetchAPI');

let express = require('express');
var DBConnection = require('../../models/DBModel');
const cassandra = require('cassandra-driver');
const cassandraClient = new cassandra.Client({contactPoints: ['127.0.0.1']});
var CronJob = require('cron').CronJob;
let _ = require('lodash');
const DiskStorage = require('../../models/DiskStorage'),
  APIStorage = require('../../models/APIStorage'),
  CoinGraph = require('../../graph');


module.exports = {
  createCoinDailyHistoryTable: function(req, res, next) {
    DataFetchAPI.getAPICoinList().then(function (coinListResponse) {
      const separators = Math.ceil(coinListResponse / 100);
      for (let counter = 0; counter < separators; counter ++) {
        let currentTimeSchedulerSeconds = ((counter + 4) + " * * * * *");
        let beginIndex = counter * 100;
        let endIndex = (counter + 1) * 100;
        if (counter === separators - 1) {
          endIndex = coinListResponse.length;
        }
        saveCoinGraphResponse(coinListResponse.slice(beginIndex, endIndex), currentTimeSchedulerSeconds);
      }
    });
    res.send({"data": "Started 24 History Data Request"});
  },

  getCoinListAndMerge: function(req, res, next) {
    new CronJob("*/2 * * * *", function() {
      APIStorage.findCoinList().then(function(apiCoinSnapshotResponse){
        const coinListResponse = apiCoinSnapshotResponse.data;
        DiskStorage.saveCoinListData(coinListResponse);
      });
    }, null, true, 'America/Los_Angeles');
    res.send({"data": "Stated Coin List Data Request"});
  }
}

function saveCoinGraphResponse(coinListResponse, currentTimeSchedulerSeconds) {
  let counter = 0;
  return new CronJob(currentTimeSchedulerSeconds, function() {

    if (coinListResponse[counter]) {
      let coinSymbol = coinListResponse[counter].symbol;
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
