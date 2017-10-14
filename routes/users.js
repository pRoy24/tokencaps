var express = require('express');
var router = express.Router();
const DataFetchAPI = require('../models/DataFetchAPI');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/list-coin', function(req, res, next) {
  let coinList = JSON.parse(req.query.coinList);
  let counter = 0;
  let responseArr = [];
  function callback(response) {
    res.send({data: response});
  }
  coinList.forEach(function(coin, idx, arr){
    DataFetchAPI.getCoinRow(coin).then(function(coinResponse){
      counter ++;
      responseArr.push(coinResponse.data);
      if (counter === (arr.length - 1)) {
        callback(responseArr);
      }
    });
  });

});

module.exports = router;
