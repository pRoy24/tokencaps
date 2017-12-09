// pRoy24 tokenplex

module.exports  = {
  normalizeCoinSnapShotData: function(coinResponseData) {
    const ccMarketData =  [coinResponseData.data.Data['AggregatedData']];
    const exchangeMarketData = coinResponseData.data.Data['Exchanges'];

    const coinTradeData = exchangeMarketData.concat(ccMarketData);
    let coinTradeNormalizedData = coinTradeData.map(function(tradeDataItem){
      return Object.assign(...Object.keys(tradeDataItem).map(function(keyItem){
        let obj = {};
        obj[keyItem.toLowerCase()] = tradeDataItem[keyItem];
        return obj;
      }))
    });
    return coinTradeNormalizedData;
  }
}