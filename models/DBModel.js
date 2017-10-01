

const cassandra = require('cassandra-driver');
const cassandraClient = new cassandra.Client({contactPoints: ['127.0.0.1']});

module.exports = {
  getCassandraClientConnection: function() {
    return cassandraClient.connect()
  },

}
