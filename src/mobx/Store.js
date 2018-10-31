const { moveDecimalPoint } = require('src/utils/move-decimal-point');
const { oneCall } = require('./utils/decorator-one-call');
const { 
    decorate, 
    observable, 
    computed, 
    flow, 
    configure, 
    action,
    autorun,
    runInAction,
} = require("mobx");

configure({
    enforceActions: "observed",
});

const LOADING_ARRAY = [];
const LOADING_RECOMMENDS = { recomentations: 'Loading...' }

module.exports = ({ Offer, OfferService, TradeService, Token, TokenService }) => {
    class Store {
        leftToken = undefined;
        rightToken = undefined;

        isInited = false;
        pastOffers = [];
        pastTrades = [];
        tokens = {};
        mapTokenAddrToPair = undefined;

        constructor () {
            const [leftToken] = Token.getFewTokens(2);
            this.leftToken = leftToken;

            this.offerService = new OfferService();
            this.tradeService = new TradeService();  
            this.tokenService = new TokenService();
        }

        async init() {
            if (this.isInited) {
                return;
            }

            autorun(() => {
                const left = this.leftToken;
                const right = this.rightToken;
                const amount = this.amount;

                if (left && right) {
                    this.fetchPastOffers(left, right);
                    
                    if (amount) {
                        this.execPriceQuery(left, right, amount);
                    }
                } else {
                    this.clearPastOffer()
                }
            });

            this.tradeService.syncTrades();
            this.tradeService.setListener(this.onUpdateTrade);

            this.tokenService.syncMapTokenAddrToPair().then(this.setTokenPairs);

            this.isInited = true;
        }

        setAmount(amount) {
            this.amount = amount;
        }

        setTokenPairs = (map) => {
            this.mapTokenAddrToPair = map;
            let first;

            const tokens = Token.getFewTokens();
            this.tokens = tokens.reduce((acc, t) => {
                if (map.get(t.address)?.size > 0) {
                    acc[t.ticker] = t; 

                    if (!first) {
                        first = t;
                    }
                }
                return acc;
            }, {});

            if (!map.has(this.leftToken.address)) {
                this.leftToken = first;
            }
        }

        checkTokenPair(token1, token2) {
            return Boolean(token2
                && this.mapTokenAddrToPair
                && this.mapTokenAddrToPair.has(token1.address)
                && this.mapTokenAddrToPair.get(token1.address).has(token2.address)
            );
        }

        get secondSelectValues() {
            const left = this.leftToken;
            const keys = Object.keys(this.tokens);

            return keys
                .map(ticker => this.tokens[ticker])
                .filter(token => this.checkTokenPair(left, token))
                .reduce((acc, token) => {
                    acc[token.ticker] = token;
                    return acc;
                }, {});
        }

        onUpdateTrade = (trade) => {
            if (Array.isArray(trade)) {
                this.pastTrades = trade;
            } else {
                this.pastTrades.push(trade);
            }
        }

        onUpdateTokenPair = (pair) => {
            if (pair instanceof Set) {
                this.mapTokenAddrToPair = pair;
            } else {
                this.mapTokenAddrToPair.add(trade);
            }
        }

        get trades() {
            // const set = new Set([this.leftToken, this.rightToken]);

            // return this.pastTrades.filter(x => set.has(x.payToken) && set.has(x.buyToken)).slice(-10);
            return this.pastTrades.slice(-15);
        }
        
        fetchPastOffers = oneCall(flow(function* (token1, token2) {  
            this.pastOffers = LOADING_ARRAY;

            if (token1 && token2) {
                this.pastOffers = yield this.offerService.getPastOffers(token1, token2, 10);
            }
        }))

        clearPastOffer() {
            this.fetchPastOffers.cancel();

            this.pastOffers = [];
        }

        recommends = {};

        execPriceQuery = oneCall(flow(function* (token1, token2, amount) {
            const volume = moveDecimalPoint(amount, 18);

            this.recommends = LOADING_RECOMMENDS;

            const result = yield this.offerService.getRecommendationsForVolumeBuy(
                token1, token2, BigInt(volume)
            );

            this.recommends = result;
        }));

        get isOrderLoading() {
            return this.pastOffers === LOADING_ARRAY;
        }

        setToken(side, token) {
            if (side === 'leftToken') {
                this.leftToken = token; 
                if (!this.checkTokenPair(token, this.rightToken)) {
                    this.rightToken = undefined;
                }
            } else {
                this.rightToken = token;
            } 
        }
    }

    return decorate(Store, {
        setAmount: action,
        amount: observable,
        recommends: observable.ref,
        setTokenPairs: action,
        trades: computed,
        tokens: observable.ref,
        mapTokenAddrToPair: observable.ref,
        onUpdateTrade: action,
        pastOffers: observable.ref,
        pastTrades: observable,
        recomentations: observable.ref,
        leftToken: observable.ref,
        rightToken: observable.ref,
        setToken: action,
        clearPastOffer: action,
    });
}