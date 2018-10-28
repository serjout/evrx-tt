const React = require('react');
const s = require('./index.styl');

class Panel extends React.Component {
    render() {
        return (
            <div className={s.Root} data-cmp-name={Panel.name}>
                Panel
            </div>
        );
    }
}

module.exports = { Panel };