const React = require('react');
const s = require('./index.styl');
const cn = require('classnames');

class Panel extends React.Component {
    render() {
        return (
            <section className={cn(s.Root, this.props.className)} data-cmp-name="Panel">
                <div className={s.Inner}>
                    {this.props.children}
                </div>
            </section>
        );
    }
}

Panel.Panel = Panel
module.exports = Panel;