const{ theWeb3 } = require('./src/the-web3');
const { theContract } = require('./src/the-contract');
const BigNumber = require('bignumber.js');
const { Offer } = require('./src/Offer');
const { Token } = require('./src/Token');


(async () => {
    // "W-ETH": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    // "DAI": "0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359",
    const t1 = new Token('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2');
    const t2 = new Token('0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359');

    const [res] = await Offer.getVolumePrice(t1, t2, BigInt('99923957565163766590012'));

    console.log('>>>> ', res);
})();
