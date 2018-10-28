const { theContract } = require('./the-contract');
const { theWeb3, fromBlockPromise } = require('./the-web3');
const { Token } = require('./Token');
const { Offer } = require('./Offer');
const { moveDecimalPoint } = require('./utils/move-decimal-point');

const createDownCount = count => () => count-- !== 0;
const PRECISION = 20;
const PRECISION_MUL = BigInt(10) ** BigInt(PRECISION);

class OfferStore {
    /**
     * 
     * @param {Token} token1 
     * @param {Token} token2 
     * @param {Offer => boolean} stopIfFalse 
     */
     async getOffersUntil(token1, token2, stopIfFalse = createDownCount(19)) {
        // let stopLogQueueBlocking;
        // this._untilLogQueueBlock = new Promise(done => stopLogQueueBlocking = done);

        const result = [];
        const pairKey = this._getPairKey(token1, token2);
        let curr = this._mapPairToBest[pairKey];

        if (curr === undefined) {
            const id = await theContract.methods.getBestOffer(token1.address, token2.address).call();
            curr = await this.getById(id);
            this._mapPairToBest[pairKey] = curr;
            result.push(curr);
        }

        while(stopIfFalse(curr) && curr._next !== undefined) {
            const next = await this.getById(curr._next);
            next._prev = curr;
            curr = next;
            result.push(curr);
        }

        // stopLogQueueBlocking();
        return result;
    }

    async getRecommendationsForVolumeBuy(token1, token2, volume = BigInt(0)) {
        let sumPay = BigInt(0);
        let sumBuy = BigInt(0);

        const predicate = (offer) => {
            let stop = true;

            const sumNext = sumBuy + offer.buy.amount;

            if (volume <= sumNext) {
                stop = false;

                if (volume < sumNext) {
                    const surplusBuy = sumNext - volume;
                    const rate = surplusBuy * PRECISION_MUL / offer.buy.amount;
                    const surplusPay = offer.pay.amount * rate / PRECISION_MUL;

                    console.log('surplusPay', surplusPay);
                    console.log('surplusPay sub', offer.pay.amount - surplusPay);
                    console.log(moveDecimalPoint(offer.pay.amount * PRECISION_MUL / surplusPay, -PRECISION));
                    console.log(moveDecimalPoint(offer.buy.amount * PRECISION_MUL / surplusBuy, -PRECISION));

                    sumPay += offer.pay.amount - surplusPay;
                    sumBuy += offer.buy.amount - surplusBuy;
                }
            } else {
                sumBuy = sumNext;
                sumPay += offer.pay.amount;
            }

            return stop;
        }

        const offers = await this.getOffersUntil(token1, token2, predicate);
        console.log('sumBuy ', sumBuy, 'volume ', volume, 'sumPay ', sumPay);

        return {
            minPrice:  offers[0].decimalPrice,
            finalPrice: moveDecimalPoint(sumBuy * PRECISION_MUL / sumPay, -PRECISION), 
            maxPrice: offers[offers.length - 1].decimalPrice,
            summaryPayment: sumPay,  
            offers,
        };
    }

    async getPastOffers(token1, token2, limit = 10) {
        const predicate = createDownCount(limit - 1);

        return this.getOffersUntil(token1, token2, predicate);
    }

    // _addToLogQueue(events) {
    //     this._logQueue.push.call(this._logQueue, events);

    //     if (this._logQueuePromise === undefined) {
    //         this._logQueuePromise = this._processLogQueue();
    //     }
    // }

    // async _processLogQueue() {
    //     while(this._logQueue.length > 0) {
    //         await this._untilLogQueueBlock();

    //         const event = this._logQueue.shift();

    //         // TODO
    //         console.log(event)
    //     }
    //     this._logQueuePromise = undefined;
    // }

    async syncOffers() {
        let loop = true;
        const fromBlock = await fromBlockPromise;
        const cancel = () => loop = true;

        return cancel;
    }

    async getById(id) {
        if (this._offers[id] === undefined) {
            const [o, nextId] = await Promise.all([
                theContract.methods.offers(id).call(),
                theContract.methods.getWorseOffer(id).call(),
            ]);
            const offer = new Offer(id, o.owner, o.pay_gem, o.pay_amt, o.buy_gem, o.buy_amt, o.timestamp);
 
            offer._next = nextId;
            this._offers[offer.id] = offer;
        }

        return this._offers[id];
    }

    _getPairKey(buyToken, payToken) {
        return `${buyToken.ticker} / ${payToken.ticker}` 
    }

    constructor(id, maker, payToken, payAmount, buyToken, buyAmount, timestamp) {
        this._offers = {};
        this._eventLogTrade = null;
        this._offerLog = undefined;
        this._mapPairToBest = {};
        // this._logQueue = [];
        // this._untilLogQueueBlock = Promise.resolve();
        // this._logQueuePromise = undefined;
    }
}

module.exports = { OfferStore };