

const cassandra = require('cassandra-driver');
var Storage = require("../constants/Storage")
const cassandraClient = new cassandra.Client({contactPoints: [Storage.CQL_API_SERVER]});

module.exports = {
  getCassandraClientConnection: function() {
    return cassandraClient.connect()
  },

}
