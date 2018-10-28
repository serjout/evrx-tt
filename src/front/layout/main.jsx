const React = require('react');
const s = require('./index.styl');
const { Order } = require('../components/order');
const { Panel } = require('../components/panel');
const { Select } = require('../components/select');
const { Trade } = require('../components/trade');

class MainLayout extends React.Component {
    render() {
        return  <div className={s.Root} data-cmp-name={MainLayout.name}>
            <Order />
            <Panel />
            <Select />
            <Trade />
        </div>
    }
}

module.exports = { MainLayout };