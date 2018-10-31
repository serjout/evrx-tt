const React = require('react');
const propTypes = require('prop-types');
const cn = require('classnames');
const { Button } = require('../button');
const { Input } = require('../input');
const { Panel } = require('../panel');

const s = require('./index.styl');

class Form extends React.PureComponent {
    state = {
        value: '',
        validation: '',
    }

    handleSubmit = (event) => {
        event.preventDefault();

        this.props.onSubmit?.(this.state.value);
    }

    handleChange = (event) => {
        const value = event.target.value;
        const validation = Form.validate(value);

        this.setState({
            value,
            validation,
        });
    }

    static getDerivedStateFromProps(props, state) {
        const result = {};

        if (!(props.leftToken && props.rightToken)) {
            result.validation = 'Token pair undefined';
        } else {
            result.validation = Form.validate(state.value);
        }

        return  result;
    }

    static validate(value) {
        const n = Number(value);

        if (Number.isNaN(n)) {
            return 'Invalid number'
        }

        if (n < 0) {
            return 'Needs positive amount'
        }

        return '';
    }

    render() {
        const p = this.props; 

        return <Panel className={cn(p.className, s.FormCt)}>
            <div>
                <h2 className={s.Title}>Calculate</h2>
                <form className={s.Form} onSubmit={this.handleSubmit}>
                    <Input 
                        className={s.Input} 
                        validation={
                            this.state.value === '' 
                                ? ''
                                : this.state.validation
                        }
                        onChange={this.handleChange}
                    />
                    <Button 
                        className={s.Button} 
                        disabled={this.state.validation}
                        type="submit"
                    >
                        Submit
                    </Button>
                </form>
            </div>
        </Panel>
    }
}

Form.Form = Form;
module.exports = Form;