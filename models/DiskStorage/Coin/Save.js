/**
 Copyright Church of Crypto, Baron Nashor
 */
const cassandra = require('cassandra-driver');
const cassandraClient = new cassandra.Client({contactPoints: ['127.0.0.1']});

module.exports = {
  saveCoinSnapshot: function(coinTradeNormalizedData) {
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
  },
  saveCoinSocialData: function(coinSocialData) {
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

    return cassandraClient.batch(queries, { prepare: true });
    })
  },

  saveCoinDayHistoryData: function (coinHistoryData, coinSymbol) {
    coinHistoryData.forEach(function(dataResponseItem){
      const placeHolders = "?, ?, ?";
      let values = [coinSymbol, dataResponseItem["high"], dataResponseItem["time"]];
      let keyItems = "symbol, high, time";
      let ttl = 6000;
      const query = 'INSERT INTO churchdb.daily_history_data (' + keyItems + ') VALUES (' + placeHolders + ') USING TTL ' +ttl;
      const params = values;

      cassandraClient.execute(query, params, {prepare: true}, function (err, response) {
        if (err) {
          console.log(err);
        }
      });
    });
  }
}