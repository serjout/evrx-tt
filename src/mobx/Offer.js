const { observable, decorate } = require ('mobx');
const di = require('../entities/Offer');

module.exports = (namespace) => {
    const Offer = di(namespace);
    
    class OfferMobx extends Offer {};

    return decorate(OfferMobx, {
        _next: observable,
        _prev: observable,
    })
}
