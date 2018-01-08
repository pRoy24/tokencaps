// pRoy24 TokenPlex

const cassandra = require('cassandra-driver');
var Constants = require('../../../constants');
var ObjectUtils = require('../../../utils/ObjectUtils');
const cassandraClient = new cassandra.Client({contactPoints: [Constants.CQL_API_SERVER]});


module.exports = {
  findExchangesForToken: function(baseToken) {
    const findMarketQuery = "SELECT * from tokenplex.token_exchange_list where base ='" + baseToken + "'";
    return cassandraClient.execute(findMarketQuery).then(function(response){
      return response;
    }).catch(function(err){
      return {data: [], "error": err};
    });
  },

  getMarketTradesForToken: function(baseToken, quoteToken) {
    return new Promise(resolve => {
      setTimeout(() => {
        let normalizedExchangeList = [];
        resolve(normalizedExchangeList);
      }, 100);
    });
  },

  getMarketsForExchange: function(exchangeName) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({rows: []});
      }, 100);
    });
  },

  getExchangeWeekHistory: function(exchangeName, baseToken, quoteToken) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({rows: []});
      }, 100);
    });
  },

  getExchangeOrderbook: function(exchangeCode, baseToken, quoteToken) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({rows: []});
      }, 100);
    });
  },

  getExchangeDetails: function(exchangeCode) {
    const findMarketQuery = "SELECT * from tokenplex.market_detail where exchange ='" + exchangeCode + "'";

    return cassandraClient.execute(findMarketQuery).then(function(response){
      if (ObjectUtils.isNonEmptyArray(response.rows)) {
        let responseObject = {};
        responseObject[response.rows[0].exchange] = JSON.parse(response.rows[0].detail);

        return responseObject;
      }
      else {
        return {};
      }
    }).catch(function(err){
      return {};
    });
  },



  getMinutelySampledHistoryData: function(exchangeCode, baseToken, quoteToken) {
    const query = "SELECT * from tokenplex.exchange_min_sample_history where exchange='"+
      exchangeCode+"' AND base='"+baseToken+"' AND quote='"+quoteToken+"'";
    return cassandraClient.execute(query).then(function(response){
      if (response && response.rows.length > 0) {
        return JSON.parse(response.rows[0].detail);
      } else {
        return [];
      }
    }).catch(function(err){
      return [];
    });
  },

  getHourlySampledHistoryData: function(exchangeCode, baseToken, quoteToken) {
    const query = "SELECT * from tokenplex.exchange_hour_sample_history where exchange='"+
      exchangeCode+"' AND base='"+baseToken+"' AND quote='"+quoteToken+"'";
    return cassandraClient.execute(query).then(function(response){
      if (response && response.rows.length > 0) {
        return JSON.parse(response.rows[0].detail);
      } else {
        return [];
      }
    }).catch(function(err){
      return [];
    });
  },

  getDailySampledHistoryData: function(exchangeCode, baseToken, quoteToken) {
    const query = "SELECT * from tokenplex.exchange_day_sample_history where exchange='"+
      exchangeCode+"' AND base='"+baseToken+"' AND quote='"+quoteToken+"'";
    return cassandraClient.execute(query).then(function(response){
      if (response && response.rows.length > 0) {
        return JSON.parse(response.rows[0].detail);
      } else {
        return [];
      }
    }).catch(function(err){
      return [];
    });
  },

  hasExchangeDetailsExpired(exchangeCode) {
    const findMarketQuery = "SELECT lastupdate from tokenplex.market_detail where exchange ='" + exchangeCode + "'";

    return cassandraClient.execute(findMarketQuery).then(function(response){
      if (ObjectUtils.isNonEmptyArray(response.rows)) {
        const lastUpdateValueString = response.rows[0].lastupdate;
        const fromTime = new Date(lastUpdateValueString);
        const toTime = new Date();

        const differenceTravel = toTime.getTime() - fromTime.getTime();
        const secondsElapsed = Math.floor((differenceTravel) / (1000));
        if (secondsElapsed > 10) {
          return true;
        } else {
          return false;
        }
      }
      else {
        return true;
      }
    }).catch(function(err){
      return true;
    });

  }


}