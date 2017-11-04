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
    DataFetchAPI.getCoinList().then(function (coinListResponse) {
      const separators = Math.ceil(coinListResponse.length / 100);
      let jobArrayScheduler = [];
      for (let counter = 0; counter < separators; counter ++) {
        let currentTimeSchedulerSeconds = ((counter + 4) + " * * * * *");
        let beginIndex = counter * 100;
        let endIndex = (counter + 1) * 100;
        if (counter === separators - 1) {
          endIndex = coinListResponse.length;
        }
        saveCoinGraphResponse(coinListResponse.slice(beginIndex, endIndex), currentTimeSchedulerSeconds, jobArrayScheduler, counter);

      }
    });
    res.send({"data": "all ok"})
  }
}

function saveCoinGraphResponse(coinListResponse, currentTimeSchedulerSeconds,jobArrayScheduler, jobScheduleIndex) {
  let counter = 0;
  jobArrayScheduler[jobScheduleIndex] = new CronJob(currentTimeSchedulerSeconds, function() {
   let coinSymbol = coinListResponse[counter].symbol;
   APIStorage.findCoinDayHistoryData(coinSymbol).then(function(apiCoinDayHistoryDataResponse){
     const coinDayHistoryResponse = apiCoinDayHistoryDataResponse.data.Data;
     if (coinDayHistoryResponse && coinDayHistoryResponse.length > 0) {
       const responseData  = {};
       responseData[coinSymbol] = coinDayHistoryResponse;
       CoinGraph.chartCoinDailyHistoryGraph(responseData);
       return DiskStorage.deleteCoinDayHistoryData(coinSymbol).then(function(deleteResponse){
         return DiskStorage.saveCoinDayHistoryData(responseData);
       });
     }
   });
   counter ++;
   if (counter === coinSymbol.length) {
     counter = 0;
   }
  }, null, true, 'America/Los_Angeles');
}
