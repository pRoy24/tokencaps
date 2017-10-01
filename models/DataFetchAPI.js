/**
 Copyright Church of Crypto, Baron Nashor
 */
const DiskStorage = require('./DiskStorage'),
  APIStorage = require('./APIStorage');
  CoinUtils = require('./DiskStorage/Coin/util');

module.exports = {
  getCoinRow: function(coinSymbol) {
    return DiskStorage.findCoinRow(coinSymbol).then(function (response) {
      if (response && Object.keys(response).length > 0) {
        return response;
      } else {
        return APIStorage.findCoinRow(coinSymbol).then(function(apiCoinResponse){
          DiskStorage.saveCoinRow(apiCoinResponse);
          return apiCoinResponse;
        })
      }
    })
  },

  getCoinSnapshot: function(coinSymbol) {
    return DiskStorage.findCoinSnapshot(coinSymbol).then(function(response){
      if (response && Object.keys(response).length > 0) {
        return response;
      } else {
        return APIStorage.findCoinSnapshot(coinSymbol).then(function(apiCoinSnapshotResponse){
          DiskStorage.saveCoinSnapshot(CoinUtils.normalizeCoinSnapShotData(apiCoinSnapshotResponse));
          return CoinUtils.normalizeCoinSnapShotData(apiCoinSnapshotResponse);
        })
      }
    });
  },

  getCoinFullSnapshot: function(coinID) {
    return DiskStorage.findCoinSnapshot(coinID).then(function(response){
      if (response && Object.keys(response).length > 0) {
        return response;
      } else {
        return APIStorage.findCoinSnapshot(coinID).then(function(apiCoinSnapshotResponse){
          DiskStorage.saveCoinSnapshot(apiCoinSnapshotResponse);
          return apiCoinSnapshotResponse;
        })
      }
    })
  },

  getMarketList: function(coinID) {
    return DiskStorage.findCoinSnapshot(coinID).then(function(response){
      if (response && Object.keys(response).length > 0) {
        return response;
      } else {
        return APIStorage.findCoinSnapshot(coinID).then(function(apiCoinSnapshotResponse){
          DiskStorage.saveCoinSnapshot(apiCoinSnapshotResponse);
          return apiCoinSnapshotResponse;
        })
      }
    })
  },
  getCoinSocialData: function (coinID) {
    return DiskStorage.findCoinSocialData(coinID).then(function(response){
      if (response && response.data) {
        return response;
      } else {
        return APIStorage.findCoinSocialData(coinID).then(function(apiCoinSnapshotResponse){
          const coinSocialResponse = apiCoinSnapshotResponse.data.Data;
          DiskStorage.saveCoinSocialData(coinSocialResponse);
          return coinSocialResponse;
        })
      }
    });
  },

  getCoinList: function() {
    return DiskStorage.findCoinList().then(function(response){
      console.log(response);
      if (response && response.data && response.data.length > 0) {
        return response.data;
      } else {
        return APIStorage.findCoinList().then(function(apiCoinSnapshotResponse){
          const coinSocialResponse = apiCoinSnapshotResponse.data;
          DiskStorage.saveCoinListData(coinSocialResponse);
          return coinSocialResponse;
        })
      }
    });
  },

  getDailyHistoryData: function(coinSymbol) {
    return DiskStorage.findCoinDayHistoryData(coinSymbol).then(function(response){
      if (response && response.data.length > 0) {
        return response.data;
      } else {
        return APIStorage.findCoinDayHistoryData(coinSymbol).then(function(apiCoinDayHistoryDataResponse){
          const coinSocialResponse = apiCoinDayHistoryDataResponse.data.Data;
          return coinSocialResponse;
        }).catch(function(e){
          return {error: e};
        })
      }
    });
  },

  getExchangeList: function() {
    return DiskStorage.findExchangeList().then(function(diskStorageResponse){
      if (diskStorageResponse && diskStorageResponse.data.length > 0) {
        return diskStorageResponse.data;
      } else {
        return APIStorage.findExchangeList().then(function(apiStorageResponse){
          let apiExchangeListResponse = apiStorageResponse.data.data;
          DiskStorage.saveExchangeList();
          return {data: apiExchangeListResponse};
        });
      }
    })
  },

  mergeExchangeList: function(exchangeMarketData) {
    return DiskStorage.findExchangeList().then(function(diskStorageResponse){
      if (diskStorageResponse && diskStorageResponse.data.length > 0) {
        return diskStorageResponse.data;
      } else {
        return APIStorage.findExchangeList().then(function(apiStorageResponse){
          let apiExchangeListResponse = apiStorageResponse.data.data;
          return {data: mergeList(exchangeMarketData, apiExchangeListResponse)};
        });
      }
    })
  }
}

function mergeList(exchangeMarketData, exchangeList) {
  let mergedList = [];
  for (let a= 0 ;a < exchangeMarketData.length; a++) {
    let objectFound = false;
    for( let b =0; b< exchangeList.length; b++) {
      if ((exchangeMarketData[a].MARKET.toLowerCase().trim() === exchangeList[b].exch_name.toLowerCase().trim()) ||
        exchangeMarketData[a].MARKET.toLowerCase().trim() === exchangeList[b].exch_code.toLowerCase().trim()) {
        mergedList.push(Object.assign({}, exchangeMarketData[a], exchangeList[b]));
        objectFound = true;
        break;
      }
    }
    if (!objectFound) {
      mergedList.push(exchangeMarketData[a]);
    }
   }
   return mergedList;

}