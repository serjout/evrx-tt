const{ theWeb3 } = require('../src/the-web3');
const { theContract } = require('../src/the-contract');
const BigNumber = require('bignumber.js');
const { Trade } = require('../src/Trade');

describe('Token', () => {
    it('should return list of last trades', async () => {
        const trades = await Trade.getPastTrades(4);

        expect(trades.length).toBe(4);
    });
});