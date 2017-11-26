
const DataFetchAPI = require('../../models/DataFetchAPI');
const User = require('../../models/DiskStorage/User/User');
var hat = require('hat');
var mongoose = require('mongoose');
// set Promise provider to bluebird
mongoose.Promise = require('bluebird');

var ObjectUtils = require('../../utils/ObjectUtils');
module.exports = {
  listCoins: function(req, res, next) {

    const headerParts = req.headers.authorization.split(' ')
    let token = "";
    if (headerParts[0].toLowerCase() === 'bearer') {
      token = headerParts[1];
    }
    let counter = 0;
    let responseArr = [];
    let coinList = JSON.parse(req.query.coinList).filter(Boolean);
    User.findOne({"token": token}).exec().then(function(userResponse){
      if (ObjectUtils.isNonEmptyObject(userResponse)) {
        userResponse.coins = coinList;
        userResponse.save().then(function(saveResponse){
          coinList.forEach(function(coin, idx, arr){
            DataFetchAPI.getCoinRow(coin).then(function(coinResponse){
              DataFetchAPI.getDailyHistoryData(coinResponse.data.symbol).then(function(dataResponse){
                let merged_response = Object.assign({}, coinResponse.data, {"weekly_data": dataResponse});
                counter ++;
                responseArr.push(merged_response);
                if (counter === (arr.length)) {
                  callback(responseArr);
                }
              });
            });
          });
        });
      }
    });
    function callback(response) {
      res.send({data: response});
    }
  },

  registerUser: function(req, res, next) {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const token = hat();

    let newUser = new User();
    newUser.username = username;
    newUser.password = password;
    newUser.email = email;
    newUser.token = token;
    newUser.save().then(function(response){
      res.send({"data": newUser});
    }).catch(function(err){
      res.send({"error": "unable to create user"});
    })
  },

  loginUser: function(req, res, next) {
    const username = req.body.username;
    const password = req.body.password;

    let promise = User.findOne({"username": username, "password": password}).exec();

    promise.then(function(user) {
      if (ObjectUtils.isNonEmptyObject(user)) {
        res.send({data: user});
      } else {
        res.send({error: "user not found"});
      }

    })
      .catch(function(err){
        // just need one of these
        console.log('error:', err);
      });
  },

  authenticateUser: function(req, res, next) {
    const token = req.body.token;
    let promise = User.findOne({"token": token}).exec();
    promise.then(function(user) {
      if (ObjectUtils.isNonEmptyObject(user)) {
        res.send({data: user});
      } else {
        res.send({error: "user not found"});
      }
    })
      .catch(function(err){
        // just need one of these
        console.log('error:', err);
      });
  },


  addUserTransaction: function(req, res, next) {
    const headerParts = req.headers.authorization.split(' ')
    let token = "";
    if (headerParts[0].toLowerCase() === 'bearer') {
     token = headerParts[1];
    }

    const transactionCoin = req.body.transactionCoin;
    let transactionCurrency = req.body.transactionCurrency;
    let transactionExchange = req.body.transactionExchange ;
    let transactionType = req.body.transactionType;
    if (!ObjectUtils.isNonEmptyObject(transactionExchange)) {
      transactionExchange = "CCCAGG";
    }
    let transactionPrice = Number(req.body.transactionPrice);
    const transactionDate = req.body.transactionDate;
    let transactionQuantity = req.body.transactionQuantity;

    let findUser = User.findOne({"token": token}).exec();

    findUser.then(function(userResponse){
      if (ObjectUtils.isNonEmptyObject(userResponse)) {
         DataFetchAPI.findCoinPriceAtTimeStamp(transactionCoin, transactionExchange, transactionDate)
            .then(function(coinHistoricalPrice){
              let transactionCurrencyPrice = coinHistoricalPrice.data;
              let transactionPriceBTC = transactionCurrencyPrice["BTC"];
              let transactionPriceETH = transactionCurrencyPrice["ETH"];
              let transactionPriceUSD = transactionCurrencyPrice["USD"];
              if (ObjectUtils.isNonEmptyArray(userResponse.transactions)) {
                let transactionsArray = userResponse.transactions;
                transactionsArray.push({
                  transactionCoin: transactionCoin,
                  transactionCurrency: transactionCurrency,
                  transactionExchange: transactionExchange,
                  transactionPriceBTC: transactionPriceBTC,
                  transactionPriceETH: transactionPriceETH,
                  transactionPriceUSD: transactionPriceUSD,
                  transactionDate: transactionDate,
                  transactionType: transactionType,
                  transactionQuantity: transactionQuantity
                });
                userResponse.transactions = transactionsArray;
              } else {
                userResponse.transactions = [
                  {
                    transactionCoin: transactionCoin,
                    transactionCurrency: transactionCurrency,
                    transactionExchange: transactionExchange,
                    transactionPriceBTC: transactionPriceBTC,
                    transactionPriceETH: transactionPriceETH,
                    transactionPriceUSD: transactionPriceUSD,
                    transactionDate: transactionDate,
                    transactionType: transactionType,
                    transactionQuantity: transactionQuantity
                  }
                ]
              }

              userResponse.save({}).then(function(userSaveResponse){
                res.send({data: userSaveResponse});
              });

            });
        }
    }).catch(function(err){
      res.send({"error": err});
    });
  },

  listUsers: function(req, res, next) {
    let token = req.query.token;
    // TODO Remove this code block before prod
    if (token === "proy24") {
      User.find({}, function(err, response){
        res.send({data: response});
      })
    }
  },

  validateUserName: function(req, res, next) {
    let userName = req.query.username;
    User.findOne({'username': userName}).exec().then(function(response){
      if (ObjectUtils.isNonEmptyObject(response)) {
        res.send({data: {exists: true, error:"username exists"}});
      } else {
        res.send({data: {exists: false, error:"username does not exist"}});
      }
    });
  },

  deleteCoin: function(req, res, next) {
    let user = req.query.user;
    let coin = req.query.coin;
    User.findOne({'_id': user}).exec().then(function(userResponse){
      userResponse.coins.splice(userResponse.coins.indexOf(coin), 1);
      let filteredTransactions = userResponse.transactions.filter(function(transaction){
        return transaction.transactionCoin !== coin
      })
      userResponse.transactions = filteredTransactions;
      let apiResponse = {};
      apiResponse.currentUser = userResponse;

      let coinList = userResponse.coins;
      let counter = 0;
      let responseArr = [];
      function sendResponse(responseArr, apiResponse) {
        apiResponse.coinList = responseArr;
        res.send({data: apiResponse});
      }
      if (coinList.length > 0) {
        coinList.forEach(function (coin, idx, arr) {
          DataFetchAPI.getCoinRow(coin).then(function (coinResponse) {
            DataFetchAPI.getDailyHistoryData(coinResponse.data.symbol).then(function (dataResponse) {
              let merged_response = Object.assign({}, coinResponse.data, {"weekly_data": dataResponse});
              counter++;
              responseArr.push(merged_response);
              if (counter === (arr.length)) {
                sendResponse(responseArr, apiResponse);
              }
            });
          });
        });
      } else {
        sendResponse([], apiResponse);
      }
      userResponse.save({});
    });
  }
}


