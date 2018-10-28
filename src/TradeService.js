const { theContract } = require('../the-contract');
const { theWeb3, fromBlockPromise } = require('../the-web3');
const { Trade } = require('../Trade');

class TradeStore { 
    async getPastTrades(limit) {
        if (this._tradeLog === undefined) {
            await this.syncTrades();
        }

        return limit ? this._trades.slice(-limit) : this._trades;
    }

    async syncTrades() {
        if (this._tradeLog !== undefined) {
            return this._trades;
        }

        const fromBlock = await fromBlockPromise;

        const createTrade = ({ returnValues: { pay_amt, pay_gem, buy_amt, buy_gem }}) => (new Trade(pay_gem, pay_amt, buy_gem, buy_amt));

        const logs = await theContract.getPastEvents('LogTrade', { 
            address: theContract.address,
            fromBlock,
            toBlock: 'latest',
        });

        this._trades = logs.map(createTrade);

        theContract.events.LogTrade().on('data', x => this._trades.push(createTrade(x)));
        
        return this._trades;
    }

    constructor() {
        this._trades = [];
        this._eventLogTrade = null;
        this._tradeLog = undefined;
    }
}

module.exports = { TradeStore };