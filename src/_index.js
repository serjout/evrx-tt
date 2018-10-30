const result = {};
result.Token = require('./entities/Token')(result);
result.Trade = require('./entities/Trade')(result);
result.Offer = require('./entities/Offer')(result);

result.TradeService = require('./services/TradeService')(result);
result.OfferService = require('./services/OfferService')(result);

module.exports = result;