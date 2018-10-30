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
        name: propTypes.string,
        className: propTypes.string,
        disabled: propTypes.bool,
    }

    static defaultProps = {
        value: '',
        mapOfValues: {},
        name: '',
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
            name: this.props.name,
        })

        this.setState(
            { isExpanded: false }, 
            () => setTimeout(this.focus, 0)
        );
    }

    render() {
        const p = this.props;
        const keys = Object.keys(p.mapOfValues);
        const disabled = p.disabled || keys.length === 0;

        return (
            <Dropdown 
                ref={this.ddRef}
                className={cn(s.Root, p.className, { [s.Root_disabled]: disabled })} 
                cmpName="Select"
                innerContent={p.value}
                isExpanded={this.state.isExpanded}
                onRequireClose={this.handleClose}
                onButtonClick={this.handleClick}
                disabled={disabled}
            >
                <ul className={s.List}>
                    {keys.map(key => {
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
