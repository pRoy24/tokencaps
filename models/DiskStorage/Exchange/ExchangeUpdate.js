// pRoy24 TokenPlex


const cassandra = require('cassandra-driver');
var Constants = require('../../../constants');
const cassandraClient = new cassandra.Client({contactPoints: [Constants.CQL_API_SERVER]});

module.exports = {
  saveMarketActiveExchanges: function(coinActiveExchangesArray) {
    let queries = [];

    coinActiveExchangesArray.forEach(function(item, idx){
      const placeHolders = "?, ?, ?, ?";
      let values = [];
      let keyItems = "";
      Object.keys(item).forEach(function(key, idx, arr){
        keyItems += key;
        if (idx !== arr.length -1) {
          keyItems += ", ";
        }
        values.push(item[key]);
      });

      const MARKET_LIST_TTL = 86400;
      const query = 'INSERT INTO tokenplex.markets_list (' + keyItems + ') VALUES (' + placeHolders +
        ') USING TTL ' + MARKET_LIST_TTL;
      queries.push({
        query: query,
        params: values
      });
    });

    cassandraClient.batch(queries, { prepare: true }, function(err, res){
      if (err) {

      }
    });
  },

  saveMarketListByCoin: function(coinToMarketExchangesMap) {
    Object.keys(coinToMarketExchangesMap).forEach(function(baseCoin){
      const placeHolders = "?, ?";
      let values = [baseCoin, coinToMarketExchangesMap[baseCoin]];
      let keyItems = ["base", "market"];
      const MARKET_LIST_TTL = 86400;
      const query = 'INSERT INTO tokenplex.markets_list (' + keyItems + ') VALUES (' + placeHolders +
        ') USING TTL ' + MARKET_LIST_TTL;
      cassandraClient.execute(query, values, {prepare: true}, function(err, res){
        if (err) {
          console.log(err);
        }
      });
    });
  }
}