const { theContract } = require('../the-contract');
const { theWeb3, fromBlockPromise } = require('../the-web3');
const { Trade } = require('../entities/Trade');

module.exports = ({ Trade }) => class TradeService { 
    async getPastTrades(limit) {
        if (this._tradeLog === undefined) {
            await this.syncTrades();
        }

        return limit ? this._trades.slice(-limit) : this._trades;
    }

    setListener(listener) {
        this._listener = listener;
        this.firstListnerCall();
    }

    firstListnerCall() {
        if (this._listener && this._synced && this._trades) {
            this._listener(this._trades);
            this._trades = undefined;
        }
    }

    async syncTrades() {
        if (this._tradeLog !== undefined) {
            return this._trades;
        }

        const fromBlock = await fromBlockPromise;

        const createTrade = ({ returnValues: { pay_amt, pay_gem, buy_amt, buy_gem }}) => (new Trade(pay_gem, pay_amt, buy_gem, buy_amt));

        this._tradeLog = theContract.events.LogTrade().on('data', x => {
            const trade = createTrade(x);

            if (this._listener) {
                this._listener(trade);
            }

            if (this._trades) {
                this._trades.push(trade);
            } 
        });

        const logs = await theContract.getPastEvents('LogTrade', { 
            address: theContract.address,
            fromBlock,
            toBlock: 'latest',
        });

        this._trades = [...logs.map(createTrade), ...this._trades];
        this._synced = true;
        this.firstListnerCall();
        
        return this._trades;
    }

    constructor() {
        this._trades = [];
        this._tradeLog = undefined;
        this._listener = undefined;
    }
}