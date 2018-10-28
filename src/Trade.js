const { theContract } = require('../src/the-contract');
const { theWeb3, fromBlockPromise } = require('../src/the-web3');
const { Token } = require('../src/Token');

class Trade {
    static async getPastTrades(limit) {
        if (Trade._tradeLog === undefined) {
            await Trade.syncTrades();
        }

        return limit ? Trade._trades.slice(-limit) : Trade._trades;
    }

    static async syncTrades() {
        if (Trade._tradeLog !== undefined) {
            return Trade._trades;
        }

        const fromBlock = await fromBlockPromise;

        const createTrade = ({ returnValues: { pay_amt, pay_gem, buy_amt, buy_gem }}) => (new Trade(pay_amt, pay_gem, buy_amt, buy_gem));

        const logs = await theContract.getPastEvents('LogTrade', { 
            address: theContract.address,
            fromBlock,
            toBlock: 'latest',
        });

        Trade._trades = logs.map(createTrade);

        theContract.events.LogTrade().on('data', x => Trade._trades.push(createTrade(x)));
        
        return Trade._trades;
    }

    constructor(payToken, payAmount, buyToken, buyAmount) {
        this.payToken = new Token(payToken);
        this.payAmount = payAmount;
        this.buyAmount = buyAmount;
        this.buyToken = new Token(buyToken);
    }
}

Trade._trades = [];
Trade._eventLogTrade = null;
Trade._tradeLog = undefined;

module.exports = { Trade };