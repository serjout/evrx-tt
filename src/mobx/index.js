const result = {};
result.Token = require('../entities/Token')(result);
result.Trade = require('../entities/Trade')(result);
result.Offer = require('./Offer')(result);

result.TradeService = require('../services/TradeService')(result);
result.OfferService = require('../services/OfferService')(result);
result.TokenService = require('../services/TokenService')(result);

result.Store = require('./Store')(result);

module.exports = result;