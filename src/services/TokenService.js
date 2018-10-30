const { theContract, fromBlock } = require('../the-contract');
const { theWeb3 } = require('../the-web3');
const { Token } = require('../entities/Token');

module.exports = ({ Token }) => class TokenService { 
    getPairName(...tokens) {
        const ts = tokens.map(t => t instanceof Token ? t.address : String(t));

        return ts.sort().join('/');
    }

    /**
     * 
     */
    async syncMapTokenAddrToPair() {
        const map = new Map();
        const addrs = Object.keys(Token.mapAddrToToken);
        const promises = [];

        addrs.forEach(a => addrs.forEach(async (b) => {
            if (a !== b) {
                const promise = theContract.methods.isTokenPairWhitelisted(a, b).call();
                promises.push(promise);
                const isWhitelisted = await promise;
                if (isWhitelisted) {
                    let set = map.get(a);
                    if (!set) {
                        set = new Set();
                        map.set(a, set);
                    }
                    set.add(b);
                }
            }
        }));

        await Promise.all(promises);

        return map;
    }
}