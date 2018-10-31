const React = require('react');
const s = require('./index.styl');
const propTypes = require('prop-types');
const cn = require('classnames');

const Button = React.forwardRef((props, ref) => {
    const { className, type, disabled, ...rest } = props;
    return (
        <button
            ref={ref}
            className={cn(className, s.Button, {
                [s.Button_disabled]: disabled,
            })}
            type={type ? type : 'button'}
            disabled={disabled}
            {...rest}
        />
    );
});

Button.propTypes = {
    onClick: propTypes.func
}

Button.Button = Button;
module.exports = Button;
