// pRoy24 tokenplex

let express = require('express');
var DBConnection = require('../../models/DBModel');
const cassandra = require('cassandra-driver');
var Constants = require('../../constants');
const cassandraClient = new cassandra.Client({contactPoints: [Constants.CQL_API_SERVER]});

const logger = require('../../logs/logger');

module.exports = {
  // Create Coin List table, used to render top level views
  createCoinListTable: function(req, res) {
    DBConnection.getCassandraClientConnection()
      .then(function () {
        const query = "CREATE KEYSPACE IF NOT EXISTS tokenplex WITH replication =" +
          "{'class': 'SimpleStrategy', 'replication_factor': '1' }";
        return cassandraClient.execute(query);
      }).then(function(){
      const deleteQuery = "DROP TABLE IF EXISTS tokenplex.coins";
      return cassandraClient.execute(deleteQuery)
    }).then(function(deleteTableResponse){
      const Create_Coin_Table = "CREATE TABLE IF NOT EXISTS tokenplex.coins" +
        " (TimeStamp varchar," +
        "id varchar," +
        "name varchar," +
        "symbol varchar," +
        "rank varchar," +
        "price_usd varchar," +
        "price_btc varchar," +
        "daily_volume_usd varchar," +
        "market_cap_usd varchar," +
        "available_supply varchar," +
        "total_supply varchar," +
        "percent_change_1h varchar," +
        "percent_change_24h varchar," +
        "percent_change_7d varchar," +
        "last_updated varchar," +
        "url varchar," +
        "imageurl varchar," +
        "coinname varchar," +
        "fullname varchar," +
        "algorithm varchar," +
        "prooftype varchar," +
        "fullypremined varchar," +
        "totalcoinsupply varchar," +
        "preminedvalue varchar," +
        "totalcoinsfreefloat varchar," +
        "sortorder varchar, " +
          "max_supply varchar, " +
          "sponsored varchar, " +
        "PRIMARY KEY(symbol))";
      return cassandraClient.execute(Create_Coin_Table);
    })
      .then(function(createTableResponse){
/*        let sdsiQuery = "CREATE CUSTOM INDEX  fn_prefix ON tokenplex.coins (fullname)" +
                        " USING 'org.apache.cassandra.index.sasi.SASIIndex' WITH OPTIONS = { " +
                        "'mode': 'CONTAINS'," +
                        "'analyzer_class': 'org.apache.cassandra.index.sasi.analyzer.NonTokenizingAnalyzer'," +
                        "'case_sensitive': 'false'"+
                        "}";

        cassandraClient.execute(sdsiQuery);*/
        return res.send({data: createTableResponse});
      })
      .catch(function (err) {
        console.error('There was an error', err);
        return cassandraClient.shutdown();
      });
  },

  // Create Coin 24 hour history table, consists of hourly data points.
  createDayHistoryTable: function(req, res, next) {
    const CREATE_DAILY_HISTORY_TABLE = "CREATE TABLE IF NOT EXISTS tokenplex.daily_history_data" +
      "( symbol varchar," +
      " time timestamp," +
      " high float," +
      " low float," +
      " open float," +
      " volumefrom float," +
      " volumeto float," +
      " close float, PRIMARY KEY(symbol, time))";
    const DELETE_DAILY_HISTORY_TABLE = "DROP TABLE IF EXISTS tokenplex.daily_history_data";

    cassandraClient.connect()
      .then(function () {
        return cassandraClient.execute(DELETE_DAILY_HISTORY_TABLE).then(function () {
          return cassandraClient.execute(CREATE_DAILY_HISTORY_TABLE)
        })
          .then(function (createTableResponse) {
            res.send({data: createTableResponse});

          }).catch(function (err) {
            res.send({"error": err});
          });
      });
  },

  // Create Coin 7 day history table, consists of hourly data points.
  createCoinWeekHistoryTable: function(req, res, next) {
    const CREATE_WEEK_HISTORY_TABLE = "CREATE TABLE IF NOT EXISTS tokenplex.week_history_data" +
      "(symbol varchar," +
       "tosymbol varchar," +
       "time timestamp," +
       "high float," +
       "low float," +
       "open float," +
        "close float," +
       "volumefrom float," +
       "volumeto float," +
       "close float, PRIMARY KEY(symbol, time))";
    const DELETE_WEEK_HISTORY_TABLE = "DROP TABLE IF EXISTS tokenplex.week_history_data";

    cassandraClient.connect()
      .then(function () {
        return cassandraClient.execute(DELETE_WEEK_HISTORY_TABLE).then(function () {
          return cassandraClient.execute(CREATE_WEEK_HISTORY_TABLE)
        })
          .then(function (createTableResponse) {
            res.send({data: createTableResponse});

          }).catch(function (err) {
            res.send({"error": err});
          });
      });
  },

  // Create Coin 1 year history table, consists of daily data points.
  createCoinYearlyHistoryTable: function(req, res, next) {
    const CREATE_ALL_TIME_HISTORY_TABLE = "CREATE TABLE IF NOT EXISTS tokenplex.year_history_data" +
      "(symbol varchar," +
        "tosymbol varchar,"+
      " time varchar," +
      "high float," +
      "low float," +
      "open float," +
      "close float," +
      "volumefrom float," +
      "volumeto float," +
      "close float, PRIMARY KEY(symbol, tosymbol, time))";
    const DELETE_ALL_TIME_HISTORY_TABLE = "DROP TABLE IF EXISTS tokenplex.year_history_data";
    cassandraClient.connect()
      .then(function () {
        return cassandraClient.execute(DELETE_ALL_TIME_HISTORY_TABLE).then(function () {
          return cassandraClient.execute(CREATE_ALL_TIME_HISTORY_TABLE)
        })
          .then(function (createTableResponse) {
            logger.log({"level": "info", "message": "All time history data table created"})
            res.send({data: createTableResponse});
            return createTableResponse;
          }).catch(function (err) {
            logger.log({"level": "error", "message": JSON.stringify(err)})
            return err;
          });
      });
  },

  // Create Coin All Time history table
  createAllTimeHistoryTable: function(req, res, next) {
    const CREATE_ALL_TIME_HISTORY_TABLE = "CREATE TABLE IF NOT EXISTS tokenplex.coin_all_time_history_data" +
      "(symbol varchar," +
      " time timestamp," +
      "high float," +
      "low float," +
      "open float," +
      "volumefrom float," +
      "volumeto float," +
      "close float, PRIMARY KEY(symbol, time))";
    const DELETE_ALL_TIME_HISTORY_TABLE = "DROP TABLE IF EXISTS tokenplex.coin_all_time_history_data";
    cassandraClient.connect()
      .then(function () {
        return cassandraClient.execute(DELETE_ALL_TIME_HISTORY_TABLE).then(function () {
          return cassandraClient.execute(CREATE_ALL_TIME_HISTORY_TABLE)
        })
          .then(function (createTableResponse) {
            res.send({data: createTableResponse});
            return cassandraClient.metadata.getTable('tokenplex', 'coin_all_time_history_data');

          }).catch(function (err) {
            res.send({"error": err});
          });
      });
  },

  // Create Coin Snapshot table
  createCoinSnapshotTable: function(req, res, next) {
    const CREATE_COIN_SNAPSHOT_TABLE = "CREATE TABLE IF NOT EXISTS tokenplex.coin_details" +
      "(type varchar," +
      "market varchar," +
      "open24hour varchar,"+
      "fromsymbol varchar," +
      "tosymbol varchar," +
      "flags varchar," +
      "price varchar," +
      "lastupdate varchar," +
      "lastvolume varchar," +
      "lastvolumeto varchar," +
      "lasttradeid varchar," +
      "volume24hour varchar," +
      "volume24hourto varchar," +
      "openhourto varchar," +
      "high24hour varchar," +
      "low24hour varchar," +
      "PRIMARY KEY(fromsymbol, tosymbol, market))";
    const DELETE_COIN_SNAPSHOT_TABLE = "DROP TABLE IF EXISTS tokenplex.coin_details";
    DBConnection.getCassandraClientConnection()
      .then(function () {
        return cassandraClient.execute(DELETE_COIN_SNAPSHOT_TABLE).then(function () {
          return cassandraClient.execute(CREATE_COIN_SNAPSHOT_TABLE)
        })
          .then(function (createTableResponse) {
            res.send({data: createTableResponse});

          }).catch(function (err) {
            res.send({"error": err});
          });
      });
  },

  createExchangeTable: function(req, res) {
    const Delete_Exchange_Table = "DROP TABLE IF EXISTS tokenplex.exchanges";
    const Create_Exchange_Table = "CREATE TABLE IF NOT EXISTS tokenplex.exchanges" +
      " (TimeStamp TIMESTAMP," +
      "exch_id varchar," +
      "exch_name varchar," +
      "exch_code varchar," +
      "exch_fee varchar," +
      "exch_trade_enabled varchar," +
      "exch_balance_enabled varchar," +
      "exch_url varchar," +
      "PRIMARY KEY(exch_id))";

    cassandraClient.execute(Delete_Exchange_Table).then(function(deleteTableResponse){

      return cassandraClient.execute(Create_Exchange_Table);
    })
      .then(function(createTableResponse){
        return res.send({data: createTableResponse});
      })
      .catch(function (err) {
        console.log(err);
         res.send({error:err});
        return err;
      });
  },

  createCoinSocialTable: function(req, res) {
    const Delete_Social_Table = "DROP TABLE IF EXISTS tokenplex.coin_social";
    const Create_Social_Table = "CREATE TABLE IF NOT EXISTS tokenplex.coin_social" +
      " (TimeStamp TIMESTAMP," +
      " id varchar," +
      " Reddit text," +
      " Facebook text," +
      " Twitter text," +
      " CodeRepository Text, PRIMARY KEY(id))";

    cassandraClient.execute(Delete_Social_Table).then(function(deleteTableResponse){
      return cassandraClient.execute(Create_Social_Table);
    })
      .then(function(createTableResponse){
         res.send({data: createTableResponse});
      })
      .catch(function (err) {
        console.log(err);
        return cassandraClient.shutdown();
      });
  },

  createAllTables: function(req, res) {
    createKeySpace().then(function(createKeySpaceResponse) {
      logger.log({"level": "info", "message": "create table request submitted"});
      createCoinDailyHistoryTable();
      createCoinWeeklyHistoryTable();
      createCoinYearlyHistoryTable();
      createCoinSocialTable();
      createCoinSnapshotTable();
    });
    res.send({"data": "Create Table Request submitted"});
  }
}

function createKeySpace() {
  return DBConnection.getCassandraClientConnection()
    .then(function () {
      const query = "CREATE KEYSPACE IF NOT EXISTS tokenplex WITH replication =" +
        "{'class': 'SimpleStrategy', 'replication_factor': '1' }";
      return cassandraClient.execute(query).then(function(response){
        return response;
      });
    }).catch(function(err){
      logger.log({"level": "error", "message": JSON.stringify(err)});
      return err;
    });
}

function createCoinSnapshotTable() {
  const CREATE_COIN_SNAPSHOT_TABLE = "CREATE TABLE IF NOT EXISTS tokenplex.coin_details" +
    "(type varchar," +
    "market varchar," +
    "open24hour varchar,"+
    "fromsymbol varchar," +
    "tosymbol varchar," +
    "flags varchar," +
    "price varchar," +
    "lastupdate varchar," +
    "lastvolume varchar," +
    "lastvolumeto varchar," +
    "lasttradeid varchar," +
    "volume24hour varchar," +
    "volume24hourto varchar," +
    "openhourto varchar," +
    "high24hour varchar," +
    "low24hour varchar," +
    "PRIMARY KEY(fromsymbol, tosymbol, market))";
  const DELETE_COIN_SNAPSHOT_TABLE = "DROP TABLE IF EXISTS tokenplex.coin_details";
   return cassandraClient.execute(DELETE_COIN_SNAPSHOT_TABLE).then(function () {
        return cassandraClient.execute(CREATE_COIN_SNAPSHOT_TABLE)
      })
        .then(function (createTableResponse) {
          logger.log({"level": "info", "details": "created coin snapshot table"});
          return (createTableResponse);
        }).catch(function (err) {
          return (err);
        });
}

function createCoinSocialTable() {
  const Delete_Social_Table = "DROP TABLE IF EXISTS tokenplex.coin_social";
  const Create_Social_Table = "CREATE TABLE IF NOT EXISTS tokenplex.coin_social" +
    " (TimeStamp TIMESTAMP," +
    " id varchar," +
    " Reddit text," +
    " Facebook text," +
    " Twitter text," +
    " CodeRepository Text, PRIMARY KEY(id))";

  return cassandraClient.execute(Delete_Social_Table).then(function(){
    return cassandraClient.execute(Create_Social_Table);
  })
    .then(function(createTableResponse){
      logger.log({
        "level": "info", "message": "Coin Social table created"
      });
      return createTableResponse;
    })
    .catch(function (err) {
      logger.log({"level": "error", "message": JSON.stringify(err)})
      return err;
    });
}

function createCoinDailyHistoryTable() {
  const CREATE_DAILY_HISTORY_TABLE = "CREATE TABLE IF NOT EXISTS tokenplex.coin_daily_history_data" +
    "( symbol varchar," +
    " time timestamp," +
    " high float," +
    " low float," +
    " open float," +
    " volumefrom float," +
    " volumeto float," +
    " close float, PRIMARY KEY(symbol, time))";
  const DELETE_DAILY_HISTORY_TABLE = "DROP TABLE IF EXISTS tokenplex.coin_daily_history_data";
  return cassandraClient.execute(DELETE_DAILY_HISTORY_TABLE).then(function () {
    return cassandraClient.execute(CREATE_DAILY_HISTORY_TABLE)
  }).then(function (createTableResponse) {
    logger.log({
      "level": "info", "message": "Daily History Table created"
    });
    return({data: createTableResponse});
  }).catch(function (err) {
    logger.log({"level": "error", "message": JSON.stringify(err)})
    return {error: err};
  });
}

function createCoinWeeklyHistoryTable() {
  const CREATE_WEEK_HISTORY_TABLE = "CREATE TABLE IF NOT EXISTS tokenplex.week_history_data" +
    "(symbol varchar," +
    " time varchar," +
    "tosymbol varchar," +
    "high float," +
    "low float," +
    "open float," +
    "volumefrom float," +
    "volumeto float," +
    "close float, PRIMARY KEY(symbol, tosymbol, time))";
  const DELETE_WEEK_HISTORY_TABLE = "DROP TABLE IF EXISTS tokenplex.week_history_data";
  return cassandraClient.execute(DELETE_WEEK_HISTORY_TABLE).then(function () {
    return cassandraClient.execute(CREATE_WEEK_HISTORY_TABLE)
  }).then(function (createTableResponse) {
    logger.log({"level": "info", "message": "Weekly history table created week_history_data"});
    return createTableResponse;
  }).catch(function (err) {
    logger.log({"level": "error", "message": JSON.stringify(err)});
    return err;
  });
}

function createCoinYearlyHistoryTable() {
  const CREATE_YEAR_HISTORY_TABLE = "CREATE TABLE IF NOT EXISTS tokenplex.year_history_data" +
    "(symbol varchar," +
      "tosymbol varchar," +
     "time varchar," +
    "high float," +
    "low float," +
    "open float," +
    "volumefrom float," +
    "volumeto float," +
    "close float, PRIMARY KEY(symbol, tosymbol, time))";
  const DELETE_YEAR_HISTORY_TABLE = "DROP TABLE IF EXISTS tokenplex.year_history_data";

  cassandraClient.connect()
    .then(function () {
      return cassandraClient.execute(DELETE_YEAR_HISTORY_TABLE).then(function () {
        return cassandraClient.execute(CREATE_YEAR_HISTORY_TABLE)
      })
        .then(function (createTableResponse) {
          logger.log({"level": "info", "message": "Yearly history data table created year_history_data"})
          return createTableResponse;
        }).catch(function (err) {
          logger.log({"level": "error", "message": JSON.stringify(err)})
          return err;
        });
    });
}

