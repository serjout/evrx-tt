const { ETH_ENV } = require('../../config/env');
const contractCfg = require('../../contract/config.json');
const mapTokenToAddr = contractCfg.tokens[ETH_ENV];

// TODO get ticker from token contract

module.exports = () => {
    class Token {
        static getByAddr(addr) {
            addr = addr.toLowerCase();

            return (addr in Token._cache)
                ? Token._cache[addr]
                : new Token(addr);
        }

        static getFewTokens(amount) {
            const addrs = Object.keys(Token.mapAddrToToken);

            const a = amount === undefined ? addrs.length : amount; 

            if (a > addrs.length) {
                throw new Error('Not enough tokens');
            }

            return addrs.slice(0, a).map(addr => Token.getByAddr(addr));
        }

        toString() {
            return this.ticker;
        }

        equals(x) {
            if (this.address && x.address) {
                return x.address = this.address;
            }

            throw new Error('Incorrect Token');
        }

        constructor(address) {
            address = address.toLowerCase();
            this.ticker = Token.mapAddrToToken[address];
            if (this.ticker === undefined) {
                throw new Error(`Unknown token ${address}`);
            }
            this.address = address;     
            if (address in Token._cache) {
                throw new Error(`Token ${address} already exits. Use Token.getByAddr(address)`);
            }
            Token._cache[address] = this;
        }
    }

    Token._cache = {};
    Token.mapAddrToToken = Object.keys(mapTokenToAddr).reduce((acc, key) => (acc[mapTokenToAddr[key]] = key.toUpperCase(), acc), {});

    return Token;
}