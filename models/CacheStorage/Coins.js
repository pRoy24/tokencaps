// pRoy24 TokenPlex
//import {} from '../';
var Constants = require('../../constants');

var redis = require("redis"),
  client = redis.createClient({host: Constants.REDIS_API_SERVER});
bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
var ObjectUtils = require('../../utils/ObjectUtils');
const logger = require('../../logs/logger');

module.exports = {
  getCoinList: function(range) {
    return client.hgetallAsync("coins").then(function(response){
      let coinListArray = [];
        Object.keys(response).forEach(function(coinKey){
          if (response[coinKey]) {
            try {
              coinListArray.push(JSON.parse(response[coinKey]));
            } catch (e){
              // Log Error response
            }
          }
        });
        return {data: coinListArray};
    });
  },

  findCoinList: function() {
    client.hgetall("coins", function(err, res){
      if (err) {
        console.log(err);
      }
      res.send({"success": true});
    })
  },

  saveCoinList: function(coinList) {
    let arrayLog = [];
    arrayLog.push("coins");
     coinList.forEach(function(coinItem){
       if (ObjectUtils.isNonEmptyObject(coinItem)) {
         arrayLog.push(coinItem.symbol);
         arrayLog.push(coinItem);
         client.hset("coins", coinItem.symbol, JSON.stringify(coinItem), function (err, response) {
           if (err) {
              logger.log({"type":"error", "message": JSON.stringify(err)});
           } else {
              logger.log({"type": "info", "message": "saved coin list"});
           }
         });
       }
     });
    return("started coin list scrape");
  },

  searchCoin: function(coinSearchString) {
    return client.hgetallAsync("coins").then(function(response){
      let coinListArray = [];
      Object.keys(response).forEach(function(coinKey){
        let coinResponse  = JSON.parse(response[coinKey]);
        let coinFullName = coinResponse.fullname;

        if (new RegExp(coinSearchString.toLowerCase()).test(coinFullName.toLowerCase())) {
          coinListArray.push(coinResponse);
        }
      });
      return {data: coinListArray};
    });
  },

  deleteCoinList: function(token) {
    if (token === "proy24") {
      return client.hgetallAsync("coins").then(function(response) {
        if (ObjectUtils.isNonEmptyObject(response)) {
          Object.keys(response).forEach(function (coinKey) {
            client.hdel("coins", coinKey);
          });
        }
      });
    }
  },

  findCoinRow: function(coinSymbol){
    return client.hgetAsync("coins", coinSymbol).then(function(coinDataResponse){
      return coinDataResponse;
    })
  }


}