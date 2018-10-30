const { theContract } = require('../the-contract');
const { theWeb3, fromBlockPromise } = require('../the-web3');
const { getDecimalPrice, getRawPrice } = require('../utils/price');

let i = 0;

module.exports = ({ Token }) => class Trade {
    payToken = undefined;
    payAmount = 0;
    buyToken = undefined;
    buyAmount = 0;   
    instanceId = -1;  

    constructor(payToken, payAmount, buyToken, buyAmount) {
        this.payToken = Token.getByAddr(payToken);
        this.payAmount = payAmount;
        this.buyToken = Token.getByAddr(buyToken);
        this.buyAmount = buyAmount;   
        this.instanceId = i++;     
    }

    get _price() {
        return getRawPrice(this.buyAmount, this.payAmount);
    }

    get decimalPrice() {
        return getDecimalPrice(this.buyAmount, this.payAmount);
    }
}
