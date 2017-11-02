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
      let currentCoinCounter = 0;
      new CronJob('* * * * *', function() {
        if (currentCoinCounter <= 100) {
          let coinSymbol = coinListResponse[currentCoinCounter].symbol;
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
          currentCoinCounter ++;
        } else {
          currentCoinCounter = 0;
        }
      }, null, true, 'America/Los_Angeles');

      let allCoinCounter = 0;
      new CronJob('* * * * *', function() {
        if (allCoinCounter <= coinListResponse.length) {
          let coinSymbol = coinListResponse[currentCoinCounter].symbol;
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
          allCoinCounter ++;
        } else {
          allCoinCounter = 0;
        }
      }, null, true, 'America/Los_Angeles');
      res.send({data: "Cron Job Started"});
    });
  }
}