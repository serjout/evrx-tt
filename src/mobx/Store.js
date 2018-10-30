const { 
    decorate, 
    observable, 
    computed, 
    flow, 
    configure, 
    action,
    autorun
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

            const tokens = Token.getFewTokens();
            this.tokens = tokens.reduce((acc, t) => (acc[t.ticker] = t, acc), {});

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

                console.log('>>> fetch', left, right);

                this.fetchPastOffers(left, right);
            });

            this.tradeService.syncTrades();
            this.tradeService.setListener(this.onUpdateTrade);

            this.tokenService.syncMapTokenAddrToPair().then(action(map => this.mapTokenAddrToPair = map));

            this.isInited = true;
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
            return this.pastTrades;
        }

        _fetchPastOffers = flow(function* (token1, token2) {  
            this.pastOffers = token2
                ? yield this.offerService.getPastOffers(token1, token2, 10)
                : [];
        })
        fetchPastOffers(token1, token2) {
            if (this._fetchPastOffers_task) {
                this._fetchPastOffers_task.cancel();
            }

            this._fetchPastOffers_task = this._fetchPastOffers(token1, token2);
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
        trades: computed,
        mapTokenAddrToPair: observable.ref,
        onUpdateTrade: action,
        pastOffers: observable.ref,
        pastTrades: observable,
        recomentations: observable.ref,
        leftToken: observable.ref,
        rightToken: observable.ref,
        setToken: action,
    });
}