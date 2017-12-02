/**
 Copyright Church of Crypto, Baron Nashor
 */
const cassandra = require('cassandra-driver');
var Storage = require('../../../constants/Storage');
const cassandraClient = new cassandra.Client({contactPoints: [Storage.CQL_API_SERVER]});

module.exports = {
  getCoinItem: function(coinSymbol) {
    const query = "select * from tokenplex.coins where symbol = '"+coinSymbol+"'";
    return cassandraClient.execute(query).then(function(response){
      return {data: response.rows[0]};
    });
  },
  getCoinSnapShot: function(coinSymbol) {
    const query = "select * from tokenplex.coin_details where fromsymbol = '"+coinSymbol+"'";
    return cassandraClient.execute(query).then(function(response){
      if (response && response.rows.length > 0) {
        return response.rows;
      } else {}
    });
  },
  getCoinSocialData: function(coinID) {
    const query = "select * from tokenplex.coin_social where id = '"+coinID +"'";
    return cassandraClient.execute(query).then(function(response){
      return {data: response.rows};
    }).catch(function(err){
      return {error: err};
    });
  },
  getCoinDataArray: function() {
    const query = "select * from tokenplex.coins";
    return cassandraClient.execute(query).then(function(response){
      return {data: response.rows};
    });
  },
  getCoinDayHistoryData: function(coinSymbol) {
    const query = "SELECT * from tokenplex.daily_history_data where symbol='" + coinSymbol+"'";
    return cassandraClient.execute(query).then(function(response){
      return {data: response.rows};
    });
  },

  getCoinWeekHistoryData: function(coinSymbol) {
    const query = "SELECT * from tokenplex.week_history_data where symbol='" + coinSymbol + "'";
    return cassandraClient.execute(query).then(function(response){
      return {data: response.rows};
    });
  },

  searchCoinByQuery: function(coinSearchQuery) {
    const query = "SELECT * from tokenplex.coins where fullname like '%" + coinSearchQuery.trim() + "%'";
    return cassandraClient.execute(query).then(function(response){
      return {data: response.rows};
    });
  }
}