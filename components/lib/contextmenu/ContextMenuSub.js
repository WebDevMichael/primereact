import React, { Component } from "react";
import PropTypes from "prop-types";
import { classNames, DomHandler} from "../utils/Utils";
import { CSSTransition } from "../csstransition/CSSTransition";
import { Ripple } from '../ripple/Ripple';

export class ContextMenuSub extends Component {

    static defaultProps = {
        model: null,
        root: false,
        className: null,
        resetMenu: false,
        onLeafClick: null
    };

    static propTypes = {
        model: PropTypes.any,
        root: PropTypes.bool,
        className: PropTypes.string,
        resetMenu: PropTypes.bool,
        onLeafClick: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            activeItem: null
        };

        this.onEnter = this.onEnter.bind(this);
        this.submenuRef = React.createRef();
    }

    onItemMouseEnter(event, item) {
        if (item.disabled) {
            event.preventDefault();
            return;
        }

        this.setState({
            activeItem: item
        });
    }

    onItemClick(event, item) {
        if (item.disabled) {
            event.preventDefault();
            return;
        }

        if (!item.url) {
            event.preventDefault();
        }

        if (item.command) {
            item.command({
                originalEvent: event,
                item: item,
                data: this.props.data,
            });
        }

        if (!item.items) {
            this.props.onLeafClick(event);
        }
    }

    position() {
        const parentItem = this.submenuRef.current.parentElement;
        const containerOffset = DomHandler.getOffset(this.submenuRef.current.parentElement)
        const viewport = DomHandler.getViewport();
        const sublistWidth = this.submenuRef.current.offsetParent ? this.submenuRef.current.offsetWidth : DomHandler.getHiddenElementOuterWidth(this.submenuRef.current);
        const itemOuterWidth = DomHandler.getOuterWidth(parentItem.children[0]);

        this.submenuRef.current.style.top = '0px';

        if ((parseInt(containerOffset.left, 10) + itemOuterWidth + sublistWidth) > (viewport.width - DomHandler.calculateScrollbarWidth())) {
            this.submenuRef.current.style.left = -1 * sublistWidth + 'px';
        }
        else {
            this.submenuRef.current.style.left = itemOuterWidth + 'px';
        }
    }

    onEnter() {
        this.position();
    }

    isActive() {
        return this.props.root || !this.props.resetMenu;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.resetMenu === true) {
            return {
                activeItem: null
            }
        }

        return null;
    }

    componentDidUpdate() {
        if (this.isActive()) {
            this.position();
        }
    }

    renderSeparator(index) {
        return (
            <li key={'separator_' + index} className="p-menu-separator" role="separator"></li>
        );
    }

    renderSubmenu(item) {
        if (item.items) {
            return (
                <ContextMenuSub model={item.items} resetMenu={item !== this.state.activeItem} onLeafClick={this.props.onLeafClick} data={this.props.data} />
            );
        }

        return null;
    }

    renderMenuitem(item, index) {
        const active = this.state.activeItem === item;
        const className = classNames('p-menuitem', { 'p-menuitem-active': active }, item.className);
        const linkClassName = classNames('p-menuitem-link', { 'p-disabled': item.disabled });
        const iconClassName = classNames('p-menuitem-icon', item.icon);
        const submenuIconClassName = 'p-submenu-icon pi pi-angle-right';
        const icon = item.icon && <span className={iconClassName}></span>;
        const label = item.label && <span className="p-menuitem-text">{item.label}</span>;
        const submenuIcon = item.items && <span className={submenuIconClassName}></span>;
        const submenu = this.renderSubmenu(item);
        let content = (
            <a href={item.url || '#'} className={linkClassName} target={item.target} onClick={(event) => this.onItemClick(event, item, index)} role="menuitem"
                aria-haspopup={item.items != null} aria-disabled={item.disabled}>
                {icon}
                {label}
                {submenuIcon}
                <Ripple />
            </a>
        );

        if (item.template) {
            const defaultContentOptions = {
                onClick: (event) => this.onItemClick(event, item, index),
                className: linkClassName,
                labelClassName: 'p-menuitem-text',
                iconClassName,
                submenuIconClassName,
                element: content,
                props: this.props,
                active
            };

            content = ObjectUtils.getJSXElement(item.template, item, defaultContentOptions);
        }

        return (
            <li key={item.label + '_' + index} role="none" className={className} style={item.style} onMouseEnter={(event) => this.onItemMouseEnter(event, item)}>
                {content}
                {submenu}
            </li>
        );
    }

    renderItem(item, index) {
        if (item.separator)
            return this.renderSeparator(index);
        else
            return this.renderMenuitem(item, index);
    }

    renderMenu() {
        if (this.props.model) {
            return (
                this.props.model.map((item, index) => {
                    return this.renderItem(item, index);
                })
            );
        }

        return null;
    }

    render() {
        const className = classNames({ 'p-submenu-list': !this.props.root });
        const submenu = this.renderMenu();
        const isActive = this.isActive();

        return (
            <CSSTransition nodeRef={this.submenuRef} classNames="p-contextmenusub" in={isActive} timeout={{ enter: 0, exit: 0 }}
                unmountOnExit onEnter={this.onEnter}>
                <ul ref={this.submenuRef} className={className}>
                    {submenu}
                </ul>
            </CSSTransition>
        );
    }
}

