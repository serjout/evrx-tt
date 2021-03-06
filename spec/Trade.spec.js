const{ theWeb3 } = require('../src/the-web3');
const { theContract } = require('../src/the-contract');
const BigNumber = require('bignumber.js');
const { Trade, TradeService } = require('../src/_index');

describe('TradeService', () => {
    it('should return list of last trades', async () => {
        const service = new TradeService();
    
        const trades = await service.getPastTrades(4);

        expect(trades.length).toBe(4);
        expect(trades[0].constructor).toBe(Trade);
    });
});

describe('Trade', () => {
    it('should correctly assign ctr arguments', async () => {
        let payToken, buyToken;

        const trade = new Trade(
            payToken = '0xecf8f87f810ecf450940c9f60066b4a7a501d6a7',
            'payAmount',
            buyToken = '0x59adcf176ed2f6788a41b8ea4c4904518e62b6a4',
            'buyAmount',
        );

        expect(trade.payToken.address).toBe(payToken);
        expect(trade.payAmount).toBe('payAmount');
        expect(trade.buyToken.address).toBe(buyToken);
        expect(trade.buyAmount).toBe('buyAmount');
    });
});