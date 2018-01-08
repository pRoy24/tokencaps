// pRoy24 TokenPlex

let express = require('express');
var DBConnection = require('../../models/DBModel');
const cassandra = require('cassandra-driver');
var Constants = require('../../constants');
const cassandraClient = new cassandra.Client({contactPoints: [Constants.CQL_API_SERVER]});

const logger = require('../../logs/logger');

module.exports = {

  // Create Exchange Market Table
  createTokenExchangeListTable: function(req, res, next) {
    DBConnection.getCassandraClientConnection()
      .then(function(){
        const createMarketsListQuery = "CREATE TABLE IF NOT EXISTS tokenplex.token_exchange_list" +
          "(market map<text,frozen<list<text>>>," +
          "base varchar," +
          "timestamp timestamp," +
          "quoteId varchar, PRIMARY KEY (base))";
        const deleteQuery = "DROP TABLE IF EXISTS tokenplex.markets_list";

        return cassandraClient.execute(deleteQuery).then(function(delQueryResponse){
          return cassandraClient.execute(createMarketsListQuery).then(function(createTableResponse){
            logger.log({"level": "info", "message": "markets_list table created"});
            res.send({"data": createTableResponse});
          });
        }).catch(function(ex){
          logger.log({"level": "error", "message": ex});
        });
      });
  },

  createExchangeOLHCVTables: function(req, res, next) {
    const createDaySampleOLHCVQuery = "CREATE TABLE IF NOT EXISTS tokenplex.exchange_day_sample_history"+
      "(base varchar," +
      "quote varchar," +
      "detail text," +
      "exchange varchar,"+
      "PRIMARY KEY (exchange, base, quote))";

    const createHourSampleOLHCVQuery = "CREATE TABLE IF NOT EXISTS tokenplex.exchange_hour_sample_history"+
      "(base varchar," +
      "quote varchar," +
      "detail text," +
      "exchange varchar,"+
      "PRIMARY KEY (exchange, base, quote))";

    const createMinSampleOLHCVQuery = "CREATE TABLE IF NOT EXISTS tokenplex.exchange_min_sample_history"+
      "(base varchar," +
      "quote varchar," +
      "detail text," +
      "exchange varchar,"+
      "PRIMARY KEY (exchange, base, quote))";

    const deleteMinSampleQuery = "DROP TABLE IF EXISTS tokenplex.exchange_min_sample_history";
    const deleteHourSampleQuery = "DROP TABLE IF EXISTS tokenplex.exchange_hour_sample_history";
    const deleteDaySampleQuery = "DROP TABLE IF EXISTS tokenplex.exchange_day_sample_history";

    cassandraClient.execute(deleteMinSampleQuery).then(function(response){
      return response;
    }).then(function(response){
      cassandraClient.execute(deleteHourSampleQuery).then(function(response){
        return response;
      }).then(function(){
        cassandraClient.execute(deleteDaySampleQuery).then(function(response){
          return response;
        }).then(function(){
          cassandraClient.execute(createMinSampleOLHCVQuery).then(function(response){
            return response;
          }).then(function(response){
            cassandraClient.execute(createHourSampleOLHCVQuery).then(function(response){
              return response;
            }).then(function(){
              cassandraClient.execute(createDaySampleOLHCVQuery).then(function(response){
                return response;
              })
            })
          })
        })
      })
    }).catch(function(err){
      console.log(err);
     // logger.log({type: "error", detail: err});
    });
    res.send({data: "started create table request"})
  },

  createExchangeMarketDetailTable: function(req, res, next) {
    DBConnection.getCassandraClientConnection()
      .then(function(){
        const createMarketsListQuery = "CREATE TABLE IF NOT EXISTS tokenplex.market_detail" +
          "(exchange varchar," +
          "detail text," +
          "lastupdate timestamp," +
          " PRIMARY KEY (exchange))";
        const deleteQuery = "DROP TABLE IF EXISTS tokenplex.market_detail";

        return cassandraClient.execute(deleteQuery).then(function(delQueryResponse){
          return cassandraClient.execute(createMarketsListQuery).then(function(createTableResponse){
            logger.log({"level": "info", "message": "markets_detail table created"});
            res.send({"data": createTableResponse});
          });
        }).catch(function(ex){
          logger.log({"level": "error", "message": ex});
        });
      });
  }

}
