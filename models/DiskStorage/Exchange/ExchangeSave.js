// pRoy24 tokenplex

const cassandra = require('cassandra-driver');
var Constants = require('../../../constants');
const cassandraClient = new cassandra.Client({contactPoints: [Constants.CQL_API_SERVER]});

module.exports ={
  saveExchangeList: function(exchangeList) {
    exchangeList.forEach(function(exchangeItem){
      const placeHolders = "?,?,?,?,?,?,?";
      let values = [];
      let keys = "";
      Object.keys(exchangeItem).forEach(function(exchangeItemKey, exchangeIdx, arr){
        values.push(exchangeItem[exchangeItemKey]);
        keys += exchangeItemKey;
        if (exchangeIdx < arr.length - 1) {
          keys += ",";
        }
      });
      let ttl = 6000;
      const query = 'INSERT INTO tokenplex.exchanges (' + keyItems + ') VALUES (' + placeHolders + ') USING TTL ' +ttl;
      const params = values;
      cassandraClient.execute(query, params, {prepare: true}, function (err, response) {
        if (err) {
          console.log(err);
        }
      });

    })
  },

  saveCoinDayHistoryData: function (coinHistoryData, coinSymbol) {
    coinHistoryData.forEach(function(dataResponseItem){
      const placeHolders = "?, ?, ?, ?, ?, ?, ?, ?";
      let values = [coinSymbol];
      let keyItems = "symbol,";
      Object.keys(dataResponseItem).forEach(function(key, idx, arr){
        if (key !== "symbol") {
          keyItems += key;
          if (idx < arr.length - 1) {
            keyItems += ",";
          }
          values.push(dataResponseItem[key]);
        }
      });

      let ttl = 6000;
      const query = 'INSERT INTO tokenplex.daily_history_data (' + keyItems + ') VALUES (' + placeHolders + ') USING TTL ' +ttl;
      const params = values;

      cassandraClient.execute(query, params, {prepare: true}, function (err, response) {
        if (err) {
          console.log(err);
        }
      });
    });
  },


  saveExchangeDetails: function(exchangeData) {
    let currentTimeStamp = Date.now();
    const placeHolder = "? , ?, ?";
    const exchangeName = Object.keys(exchangeData)[0];
    const values = [exchangeName, JSON.stringify(exchangeData[exchangeName]), currentTimeStamp];
    const keyItems = "exchange, detail, lastupdate";

    let TTL = 86400;
    const query  = "INSERT INTO tokenplex.market_detail ("+keyItems+") VALUES ("+ placeHolder +") USING TTL " + TTL;
   return cassandraClient.execute(query, values, {prepare: true}).then(function(response){
     return response;
   }).catch(function(err){

   })
  },

  saveMarketsForExchange: function(exchangeMarketData) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({rows: []});
      }, 100);
    });
  },

  saveMinutelySampledHistoryData: function(exchangeCode, baseToken, quoteToken, apiWeekHistoryResponse) {
    const placeholders = "?, ?, ?, ?";
    let values = [exchangeCode, baseToken, quoteToken, JSON.stringify(apiWeekHistoryResponse)];
    const keyItems = "exchange, base, quote, detail";
    const TTL = 10;

    const query  = "INSERT INTO tokenplex.exchange_min_sample_history ("+keyItems+") VALUES ("+ placeholders +") USING TTL " + TTL;
    return cassandraClient.execute(query, values, {prepare: true}, function (err, response) {
      return response;
    });
  },

  saveHourlySampledHistoryData: function(exchangeCode, baseToken, quoteToken, apiWeekHistoryResponse) {
    const placeholders = "?, ?, ?, ?";
    let values = [exchangeCode, baseToken, quoteToken, JSON.stringify(apiWeekHistoryResponse)];
    const keyItems = "exchange, base, quote, detail";
    const TTL = 30 * 60; // TTL 30 Mins

    const query  = "INSERT INTO tokenplex.exchange_hour_sample_history ("+keyItems+") VALUES ("+ placeholders +") USING TTL " + TTL;
    return cassandraClient.execute(query, values, {prepare: true}, function (err, response) {
      return response;
    });
  },

  saveDailySampledHistoryData: function(exchangeCode, baseToken, quoteToken, apiWeekHistoryResponse) {
    const placeholders = "?, ?, ?, ?";
    let values = [exchangeCode, baseToken, quoteToken, JSON.stringify(apiWeekHistoryResponse)];
    const keyItems = "exchange, base, quote, detail";
    const TTL = 12 * 60 * 60; // TTL 12 Hours

    const query  = "INSERT INTO tokenplex.exchange_day_sample_history ("+keyItems+") VALUES ("+ placeholders +") USING TTL " + TTL;
    return cassandraClient.execute(query, values, {prepare: true}, function (err, response) {
      return response;
    });
  },
}