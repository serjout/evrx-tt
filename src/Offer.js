const { theContract } = require('./the-contract');
const { theWeb3, fromBlockPromise } = require('./the-web3');
const { Token } = require('./Token');
const { moveDecimalPoint } = require('./utils/move-decimal-point');

const createDownCount = count => () => --count !== 0;
const PRECISION = 20;
const PRECISION_MUL = BigInt(10) ** BigInt(PRECISION);

class Offer {
    /**
     * 
     * @param {Token} token1 
     * @param {Token} token2 
     * @param {Offer => boolean} stopIfTrue 
     */
    static async getOffersUntil(token1, token2, stopIfFalse = createDownCount(20)) {
        // let stopLogQueueBlocking;
        // Offer._untilLogQueueBlock = new Promise(done => stopLogQueueBlocking = done);

        const result = [];
        const pairKey = this._getPairKey(token1, token2);
        let curr;

        if (Offer._mapPairToBest[pairKey] === undefined) {
            const id = await theContract.methods.getBestOffer(token1.address, token2.address).call();
            curr = await Offer.getById(id);
            Offer._mapPairToBest[pairKey] = curr;
            result.push(curr);
        }

        while(stopIfFalse(curr) && curr._next !== undefined) {
            const next = await Offer.getById(curr._next);
            next._prev = curr;
            curr = next;
            result.push(curr);
        }

        //stopLogQueueBlocking();
        return result;
    }

    static async getVolumePrice(token1, token2, volume = BigInt(0)) {
        let sumPay = BigInt(0);
        let sumBuy = BigInt(0);

        function predicate(offer) {
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

        const offers = await Offer.getOffersUntil(token1, token2, predicate);
        console.log('sumBuy ', sumBuy, 'volume ', volume, 'sumPay', sumPay);

        return [moveDecimalPoint(sumBuy * PRECISION_MUL / sumPay, -PRECISION), sumBuy, sumPay,  offers];
    }

    static async getPastOffers(token1, token2, limit = 10) {
        const predicate = createDownCount(limit);

        return Offer.getOffersUntil(token1, token2, predicate);
    }

    // static _addToLogQueue(events) {
    //     Offer._logQueue.push.call(Offer._logQueue, events);

    //     if (Offer._logQueuePromise === undefined) {
    //         Offer._logQueuePromise = Offer._processLogQueue();
    //     }
    // }

    // static async _processLogQueue() {
    //     while(Offer._logQueue.length > 0) {
    //         await this._untilLogQueueBlock();

    //         const event = Offer._logQueue.shift();

    //         // TODO
    //         console.log(event)
    //     }
    //     Offer._logQueuePromise = undefined;
    // }

    static async syncOffers() {
        let loop = true;
        const fromBlock = await fromBlockPromise;
        const cancel = () => loop = true;

        // LogInsert
        // LogUn..
        
        return cancel;
    }

    static async getById(id) {
        if (Offer._offers[id] === undefined) {
            const [o, nextId] = await Promise.all([
                theContract.methods.offers(id).call(),
                theContract.methods.getWorseOffer(id).call(),
            ]);
            const offer = new Offer(id, o.owner, o.pay_gem, o.pay_amt, o.buy_gem, o.buy_amt, o.timestamp);
 
            offer._next = nextId;
            Offer._offers[offer.id] = offer;
        }

        console.log('' + Offer._offers[id]);
        return Offer._offers[id];
    }

    static _getPairKey(buyToken, payToken) {
        return `${buyToken.ticker} / ${payToken.ticker}` 
    }

    constructor(id, maker, payToken, payAmount, buyToken, buyAmount, timestamp) {
        if (arguments.length < 7 || Array.from(arguments).some(x => !x)) {
            throw new Error('Wrong argument');
        }

        this.pay = {
            token: new Token(payToken),
            amount: BigInt(payAmount),
        };
        this.buy = {
            token: new Token(buyToken),
            amount: BigInt(buyAmount),
        }
        this.id = id;
        this.maker = maker;
        this.ts = timestamp;
        this._next = undefined;
        this._prev = undefined;
    }

    delete() {
        const prev = this._prev;
        const next = this._next;
        prev._next = next;
        next._prev = prev;
        delete this._offers[this.id];
    }

    get _price() {
        return  BigInt(this.buy.amount) * PRECISION_MUL / BigInt(this.pay.amount);
    }

    get decimalPrice() {
        return moveDecimalPoint(String(this._price), -PRECISION);
    }

    take() {

    }

    toString() {
        return `### Offer ${this.buy.token.ticker}/${this.pay.token.ticker} buy:${this.buy.amount} pay:${this.pay.amount} price:${this.decimalPrice}`;
    }
}

Offer._offers = {};
Offer._eventLogTrade = null;
Offer._offerLog = undefined;
Offer._mapPairToBest = {};
// Offer._logQueue = [];
// Offer._untilLogQueueBlock = Promise.resolve();
// Offer._logQueuePromise = undefined;

module.exports = { Offer };