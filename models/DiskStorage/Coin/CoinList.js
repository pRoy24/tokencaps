/**
 Copyright Church of Crypto, Baron Nashor
 */
const cassandra = require('cassandra-driver');
const cassandraClient = new cassandra.Client({contactPoints: ['127.0.0.1']});

module.exports = {
  getCoinItem: function(coinSymbol) {
    const query = "select * from churchdb.coins where symbol = '"+coinSymbol+"'";
    return cassandraClient.execute(query).then(function(response){
      return {data: response.rows[0]};
    });
  },
  getCoinSnapShot: function(coinSymbol) {
    const query = "select * from churchdb.coin_details where fromsymbol = '"+coinSymbol+"'";
    return cassandraClient.execute(query).then(function(response){
      if (response && response.rows.length > 0) {
        return response.rows;
      } else {}
    });
  },
  getCoinSocialData: function(coinID) {
    const query = "select * from churchdb.coin_social where id = '"+coinID +"'";
    return cassandraClient.execute(query).then(function(response){
      return {data: response.rows};
    }).catch(function(err){
      return {error: err};
    });
  },
  getCoinDataArray: function() {
    const query = "select * from churchdb.coins";
    return cassandraClient.execute(query).then(function(response){
      return {data: response.rows};
    });
  },
  getCoinDayHistoryData: function(coinSymbol) {
    const query = "SELECT symbol, time, high from churchdb.daily_history_data where symbol='" + coinSymbol+"'";
    return cassandraClient.execute(query).then(function(response){
      return {data: response.rows};
    });
  },

  searchCoinByQuery: function(coinSearchQuery) {
    const query = "SELECT * from churchdb.coins where fullname like '%" + coinSearchQuery.trim() + "%'";
    return cassandraClient.execute(query).then(function(response){
      return {data: response.rows};
    });
  }
}