// pRoy24 TokenPlex
var ccxt = require ('ccxt')

module.exports = {
  getExchangeInstance: function (exchangeName) {
    switch (exchangeName) {
      case "_1btcxe":
        return new ccxt._1btcxe();
      case "1btcxe":
        return new ccxt._1btcxe();
      case "acx":
        return new ccxt.acx();
      case "anxpro":
        return new ccxt.anxpro();
      case "binance":
        return new ccxt.binance();
      case "bit2c":
        return new ccxt.bit2c();
      case "bitbay":
        return new ccxt.bitbay();
      case "bitcoincoid":
        return new ccxt.bitcoincoid();
      case "bitfinex":
        return new ccxt.bitfinex();
      case "bitflyer":
        return new ccxt.bitflyer();
      case "bithumb":
        return new ccxt.bithumb();
      case "bitlish":
        return new ccxt.bitlish();
      case "bitmarket":
        return new ccxt.bitmarket();
      case "bitmex":
        return new ccxt.bitmex();
      case "bitso":
        return new ccxt.bitso();
      case "bitstamp":
        return new ccxt.bitstamp();
      case "bitstamp1":
        return new ccxt.bitstamp1();
      case "bittrex":
        return new ccxt.bittrex();
      case "bl3p":
        return new ccxt.bl3p();

      case "btcbox":
        return new ccxt.btcbox();
      case "btcchina":
        return new ccxt.btcchina();

      case "btcmarkets":
        return new ccxt.btcmarkets();
      case "btctradeua":
        return new ccxt.btctradeua();
      case "btcturk":
        return new ccxt.btcturk();
      case "btcx":
        return new ccxt.btcx();
      case "bxinth":
        return new ccxt.bxinth();
      case "ccex":
        return new ccxt.ccex();
      case "c-cex":
        return new ccxt.ccex();
      case "cex":
        return new ccxt.cex();
      case "chbtc":
        return new ccxt.chbtc();
      case "chilebit":
        return new ccxt.chilebit();
      case "coincheck":
        return new ccxt.coincheck();
      case "coinfloor":
        return new ccxt.coinfloor();
      case "coingi":
        return new ccxt.coingi();
      case "coinmarketcap":
        return new ccxt.coinmarketcap();
      case "coinmate":
        return new ccxt.coinmate();
      case "coinsecure":
        return new ccxt.coinsecure();
      case "coinspot":
        return new ccxt.coinspot();
      case "dsx":
        return new ccxt.dsx();
      case "exmo":
        return new ccxt.exmo();
      case "foxbit":
        return new ccxt.foxbit();
      case "fybse":
        return new ccxt.coinmate();
      case "fybsg":
        return new ccxt.fybsg();
      case "gatecoin":
        return new ccxt.gatecoin();
      case "gateio":
        return new ccxt.gateio();
      case "gdax":
        return new ccxt.gdax();
      case "gemini":
        return new ccxt.gemini();
      case "getbtc":
        return new ccxt.getbtc();
      case "hitbtc":
        return new ccxt.hitbtc();
      case "hitbtc2":
        return new ccxt.hitbtc2();
      case "huobi":
        return new ccxt.huobi();
      case "huobicny":
        return new ccxt.huobicny();
      case "huobipro":
        return new ccxt.huobipro();
      case "independentreserve":
        return new ccxt.independentreserve();
      case "itbit":
        return new ccxt.itbit();
      case "kraken":
        return new ccxt.kraken();
      case "kucoin":
        return new ccxt.kucoin();
      case "lakebtc":
        return new ccxt.lakebtc();
      case "liqui":
        return new ccxt.liqui();
      case "livecoin":
        return new ccxt.livecoin();
      case "luno":
        return new ccxt.luno();
      case "mercado":
        return new ccxt.mercado();
      case "mixcoins":
        return new ccxt.mixcoins();
      case "nova":
        return new ccxt.nova();
      case "okcoinusd":
        return new ccxt.okcoinusd();
      case "okex":
        return new ccxt.okex();
      case "paymium":
        return new ccxt.paymium();
      case "poloniex":
        return new ccxt.poloniex();
      case "qryptos":
        return new ccxt.qryptos();
      case "quadrigacx":
        return new ccxt.quadrigacx();
      case "quoine":
        return new ccxt.quoine();
      case "southxchange":
        return new ccxt.southxchange();
      case "surbitcoin":
        return new ccxt.surbitcoin();
      case "therock":
        return new ccxt.therock();

      case "urdubit":
        return new ccxt.urdubit();
      case "vaultoro":
        return new ccxt.vaultoro();
      case "vbtc":
        return new ccxt.vbtc();
      case "virwox":
        return new ccxt.virwox();
      case "wex":
        return new ccxt.wex();
      case "zaif":
        return new ccxt.zaif();
      case "zb":
        return new ccxt.zb();
      default:
        return null;
    }
  }
}


