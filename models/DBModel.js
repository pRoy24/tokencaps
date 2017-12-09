
const cassandra = require('cassandra-driver');
var Constants = require('../constants');
const cassandraClient = new cassandra.Client({contactPoints: [Constants.CQL_API_SERVER]});

module.exports = {
  getCassandraClientConnection: function() {
    return cassandraClient.connect()
  },

}
