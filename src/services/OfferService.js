const { theContract } = require('../the-contract');
const { theWeb3, fromBlockPromise } = require('../the-web3');
const { moveDecimalPoint } = require('../utils/move-decimal-point');

const { PRECISION, PRECISION_MUL } = require('../const');

const createDownCount = count => () => count-- !== 0;

function isEmptyId(id) {
    return BigInt(id) === BigInt(0);
}

// TODO listen events and update loaded orders
module.exports = ({ Token, Offer }) => class OfferService {
    /**
     * 
     * @param {Token} token1 
     * @param {Token} token2 
     * @param {Offer => boolean} stopIfFalse 
     */
    async getOffersUntil(token1, token2, stopIfFalse = createDownCount(19)) {
        const result = [];
        const pairKey = this._getPairKey(token1, token2);
        let curr;

        if (curr === undefined) {
            const id = await theContract.methods.getBestOffer(
                token2.address, 
                token1.address
            ).call();

            curr = await this.getById(id);

            if (curr !== undefined) {
                result.push(curr);

                do {
                    const next = await this.getById(curr._next);
        
                    if (next === undefined) {
                        break;
                    }
                    next._prev = curr.id;
                    curr = next;
                    result.push(curr);
        
                } while (
                    curr !== undefined && 
                    stopIfFalse(curr) && 
                    curr._next !== undefined
                )
            }
        }

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

                    sumPay += offer.pay.amount - surplusPay;
                    sumBuy += offer.buy.amount - surplusBuy;
                } else {
                    sumBuy = sumNext; // 
                    sumPay += offer.pay.amount;
                }
            } 
            return stop;
        }

        const offers = await this.getOffersUntil(token1, token2, predicate);
        const canBeFullfilled = volume === sumBuy;

        if (sumPay === BigInt(0)) {
            return { error: "" }
        }

        return {
            canBeFullfilled,
            requestedVolume: String(volume),
            buy: token1.ticker,
            pay: token2.ticker,
            minPrice: String(offers[0] && offers[0].decimalPrice),
            maxPrice: String(offers.length && offers[offers.length - 1].decimalPrice),
            finalPrice: moveDecimalPoint(sumBuy * PRECISION_MUL / sumPay, -PRECISION), 
            summaryPayment: String(sumPay),  
        };
    }

    async getPastOffers(token1, token2, limit = 10) {
        const predicate = createDownCount(limit - 1);

        return this.getOffersUntil(token1, token2, predicate);
    }

    _syncEvent = undefined;
    async sync() {
        if (!this._syncEvent) {
            this._syncEvent = theContract.events.LogItemUpdate().on("data", event => {
                console.log('eeeveeennnttt', event);
            });
        }
    }

    async getById(id) {
        if (isEmptyId(id)) {
            return undefined;
        }
        this.sync();

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