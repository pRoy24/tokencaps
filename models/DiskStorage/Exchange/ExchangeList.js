/**
 Copyright Church of Crypto, Baron Nashor
 */
const cassandra = require('cassandra-driver');
var Storage = require('../../../constants/Storage');
const cassandraClient = new cassandra.Client({contactPoints: [Storage.CQL_API_SERVER]});

module.exports = {
  getExchangeList: function () {
    const query = "select * from churchdb.exchanges";
    return cassandraClient.execute(query).then(function(response){
      return {data: response.rows[0]};
    });
  },
}