const{ theWeb3 } = require('../src/the-web3');
const { theContract } = require('../src/the-contract');
const BigNumber = require('bignumber.js');

describe('web3', function () {
    it(`get balance of defaultUser ${theWeb3.defaultAccount}`, async () => {
        const balance  = await theWeb3.eth.getBalance(theWeb3.defaultAccount);

        expect(balance).toBe('0');
    });

    it('get gas price', (done) => {
        theWeb3.eth.getGasPrice((err, price) => {
            expect(+price).toBeGreaterThan(0);

            done();
        });
    });
});

describe('oasis contract', function () {
    it('has getFirstUnsortedOffer method', async() => {
        expect(typeof theContract.methods.getFirstUnsortedOffer).toBe('function');
    });

    it('try to call contract method', async () => {
        const result = await theContract.methods.getFirstUnsortedOffer().call();

        expect(typeof result).toBe('string');
    });
});