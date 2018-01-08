// pRoy24 tokenplex

const cassandra = require('cassandra-driver');
var Constants = require('../../../constants');
const cassandraClient = new cassandra.Client({contactPoints: [Constants.CQL_API_SERVER]});

module.exports = {
  saveCoinSnapshot: function(coinTradeNormalizedData) {
    const queries = [];
    coinTradeNormalizedData.forEach(function(coinTradeData) {

      delete coinTradeData["lastmarket"];
      if (coinTradeData["openday"]) {
        delete coinTradeData["openday"];
        delete coinTradeData["highday"];
        delete coinTradeData["lowday"];
        delete coinTradeData["volumeday"];
        delete coinTradeData["volumedayto"];
      }

      let keys = Object.keys(coinTradeData).map(function(key, idx){
        return key;
      }).filter(Boolean).join(", ");

      let placeholders = Object.keys(coinTradeData).map(function(key, idx){
        return "?";
      }).filter(Boolean).join(", ");

      let values = Object.keys(coinTradeData).map(function(key){
        return (coinTradeData[key]).toString();
      }).filter(Boolean);


      const query = 'INSERT INTO tokenplex.coin_details (' + keys + ') VALUES (' + placeholders + ') USING TTL 120';
      queries.push({
        query: query,
        params: values
      })
    });
    return cassandraClient.batch(queries, { prepare: true }, function(err, res){
      if (err) {
        return err;
      }
      return res;
    });
  },

  saveCoinSocialData: function(coinID, coinSocialData) {
    let Reddit = JSON.stringify(coinSocialData.Reddit);
    let Twitter = JSON.stringify(coinSocialData.Twitter);
    let Facebook = JSON.stringify(coinSocialData.Facebook);
    let Repository = JSON.stringify(coinSocialData.CodeRepository);

    const placeHolders = "?, ?, ?, ?, ?";
    let values = [coinID, Reddit, Facebook, Twitter, Repository];
    let keyItems = "id, Reddit, Facebook, Twitter, CodeRepository";

    const SOCIAL_DATA_TTL = 3600;
    const query = 'INSERT INTO tokenplex.coin_social (' + keyItems + ') VALUES (' + placeHolders + ') USING TTL ' + SOCIAL_DATA_TTL;
    const params = values;

    cassandraClient.execute(query, params, {prepare: true}, function (err, response) {
      if (err) {
        console.log(err);
      }
    });
    return null;
  },

  saveCoinListData: function(coinListData) {
    let arrays = [], size = 20;
    while (coinListData.length > 0)
      arrays.push(coinListData.splice(0, size));
    arrays.forEach(function (coinListData) {
      let queries = [];
    coinListData.forEach(function (listItem, idx) {
      let values = Object.keys(listItem).map(function (currentKey, currIdx) {
        if (currentKey && listItem[currentKey] && currentKey !== "sponsored" && currentKey !== "max_supply") {
          return listItem[currentKey];
        } else {
          return null;
        }
      }).filter(Boolean);
      let placeholders = Object.keys(values).map((a)=>"?").join(", ");
      let keyslist = Object.keys(listItem).map(function (currentKey, currIdx) {
        if (listItem[currentKey] && currentKey !== "sponsored" && currentKey !== "max_supply") {
          return currentKey;
        } else {
          return null;
        }
      }).filter(Boolean).join(",");

      const query = 'INSERT INTO tokenplex.coins (' + keyslist + ') VALUES (' + placeholders + ') USING TTL 120';
      queries.push({
        query: query,
        params: values
      })
    });

    return cassandraClient.batch(queries, { prepare: true });
    })
  },

  saveCoinDayHistoryData: function (coinHistoryDataList) {
    Object.keys(coinHistoryDataList).forEach(function(coinSymbol) {
      if (coinHistoryDataList[coinSymbol].length > 0) {
        let coinHistoryData = coinHistoryDataList[coinSymbol];
        coinHistoryData.forEach(function(dataResponseItem){
          const placeHolders = "?, ?, ?";
          let values = [coinSymbol, dataResponseItem["high"], dataResponseItem["time"]];
          let keyItems = "symbol, high, time";
          let ttl = 120;

          const query = 'INSERT INTO tokenplex.daily_history_data (' + keyItems + ') VALUES (' + placeHolders + ') USING TTL ' + ttl;
          const params = values;
          cassandraClient.execute(query, params, {prepare: true}, function (err, response) {
            if (err) {
              console.log(err);
            }
          });
        });
      }
    });
    return {data: "started job"};
  },

  saveCoinWeekMinuteHistoryData: function(coinHistoryDataList, toSymbol) {
    Object.keys(coinHistoryDataList).forEach(function(coinSymbol) {
      if (coinHistoryDataList[coinSymbol].length > 0) {
        let coinHistoryData = coinHistoryDataList[coinSymbol];
        coinHistoryData.forEach(function(dataResponseItem){
          const placeHolders = "?, ?, ?, ?, ?, ?, ?, ?, ?";
          let values = [coinSymbol, dataResponseItem["high"], dataResponseItem["low"],
            dataResponseItem["open"], dataResponseItem["close"], dataResponseItem["time"].toString(),
          dataResponseItem["volumefrom"], dataResponseItem["volumeto"], toSymbol];

          let keyItems = "symbol, high, low, open, close, time, volumefrom, volumeto, tosymbol";
          // TTL Strategy of 120 seconds for Minute history data for week
          let ttl = 120;
          const query = 'INSERT INTO tokenplex.week_history_data (' + keyItems + ') VALUES (' + placeHolders + ') USING TTL ' + ttl;
          const params = values;
          cassandraClient.execute(query, params, {prepare: true}, function (err, response) {
            if (err) {
              console.log(err);
            }
          });
        });
      }
    });
    return {data: "Coin Week History Data persist started"};
  },

  saveCoinYearDayHistoryData: function(coinYearHistoryData, toSymbol) {
    Object.keys(coinYearHistoryData).forEach(function(coinSymbol) {
      if (coinYearHistoryData[coinSymbol].length > 0) {
        let coinHistoryData = coinYearHistoryData[coinSymbol];
        coinHistoryData.forEach(function(dataResponseItem){
          const placeHolders = "?, ?, ?, ?, ?, ?, ?, ?, ?";
          let values = [coinSymbol, dataResponseItem["high"], dataResponseItem["low"],
            dataResponseItem["open"], dataResponseItem["close"], dataResponseItem["time"].toString(),
            dataResponseItem["volumefrom"], dataResponseItem["volumeto"], toSymbol];

          let keyItems = "symbol, high, low, open, close, time, volumefrom, volumeto, tosymbol";
          // TTL Strategy of 2000 seconds for Day history data per year.
          let ttl = 2000;

          const query = 'INSERT INTO tokenplex.year_history_data (' + keyItems + ') VALUES (' + placeHolders + ') USING TTL ' + ttl;
          const params = values;
          cassandraClient.execute(query, params, {prepare: true}, function (err, response) {
            if (err) {
              console.log(err);
            }
          });
        });
      }
    });
    return {data: "Coin Year History Data persist started"};
  },

  saveCoinArbitrage: function(coinArbitrageData) {
    const queries = [];
    coinArbitrageData.forEach(function(coinTradeData) {

      delete coinTradeData["lastmarket"];
      if (coinTradeData["openday"]) {
        delete coinTradeData["openday"];
        delete coinTradeData["highday"];
        delete coinTradeData["lowday"];
        delete coinTradeData["volumeday"];
        delete coinTradeData["volumedayto"];
      }

      let keys = Object.keys(coinTradeData).map(function(key, idx){
        return key;
      }).filter(Boolean).join(", ");

      let placeholders = Object.keys(coinTradeData).map(function(key, idx){
        return "?";
      }).filter(Boolean).join(", ");

      let values = Object.keys(coinTradeData).map(function(key){
        return (coinTradeData[key]).toString();
      }).filter(Boolean);


      const query = 'INSERT INTO tokenplex.coin_details (' + keys + ') VALUES (' + placeholders + ') USING TTL 120';
      queries.push({
        query: query,
        params: values
      });
    });
    return cassandraClient.batch(queries, { prepare: true }, function(err, res){
      if (err) {
        return err;
      }
      return res;
    });
  },

  deleteCoinDayHistoryData: function(coinSymbol) {
    const query = "DELETE FROM tokenplex.daily_history_data WHERE symbol = '" + coinSymbol +"'";
    return cassandraClient.execute(query).then(function(response){
      return response;
    });
  },

  saveCoinExtraDetails: function(coinDetails) {
    // TODO add method to save coin details
  }
}

function randomRange(l,h){
  var range = (h-l);
  var random = Math.floor(Math.random()*range);
  if (random === 0){random+=1;}
  return l+random;
}