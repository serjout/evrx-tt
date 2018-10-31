const { moveDecimalPoint } = require('src/utils/move-decimal-point');
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

                if (left && right) {
                    this.fetchPastOffers(left, right);
                } else {
                    this.clearPastOffer()
                }
            });

            this.tradeService.syncTrades();
            this.tradeService.setListener(this.onUpdateTrade);

            this.tokenService.syncMapTokenAddrToPair().then(this.setTokenPairs);

            this.isInited = true;
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

        _fetchPastOffers_task = undefined;
        
        fetchPastOffers = flow(function* (token1, token2) {  
            this.pastOffers = [];

            if (token1 && token2) {
                this.pastOffers = yield this.offerService.getPastOffers(token1, token2, 10);
            }
        })

        async fetchPastOffers(token1, token2) {
            if (this._fetchPastOffers_task) {
                this._fetchPastOffers_task.cancel();
            }
            
            let task;
            try {

                task = this._fetchPastOffers_task = this._fetchPastOffers(token1, token2);
                await task;

            } catch(e) {
                // can be canceled
                
            } finally {runInAction(() => {
                // if still our task
                if (task === this._fetchPastOffers_task) {
                    this._fetchPastOffers_task = undefined;
                }
            });}
        }

        clearPastOffer() {
            if (this._fetchPastOffers_task) {
                this._fetchPastOffers_task.cancel();
            }

            this.pastOffers = [];
        }

        recommends = {};

        execPriceQuery = flow(function* (amount) {
            const t1 = this.leftToken;
            const t2 = this.rightToken;
            const volume = moveDecimalPoint(amount, 18);

            const result = yield this.offerService.getRecommendationsForVolumeBuy(
                t1, t2, BigInt(volume)
            );

            this.recommends = result;
        });

        get isOrderLoading() {
            const s = Symbol('check promise pending');
            return this._fetchPastOffers_task !== undefined;
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
        _fetchPastOffers_task: observable.ref,
        recommends: observable.ref,
        fetchPastOffers: action,
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