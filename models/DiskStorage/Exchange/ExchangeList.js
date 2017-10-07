/**
 Copyright Church of Crypto, Baron Nashor
 */
const cassandra = require('cassandra-driver');
const cassandraClient = new cassandra.Client({contactPoints: ['127.0.0.1']});

module.exports = {
  getExchangeList: function () {
    const query = "select * from churchdb.exchanges";
    return cassandraClient.execute(query).then(function(response){
      return {data: response.rows[0]};
    });
  },
}