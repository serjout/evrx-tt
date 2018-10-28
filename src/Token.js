const { ETH_ENV } = require('../config/env');
const contractCfg = require('../contract/config.json');
const mapTokenToAddr = contractCfg.tokens[ETH_ENV];

// TODO get ticker from token contract

class Token {
    static getByAddr(addr) {
        if (!(addr in Token._cache)) {
            Token._cache[addr] = new Token(addr);
        }
        return Token._cache[addr];
    }

    constructor(address) {
        if (address === undefined) {
            throw new Error(`Missing argument address`);
        }
        this.ticker = Token.mapAddrToToken[address.toLowerCase()];
        if (this.ticker === undefined) {
            throw new Error(`Unknown token ${address}`);
        }
        this.address = address;
    }
}

Token._cache = {};
Token.mapAddrToToken = Object.keys(mapTokenToAddr).reduce((acc, key) => (acc[mapTokenToAddr[key].toLowerCase()] = key.toUpperCase(), acc), {});

module.exports = { Token };