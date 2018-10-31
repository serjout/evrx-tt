const React = require('react');
const s = require('./index.styl');
const propTypes = require('prop-types');
const cn = require('classnames');

const Input = React.forwardRef((props, ref) => {
    const { className, validation, ...rest } = props;
    const hasError = Boolean(validation);

    return (
        <div className={cn(className, s.InputCt, {
            [s.InputCt_error]: hasError
        })}>
            <input
                ref={ref}
                className={cn(s.Input, {
                    [s.Input_error]: hasError
                })}
                {...rest}
            />
            <span className={cn(s.SubText, {
                    [s.SubText_error]: hasError
                })}>
                {validation}
            </span>
        </div>
    );
});

Input.propTypes = {
    validation: propTypes.string,
}

Input.Input = Input;
module.exports = Input;
