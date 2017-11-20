// pRoy24 TokenPlex

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
  email: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  token: {type: String},
  coins: [{type: String}],
  transactions: [{transactionType: String, transactionDate: String,
                  transactionQuantity: String, transactionCoin: String,
                  transactionPriceBTC: String, transactionPriceETH: String,
                  transactionPriceUSD: String, transactionExchange: String}],
  created_at: Date,
  updated_at: Date
});

// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;