/**
 Copyright Church of Crypto, Baron Nashor
 */
let _ = require('lodash');
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
        return APIStorage.findCoinSnapshot(coinSymbol, "USD").then(function(apiCoinSnapshotResponseUSD){
          if (!apiCoinSnapshotResponseUSD || apiCoinSnapshotResponseUSD.data.Data === null
            || Object.keys(apiCoinSnapshotResponseUSD.data.Data).length === 0) {
            return APIStorage.findCoinSnapshot(coinSymbol, "BTC").then(function(apiCoinSnapshotResponseBTC){
              let normalizedAPISnapshot = CoinUtils.normalizeCoinSnapShotData(apiCoinSnapshotResponseBTC);
              DiskStorage.saveCoinSnapshot(normalizedAPISnapshot);
              return normalizedAPISnapshot;
            });
          } else {
            let normalizedAPISnapshot = CoinUtils.normalizeCoinSnapShotData(apiCoinSnapshotResponseUSD);
            DiskStorage.saveCoinSnapshot(normalizedAPISnapshot);
            return normalizedAPISnapshot;
          }
        });
      }
    });
  },

  getCoinFullSnapshot: function(coinID) {
    return DiskStorage.findCoinSnapshot(coinID).then(function(response){
      if (response && Object.keys(response).length > 0) {
        return response;
      } else {
        return APIStorage.findCoinSnapshot(coinID).then(function(apiCoinSnapshotResponse){
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
      if (response && response.data.length > 0) {
        let items = {};
        Object.keys(response.data[0]).forEach(function(key){
          if (key === "coderepository") {
            items["CodeRepository"] = JSON.parse(response.data[0][key]);
          } else {
            items[_.capitalize(key)] = JSON.parse(response.data[0][key]);
          }
        });
        return items;
      } else {
        return APIStorage.findCoinSocialData(coinID).then(function(apiCoinSocialResponse){
          const coinSocialResponse = apiCoinSocialResponse.data.Data;
          DiskStorage.saveCoinSocialData(coinID, coinSocialResponse);
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
          const coinListResponse = apiCoinSnapshotResponse.data;
          return coinListResponse;
        })
      }
    });
  },

  getDailyHistoryData: function(coinSymbol) {
    return DiskStorage.findCoinDayHistoryData(coinSymbol).then(function(response){
      if (response && response.data.length > 0) {
        // If create time of record was more than 30 mins ago, then try to fetch it again
        let recordCreateTime = response.data[0].createtime;
        let currentTime = new Date().getSeconds();
        const timeDifference = currentTime - recordCreateTime;
        if (timeDifference > 3600) {
          return APIStorage.findCoinDayHistoryData(coinSymbol).then(function(apiCoinDayHistoryDataResponse){
            const coinDayHistoryResponse = apiCoinDayHistoryDataResponse.data.Data;
            if (coinDayHistoryResponse && coinDayHistoryResponse.length > 0) {
              DiskStorage.saveCoinDayHistoryData(coinDayHistoryResponse);
              return coinDayHistoryResponse;
            } else {
              return response.data;
            }
          });
        } else {
          return response.data;
        }
      } else {
        return APIStorage.findCoinDayHistoryData(coinSymbol).then(function(apiCoinDayHistoryDataResponse){
          const coinSocialResponse = apiCoinDayHistoryDataResponse.data.Data;
          return coinSocialResponse;
        }).catch(function(e){
          console.log(e);
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
        return APIStorage.findCoinList().then(function(apiCoinSnapshotResponse){
          const coinListResponse = apiCoinSnapshotResponse.data;
          let coinSearchMatchesList = coinListResponse.filter(function(coin){
            return (new RegExp(coinSearchString.toLowerCase()).test(coin.fullname.toLowerCase()));
          });
          DiskStorage.saveCoinListData(coinListResponse);
          return {data: coinSearchMatchesList}
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

