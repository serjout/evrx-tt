const React = require('react');
const s = require('./index.styl');

class Trade extends React.Component {
    render() {
        return (
            <div className={s.Root} data-cmp-name={Trade.name}>
                Trade
            </div>
        );
    }
}

module.exports = { Trade };