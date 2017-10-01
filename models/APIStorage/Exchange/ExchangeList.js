/**
 Copyright Church of Crypto, Baron Nashor
 */
var axios = require('axios');

module.exports = {
  getExchangeList: function() {
    const exchangeListEndpoint = "https://api.coinigy.com/api/v1/exchanges";
    return axios.post(exchangeListEndpoint,{}, {
      headers: { "X-API-KEY": "c0c677118dd8165cd0a648bcf2a96243", "X-API-SECRET": "15acb49bc4c78152566062d549c24321" }
    });
  },
}