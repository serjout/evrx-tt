const{ theWeb3 } = require('../src/the-web3');
const { theContract } = require('../src/the-contract');
const BigNumber = require('bignumber.js');
const { Token } = require('../src/_index');

describe('Token', function () {
    it('shuuld return token by addr', () => {
        const token = Token.getByAddr('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2');

        expect(token instanceof Token).toBe(true);
        expect(token.ticker).toBe('W-ETH');
    });

    it('should correctly assign ctr arguments', async () => {
        const token = new Token(
            '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        );

        expect(token.address).toBe('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2');
    });

    it('should return few token', async () => {
        const amount = 4;
        const tokens = Token.getFewTokens(amount);

        expect(tokens.length).toBe(amount);
        expect(tokens[0] instanceof Token).toBe(true);
    });
});