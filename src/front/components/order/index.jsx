const React = require('react');
const s = require('./index.styl');

class Order extends React.Component {
    render() {
        return (
            <div className={s.Root} data-cmp-name={Order.name}>
                {`Order ${s.Root}`}
            </div>
        );
    }
}

module.exports = { Order };