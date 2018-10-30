const React = require('react');
const s = require('./index.styl');
const cn = require('classnames');
const propTypes = require('prop-types');
const { Panel } = require('../panel');

class List extends React.PureComponent {
    static propTypes = {
        itemRender: propTypes.any,
        itemList: propTypes.array,
        itemKeyProperty: propTypes.string,
        className: propTypes.string,
        title: propTypes.string,
    }

    static defaultProps = {
        itemProps: {},
    }

    render() {
        const {
            itemRender: ItemRender,
            itemList,
            itemKeyProperty,
            className,
            title,
            ...rest
        } = this.props;

        const hasItems = itemList && itemList.length > 0;

        return (
            <Panel className={cn(s.Root, className)}>
                <div className={cn(s.ListPanel, {
                    [s.ListPanel_collapsed]: !hasItems
                })}>
                    <h2 className={s.ListHeader}>
                        {title}
                    </h2>
                    {hasItems && <ul className={s.List}>
                        {itemList.map(x => 
                            <li className={s.ListItem} key={x[itemKeyProperty]}>
                                <ItemRender 
                                    item={x}
                                    {...rest}
                                />
                            </li>
                        )}
                    </ul>}
                </div>
            </Panel>
        );
    }
}

List.List = List;
module.exports = List;