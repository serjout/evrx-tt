const React = require('react');
const { Dropdown } = require('../dropdown');
const s = require('./index.styl');
const propTypes = require('prop-types');
const cn = require('classnames');

class Select extends React.Component {
    static propTypes = {
        onChange: propTypes.func,
        mapOfValues: propTypes.object,
        value: propTypes.string,
    }

    state = {
        isExpanded: false,
    }

    ddRef = React.createRef();

    handleClick = () => {
        this.setState({ isExpanded: !this.state.isExpanded });
    }

    focus = () => {
        this.ddRef.current?.focusOnButton();
    }

    handleClose = () => {
        this.setState({ isExpanded: false });
    }

    handleChange = event => {
        const key = event.target.value;

        this.props.onChange?.({
            key,
            value: this.props.mapOfValues[key],
            event,
        })

        this.setState(
            { isExpanded: false }, 
            () => setTimeout(this.focus, 0)
        );
    }

    render() {
        const p = this.props;

        return (
            <Dropdown 
                ref={this.ddRef}
                className={s.Root} 
                cmpName="Select"
                innerContent={p.value}
                isExpanded={this.state.isExpanded}
                onRequireClose={this.handleClose}
                onButtonClick={this.handleClick}
            >
                <ul className={s.List}>
                    {Object.keys(p.mapOfValues).map(key => {
                        return <li className={s.Item} key={key}>
                            <button className={s.Button} onClick={this.handleChange} value={key}>
                                {key}
                            </button>
                        </li>
                    })}
                </ul>
            </Dropdown>
        );
    }
}

Select.Select = {};
module.exports = { Select };