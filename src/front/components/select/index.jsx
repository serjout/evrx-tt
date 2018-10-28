const React = require('react');
const s = require('./index.styl');

class Select extends React.Component {
    render() {
        return (
            <div className={s.Root} data-cmp-name={Select.name}>
                Select
            </div>
        );
    }
}

module.exports = { Select };