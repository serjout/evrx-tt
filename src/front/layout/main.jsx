const React = require('react');
const { observer } = require('mobx-react')
const { Panel } = require('../components/panel');
const { Order } = require('../components/Order');
const { Select } = require('../components/Select');
const { Trade } = require('../components/Trade');
const { Store } = require('../../mobx');
const s = require('./index.styl');

const store = new Store();
store.init();

window.___o = store;

const MainLayout = observer(class _ extends React.Component {
    handleChange = ({ key, value, name: side }) => {
        store.setToken(side, value);
    }

    render() {
        return  <div className={s.Root} data-cmp-name="MainLayout">
            <Panel>
                <h1 className={s.Header}>
                    {`Pair ${store.leftToken} / ${ store.rightToken || '---' }`}
                </h1>
            </Panel>
            <Panel className={s.PairSelectors}>
                <Select 
                    name="leftToken"
                    className={s.Select}
                    mapOfValues={store.tokens} 
                    onChange={this.handleChange}
                    value={store.leftToken.ticker}
                />
                <Select
                    name="rightToken"
                    className={s.Select}
                    mapOfValues={store.secondSelectValues} 
                    onChange={this.handleChange}
                    value={
                        store.rightToken
                            ? store.rightToken.ticker
                            : 'Please select'
                    }
                />
            </Panel>
            <Panel>
                <ul>
                    {store.pastOffers.map(x => <div>
                        {`${x.id}  ${x.decimalPrice} ${x.buy.amount}`}
                    </div>)}
                </ul>
            </Panel>
            <Panel>
                <h2 className={s.SubHeader}>Past trades</h2>
                <ul className={s.TradeList}>
                    <li className={s.TradeItem}>
                        {store.trades.map(x => <Trade trade={x} className={s.TradeItem} key={x.instanceId} />)}
                    </li>
                </ul>
            </Panel>
        </div>
    }
})

module.exports = { MainLayout };