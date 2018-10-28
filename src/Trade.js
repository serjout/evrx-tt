const { theContract } = require('../src/the-contract');
const { theWeb3, fromBlockPromise } = require('../src/the-web3');
const { Token } = require('../src/Token');

class Trade {
    constructor(payToken, payAmount, buyToken, buyAmount) {
        this.payToken = new Token(payToken);
        this.payAmount = payAmount;
        this.buyToken = new Token(buyToken);
        this.buyAmount = buyAmount;        
    }
}

module.exports = { Trade };
