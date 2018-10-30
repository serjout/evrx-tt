const React = require('react');
const { observer } = require('mobx-react')
const { Panel } = require('../components/panel');
const { Select } = require('../components/Select');
const { Trade } = require('../components/Trade');
const { Order } = require('../components/Order');
const { List } = require('../components/List');
const { Store } = require('../../mobx');
const cn = require('classnames');

const s = require('./index.styl');

const store = new Store();
store.init();

window.___o = store;

const MainLayout = observer(class extends React.Component {
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
            <List 
                key="orders" 
                className={s.ListPanelCt}
                itemRender={Order}
                itemList={store.pastOffers}
                title={cn({
                    "No orders": !hasOrders && !store.isOrderLoading,
                    "Loading...": !hasOrders && store.isOrderLoading,
                    "Past orders": hasOrders,
                })}
                itemKeyProperty="id"
                leftToken={left} 
            />
            <List 
                key="trades"
                className={s.ListPanelCt}
                itemRender={Trade}
                itemList={store.trades}
                title={cn({
                    "Loading...": !hasTrades,
                    "Past trades": hasTrades,
                })}
                itemKeyProperty="instanceId"
            />
        </div>
    }
})

module.exports = { MainLayout };