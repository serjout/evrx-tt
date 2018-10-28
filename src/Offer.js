const { theContract } = require('./the-contract');
const { theWeb3, fromBlockPromise } = require('./the-web3');
const { Token } = require('./Token');
const { moveDecimalPoint } = require('./utils/move-decimal-point');

const PRECISION = 20;
const PRECISION_MUL = BigInt(10) ** BigInt(PRECISION);

class Offer {
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

module.exports = { Offer };