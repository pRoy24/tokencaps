/**
 Copyright Church of Crypto, Baron Nashor
 */
const DiskStorage = require('./DiskStorage'),
  APIStorage = require('./APIStorage');
  CoinUtils = require('./DiskStorage/Coin/util');

module.exports = {
  getCoinRow: function(coinSymbol) {
    return DiskStorage.findCoinRow(coinSymbol).then(function (response) {
      if (response && response.data && Object.keys(response.data).length > 0) {
        return response;
      } else {
        return APIStorage.findCoinRow(coinSymbol).then(function(apiCoinResponse){
          return ({data: apiCoinResponse.data});
        })
      }
    }).catch((e)=>{console.log(e)})
  },

  getCoinSnapshot: function(coinSymbol) {
    return DiskStorage.findCoinSnapshot(coinSymbol).then(function(response){
      if (response && Object.keys(response).length > 0) {
        return response;
      } else {
        return APIStorage.findCoinSnapshot(coinSymbol).then(function(apiCoinSnapshotResponse){
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
      if (response && response.data && response.data.length > 0) {
        return response.data;
      } else {
        return APIStorage.findCoinList().then(function(apiCoinSnapshotResponse){
          const coinSocialResponse = apiCoinSnapshotResponse.data;
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
          return {data: apiExchangeListResponse};
        });
      }
    })
  },

  mergeExchangeList: function(exchangeMarketData) {
    return DiskStorage.findExchangeList().then(function(diskStorageResponse){
      if (diskStorageResponse && diskStorageResponse.data && diskStorageResponse.data.length > 0) {
        return diskStorageResponse.data;
      } else {
        return APIStorage.findExchangeList().then(function(apiStorageResponse){
          let apiExchangeListResponse = apiStorageResponse.data.data;
          return {data: mergeList(exchangeMarketData, apiExchangeListResponse)};
        });
      }
    })
  },

  findCoinByName: function(coinSearchString) {
    return DiskStorage.searchCoin(coinSearchString).then(function(searchCoinResponse){
      if (searchCoinResponse && searchCoinResponse.data.length > 0) {
        return {data: searchCoinResponse.data}
      } else {
        return APIStorage.searchCoin(coinSearchString).then(function(apiSearchCoinResponse){
          return {data: searchCoinResponse.data}
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

