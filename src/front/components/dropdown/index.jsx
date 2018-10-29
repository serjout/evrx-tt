const React = require('react');
const s = require('./index.styl');
const propTypes = require('prop-types');
const cn = require('classnames');

class Dropdown extends React.Component {
    static propTypes = {
        cmpName: propTypes.string,
        isExpanded: propTypes.bool,
        onButtonClick: propTypes.func,
        onRequireClose: propTypes.func,
        children: propTypes.node,
        className: propTypes.string,
        disabled: propTypes.bool,
        innerContent: propTypes.string,
        inputType: propTypes.string,
        tag: propTypes.string,
        tagPopup: propTypes.string,
    }

    static defaultProps = {
        innerContent: '<Dropdown>',
        inputType: 'text',
        tag: 'button',
        tagPopup: 'div',
    }

    inputRef = React.createRef();
    rootRef = React.createRef();

    handleBodyClick = (event) => {
        if (
            this.props.onRequireClose &&
            this.props.isExpanded &&
            (this.rootRef && !this.rootRef.current.contains(event.target))
        ) {
            this.props.onRequireClose();
        }
    };

    focus = () => {
        this.inputRef.current.focus();
    };

    componentDidMount() {
        if (typeof window !== 'undefined') {
            window.document.body.addEventListener(
                'click',
                this.handleBodyClick,
            );
        }
    };

    componentWillUnmount() {
        if (typeof window !== 'undefined') {
            window.document.body.removeEventListener(
                'click',
                this.handleBodyClick,
            );
        }
    };

    focusOnButton = () => {
        this.inputRef.current?.focus?.();
    }

    render() {
        const p = this.props;
        const Tag = p.tag;
        const TagPopup = p.tagPopup;

        return (
            <div
                data-cmp-name={p.cmpName || 'Dropdown'}
                className={cn(
                    p.className,
                    s.Root,
                    p.disabled ? Root_disabled : null,
                    {
                        [s.Root_expanded]: p.isExpanded,
                    },
                )}
                ref={this.rootRef}
            >
                <Tag
                    ref={this.inputRef}
                    className={cn(
                        s.Button,
                        {
                            [s.Button_pressed]: p.isExpanded
                        }
                    )}
                    onClick={p.onButtonClick}
                    disabled={p.disabled}
                >
                    {p.innerContent}
                </Tag>
                <TagPopup 
                    className={cn(
                        s.Popup,
                        {
                            [s.Popup_visible]: p.isExpanded
                        }
                    )}
                >
                    {p.children}
                </TagPopup>
            </div>
        );
    }
}

Dropdown.Dropdown = Dropdown;
module.exports = Dropdown;