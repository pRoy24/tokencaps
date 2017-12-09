// pRoy24 tokenplex

const cassandra = require('cassandra-driver');
var Constants = require('../../../constants');
const cassandraClient = new cassandra.Client({contactPoints: [Constants.CQL_API_SERVER]});

module.exports = {
  getExchangeList: function () {
    const query = "select * from tokenplex.exchanges";
    return cassandraClient.execute(query).then(function(response){
      return {data: response.rows[0]};
    });
  },
}