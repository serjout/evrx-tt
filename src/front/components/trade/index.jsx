const React = require('react');
const s = require('./index.styl');
const cn = require('classnames');
const propTypes = require('prop-types');

let tokenShape;

class Trade extends React.Component {
    propTypes = {
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
                    <dd className={s.Definition}>{`${t.buyAmount} ${t.buyToken.ticker}`}</dd>
                    <dt className={s.Termin}>Paid</dt>
                    <dd className={s.Definition}>{`${t.payAmount} ${t.payToken.ticker}`}</dd>
                    <dt className={s.Termin}>Price</dt>
                    <dd className={s.Definition}>{t.decimalPrice}</dd>
                </dl>
            </div>
        );
    }
}
Trade.Trade = Trade;
module.exports = Trade;