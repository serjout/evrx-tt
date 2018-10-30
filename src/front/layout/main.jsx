const React = require('react');
const { observer } = require('mobx-react')
const { Panel } = require('../components/panel');
const { Select } = require('../components/Select');
const { Trade } = require('../components/Trade');
const { Order } = require('../components/Order');
const { Store } = require('../../mobx');
const cn = require('classnames');

const s = require('./index.styl');

const store = new Store();
store.init();

window.___o = store;

const MainLayout = observer(class _ extends React.Component {
    handleChange = ({ key, value, name: side }) => {
        store.setToken(side, value);
    }

    render() {
        const left = store.leftToken;
        const hasOrders = store.pastOffers.length > 0;
        const hasTrades = store.trades.length > 0;

        return  <div className={s.Root} data-cmp-name="MainLayout">
            <Panel className={s.Top}>
                <h1 className={s.Header}>
                    {`OasisDex.com ${store.leftToken}/${ store.rightToken || '---' }`}
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
            <Panel key="orders" className={s.ListPanelCt}>
                <div className={cn(s.ListPanel, {
                    [s.ListPanel_collapsed]: !hasOrders
                })}>
                    <h2 className={s.ListHeader}>
                        {cn({
                            "No orders": !hasOrders && !store.isOrderLoading,
                            "Loading...": !hasOrders && store.isOrderLoading,
                            "Past orders": hasOrders,
                        })}
                    </h2>
                    {hasOrders && <ul className={s.List}>
                        {store.pastOffers.map(x => 
                            <li className={s.ListItem} key={String(x.id)}>
                                <Order
                                    offer={x} 
                                    leftToken={left} 
                                />
                            </li>
                        )}
                    </ul>}
                </div>
            </Panel>    
            <Panel key="trades" className={s.ListPanelCt}>
                <div className={cn(s.ListPanel, {
                    [s.ListPanel_collapsed]: !hasTrades
                })}>
                    <h2 className={s.ListHeader}>
                        {cn({
                            "Loading...": !hasTrades,
                            "Past trades": hasTrades,
                        })}
                    </h2>
                    {hasTrades && <ul className={s.List}>
                        {store.trades.map(x => 
                            <li className={s.ListItem} key={String(x.instanceId)}>
                                <Trade 
                                    trade={x} 
                                />
                            </li>
                        )}
                    </ul>}
                </div>
            </Panel>
        </div>
    }
})

module.exports = { MainLayout };