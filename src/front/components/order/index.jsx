const React = require('react');
const s = require('./index.styl');
const cn = require('classnames');
const propTypes = require('prop-types');
const { moveDecimalPoint, cutOffFractionalPart } = require('src/utils/move-decimal-point')

let tokenShape;
let sideShape;
let FRACTION_LEN = 2;

class Order extends React.Component {
    static propTypes = {
        offer: propTypes.shape({
            buy: sideShape = propTypes.shape({
                amount: propTypes.any,
                token: tokenShape = propTypes.shape({
                    ticker: propTypes.string,
                    address: propTypes.string,
                }),
            }),
            pay: sideShape,
            decimalPrice: propTypes.any
        }),
        leftToken: tokenShape,
        className: propTypes.string
    }

    render() {
        const p = this.props;
        const o = p.offer;

        const side = o.buy.token.equals(p.leftToken)
            ? 'buy'
            : 'sell'

        return (
            <div className={cn(s.Root, p.className)} data-cmp-name="Order">
                <label className={cn(s.Title, side === 'buy' ? s.Title_buy : s.Title_sell)}>
                    {side} {o.buy.token.ticker} for {o.pay.token.ticker}
                </label>
                <dl className={s.List}>
                    <dt className={s.Termin}>Buy</dt>
                    <dd className={s.Definition}>{`${moveDecimalPoint(o.buy.amount, -18, FRACTION_LEN)} ${o.buy.token.ticker}`}</dd>
                    <dt className={s.Termin}>Pay</dt>
                    <dd className={s.Definition}>{`${moveDecimalPoint(o.pay.amount, -18, FRACTION_LEN)} ${o.pay.token.ticker}`}</dd>
                    <dt className={s.Termin}>Price</dt>
                    <dd className={s.Definition}>{cutOffFractionalPart(o.decimalPrice, FRACTION_LEN)}</dd>
                </dl>
            </div>
        );
    }
}
Order.Order = Order;
module.exports = Order;