const { theContract } = require('../the-contract');
const { theWeb3, fromBlockPromise } = require('../the-web3');
const { getDecimalPrice, getRawPrice } = require('../utils/price');
const { PRECISION, PRECISION_MUL } = require('../const');

module.exports = ({ Token }) => class Offer {
    _next = 0;
    _prev = 0;
    id = 0;
    maker = 0;
    ts = 0;
    buy = null;
    pay = null;

    constructor(id, maker, payToken, payAmount, buyToken, buyAmount, timestamp) {
        if (arguments.length < 7 || Array.from(arguments).some(x => !x)) {
            throw new Error('Wrong argument');
        }

        this.pay = {
            token: Token.getByAddr(payToken),
            amount: BigInt(payAmount),
        };
        this.buy = {
            token: Token.getByAddr(buyToken),
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
        return getRawPrice(this.buy.amount, this.pay.amount);
    }

    get decimalPrice() {
        return getDecimalPrice(this.buy.amount, this.pay.amount);
    }

    take() {

    }

    toString() {
        return `### Offer ${this.buy.token.ticker}/${this.pay.token.ticker} buy:${this.buy.amount} pay:${this.pay.amount} price:${this.decimalPrice}`;
    }
}
