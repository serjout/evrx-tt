const React = require('react');
const s = require('./index.styl');
const cn = require('classnames');
const propTypes = require('prop-types');
const { moveDecimalPoint, cutOffFractionalPart } = require('src/utils/move-decimal-point')

let tokenShape;
let FRACTION_LEN = 2;

class Trade extends React.Component {
    static propTypes = {
        trade: propTypes.shape({
            buyAmount: propTypes.any,
            payAmount: propTypes.any,
            payToken: tokenShape = propTypes.shape({
                ticker: propTypes.string,
            }),
            buyToken: tokenShape,
            decimalPrice: propTypes.any
        }),
        className: propTypes.string
    }

    render() {
        const p = this.props;
        const t = p.trade;

        return (
            <div className={cn(s.Root, p.className)} data-cmp-name="Trade">
                <label className={s.Title}>{t.buyToken.ticker} / {t.payToken.ticker}</label>
                <dl className={s.List}>
                    <dt className={s.Termin}>Bought</dt>
                    <dd className={s.Definition}>{`${moveDecimalPoint(t.buyAmount, -18, FRACTION_LEN)} ${t.buyToken.ticker}`}</dd>
                    <dt className={s.Termin}>Paid</dt>
                    <dd className={s.Definition}>{`${moveDecimalPoint(t.payAmount, -18, FRACTION_LEN)} ${t.payToken.ticker}`}</dd>
                    <dt className={s.Termin}>Price</dt>
                    <dd className={s.Definition}>{cutOffFractionalPart(t.decimalPrice, FRACTION_LEN)}</dd>
                </dl>
            </div>
        );
    }
}
Trade.Trade = Trade;
module.exports = Trade;