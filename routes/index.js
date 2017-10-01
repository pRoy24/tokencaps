var express = require('express');
var router = express.Router();
var request = require('request');
var getCoinList = require('../models/GetCoinList');
var DataFetchAPI = require('../models/DataFetchAPI');
/* GET home page. */
var redis = require('redis');

var DBConnection = require('../models/DBModel');
// create a new redis client and connect to our local redis instance
var redisClient = redis.createClient();

var axios = require('axios');
// create a new redis client and connect to our local redis instance
const cassandra = require('cassandra-driver');
const cassandraClient = new cassandra.Client({contactPoints: ['127.0.0.1']});
router.get('/', function(req, res, next) {
  getCoinList.getCoinMarketCapCoinList().then(function (coinMarketApiResponse) {
    coinMarketApiResponse = coinMarketApiResponse.data;
    getCoinList.getCryptoCompareCoinList().then(function (coinListResponse) {
      coinListResponse = coinListResponse.data.Data;
      let coinListItems = Object.keys(coinListResponse).map(function (key) {
        return coinListResponse[key];
      });
      coinListItems = coinListItems.sort(function (a, b) {
        return Number(a.SortOrder) - Number(b.SortOrder);
      });
      let joinedCoinDataList = [];
      for (let a = 0; a < coinMarketApiResponse.length; a++) {
        for (let b = 0; b < coinListItems.length; b++) {
          if (coinMarketApiResponse[a].symbol.toLowerCase() === coinListItems[b].Name.toLowerCase()) {
            joinedCoinDataList.push(Object.assign({}, coinMarketApiResponse[a], coinListItems[b], {HistoryData: {}}));
            break;
          }
        }
      }
      joinedCoinDataList = joinedCoinDataList.sort(function(a, b){
        return Number(b['24h_volume_usd']) - Number(a["24h_volume_usd"])
      });
      res.send({data: joinedCoinDataList.slice(0, 100)});
    });
  });
});

router.get('/coin-list', function(req, res, next){
  DBConnection.getCassandraClientConnection().then(function(connection){
    const query = "SELECT * from churchdb.coins";
    return cassandraClient.execute(query);
  }).then(function(coinListDBResponse){
    if (coinListDBResponse && coinListDBResponse.rows.length > 0) {
      return res.send({data: coinListDBResponse.rows});
    } else {
      return getCoinList.getCoinMarketCapCoinList().then(function (coinMarketApiResponse) {
        coinMarketApiResponse = coinMarketApiResponse.data;
        return getCoinList.getCryptoCompareCoinList().then(function (coinListResponse) {
          coinListResponse = coinListResponse.data.Data;
          let coinListItems = Object.keys(coinListResponse).map(function (key) {
            return coinListResponse[key];
          });
          coinListItems = coinListItems.sort(function (a, b) {
            return Number(a.SortOrder) - Number(b.SortOrder);
          });
          let joinedCoinDataList = [];
          for (let a = 0; a < coinMarketApiResponse.length; a++) {
            if (joinedCoinDataList.length === coinMarketApiResponse.length) {
              break;
            }
            for (let b = 0; b < coinListItems.length; b++) {
              if (coinMarketApiResponse[a].symbol.toLowerCase() === coinListItems[b].Name.toLowerCase()) {
                // Normalize response to store in cassandra DB
                const normalizedCMApiResponse =
                  Object.assign(...Object.keys(coinMarketApiResponse[a]).map(function (cmResponseKey) {
                    let temp = {};
                    if (cmResponseKey === "24h_volume_usd") {
                      temp["daily_volume_usd"] = coinMarketApiResponse[a]["24h_volume_usd"];
                    } else {
                      temp[cmResponseKey.toLowerCase()] = coinMarketApiResponse[a][cmResponseKey];
                    }
                    return temp;
                  }));

                const normalizedCLApiResponse =
                  Object.assign(...Object.keys(coinListItems[b]).map(function (clResponseKey) {
                    let temp = {};
                    temp[clResponseKey.toLowerCase()] = coinListItems[b][clResponseKey];
                    return temp;
                  }));
                joinedCoinDataList.push(Object.assign({}, normalizedCMApiResponse, normalizedCLApiResponse));
                break;
              }
            }
          }
          let shortenedCoinList = joinedCoinDataList.slice(0, 50);
          let queries = [];
          shortenedCoinList.forEach(function (listItem, idx) {
            let values = Object.keys(listItem).map(function (currentKey, currIdx) {
              if (currentKey && listItem[currentKey]) {
                return listItem[currentKey];
              } else {
                return null;
              }
            }).filter(Boolean);
            let placeholders = Object.keys(values).map((a)=>"?").join(", ");
            let keyslist = Object.keys(listItem).map(function (currentKey, currIdx) {
              if (listItem[currentKey]) {
                return currentKey;
              } else {
                return null;
              }
            }).filter(Boolean).join(",");

            const query = 'INSERT INTO churchdb.coins (' + keyslist + ') VALUES (' + placeholders + ') USING TTL 00';
            queries.push({
              query: query,
              params: values
            })
          });
          res.send({data: shortenedCoinList});
          return cassandraClient.batch(queries, { prepare: true })
            .then(result => console.log('Data updated on cluster'));
        }).catch((e)=>console.log(e));
      });
    }
  })
});




router.get('/daily-coin-history', function(req, res, next){
  let coinListQuery = req.query.coin_symbol;
  cassandraClient.execute("SELECT * from churchdb.daily_history_data where symbol=" + coinListQuery, function (err, result) {
    if (result && result.rows.length > 0) {
      let responseData = {};
      responseData[coinListQuery] = result.rows;
      res.send({data: responseData});
    } else {
      getCoinList.getCoinDayHistogram(coinListQuery).then(function (historyDataResponse) {
        const coinDataResponse = historyDataResponse.data.Data;
        coinDataResponse.forEach(function(dataResponseItem){
          const placeHolders = "?, ?, ?, ?, ?, ?, ?, ?";
          const keys = "time ,high ,low ,open ,volumefrom , volumeto ,close, symbol";
          let values = [];
          Object.keys(dataResponseItem).forEach(function(key){
            values.push(dataResponseItem[key]);
          });
          values.push(coinListQuery);
          let ttl = Math.floor(Math.random() * 300) + 200;
          const query = 'INSERT INTO churchdb.daily_history_data (' + keys + ') VALUES (' + placeHolders + ') USING TTL ' +ttl;
          const params = values;

          cassandraClient.execute(query, params, {prepare: true}, function (err, response) {
            if (err) {
              console.log(err);
            }
          });
        });
        let responseData = {};
        responseData[coinListQuery] = coinDataResponse;
        res.send({data: responseData});
      });
    }
  });
});

router.get('/coin-detail')


router.get('/coin-snapshot', function(req, res, next){
  let coinSnapShotQuery = req.query.coin_symbol;
  cassandraClient.execute("SELECT * FROM churchdb.coin_details WHERE fromsymbol='"+coinSnapShotQuery+"'", function (err, result) {
    if (result && result.rows.length > 0) {
      res.send({data: {symbol: coinSnapShotQuery, exchangeData: result.rows}});
    } else {
      return getCoinList.getCoinSnapShot(coinSnapShotQuery).then(function (historyDataResponse) {
        const ccMarketData =  [historyDataResponse.data.Data['AggregatedData']];
        const exchangeMarketData = historyDataResponse.data.Data['Exchanges'];

        return DataFetchAPI.mergeExchangeList(exchangeMarketData).then(function(exchangeListResponse){

          console.log(exchangeListResponse);
          const coinTradeData = exchangeListResponse.data.concat(ccMarketData);
          let coinTradeNormalizedData = coinTradeData.map(function(tradeDataItem){
            return Object.assign(...Object.keys(tradeDataItem).map(function(keyItem){
              let obj = {};
              obj[keyItem.toLowerCase()] = tradeDataItem[keyItem];
              return obj;
            }))
          });
          res.send({data: {symbol: coinSnapShotQuery, exchangeData: coinTradeNormalizedData}});
          const queries = [];
          coinTradeNormalizedData.forEach(function(coinTradeData){
            let keys = Object.keys(coinTradeData).map(function(key){
              if (key === "lastmarket") {
                return null;
              }
              return key;
            }).filter(Boolean).join(", ");
            let placeholders = Object.keys(coinTradeData).map(function(key){
              if (key === "lastmarket") {
                return null;
              }
              return "?";
            }).filter(Boolean).join(", ");
            let values = Object.keys(coinTradeData).map(function(key){
              if (key === "lastmarket") {
                return null;
              }
              return coinTradeData[key]
            }).filter(Boolean);
            let ttl = 400;
            const query = 'INSERT INTO churchdb.coin_details (' + keys + ') VALUES (' + placeholders + ') USING TTL ' +ttl;
            queries.push({
              query: query,
              params: values
            })
          });
          return cassandraClient.batch(queries, { prepare: true })
            .then(result => console.log('Data updated on cluster'));
        });
      }).catch(function (e) {
        console.log(e);
      });
    }
  });
});

router.get('/coin-history-data', function(req, res, next){
  let coinListQuery = req.query.coin_symbol;
  cassandraClient.execute("SELECT * from churchdb.coin_history_data where symbol=" + coinListQuery, function (err, result) {
    if (result && result.rows.length > 0) {
      let responseData = {};
      responseData[coinListQuery] = result.rows;
      res.send({data: responseData});
    } else {
      getCoinList.getCoinMinuteData(coinListQuery).then(function (historyDataResponse) {
        const coinDataResponse = historyDataResponse.data.Data;
        coinDataResponse.forEach(function(dataResponseItem){
          const placeHolders = "?, ?, ?, ?, ?, ?, ?, ?";
          const keys = "time ,high ,low ,open ,volumefrom , volumeto ,close, symbol";
          let values = [];
          Object.keys(dataResponseItem).forEach(function(key){
            values.push(dataResponseItem[key]);
          });
          values.push(coinListQuery);
          let ttl = Math.floor(Math.random() * 300) + 200;
          const query = 'INSERT INTO churchdb.coin_history_data (' + keys + ') VALUES (' + placeHolders + ') USING TTL ' +ttl;
          const params = values;

          cassandraClient.execute(query, params, {prepare: true}, function (err, response) {
            if (err) {
              console.log(err);
            }
          });
        });
        let responseData = {};
        responseData[coinListQuery] = coinDataResponse;
        res.send({data: responseData});
      });
    }
  });
  //res.send({error: ""});
});

module.exports = router;
