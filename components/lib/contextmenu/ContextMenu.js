import React, { Component } from "react";
import PropTypes from "prop-types";
import { classNames, DomHandler, ZIndexUtils } from "../utils/Utils";
import { CSSTransition } from "../csstransition/CSSTransition";
import { Portal } from "../portal/Portal";
import PrimeReact from "../api/Api";
import { ContextMenuSub } from "./ContextMenuSub";

export class ContextMenu extends Component {
  static defaultProps = {
    id: null,
    model: null,
    style: null,
    className: null,
    global: false,
    autoZIndex: true,
    baseZIndex: 0,
    appendTo: null,
    transitionOptions: null,
    onShow: null,
    onHide: null,
  };

  static propTypes = {
    id: PropTypes.string,
    model: PropTypes.array,
    style: PropTypes.object,
    className: PropTypes.string,
    global: PropTypes.bool,
    autoZIndex: PropTypes.bool,
    baseZIndex: PropTypes.number,
    appendTo: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    transitionOptions: PropTypes.object,
    onShow: PropTypes.func,
    onHide: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      reshow: false,
      resetMenu: false,
      data: null,
    };

    this.onMenuClick = this.onMenuClick.bind(this);
    this.onLeafClick = this.onLeafClick.bind(this);
    this.onMenuMouseEnter = this.onMenuMouseEnter.bind(this);
    this.onEnter = this.onEnter.bind(this);
    this.onEntered = this.onEntered.bind(this);
    this.onExit = this.onExit.bind(this);
    this.onExited = this.onExited.bind(this);

    this.menuRef = React.createRef();
  }

  onMenuClick() {
    this.setState({
      resetMenu: false,
    });
  }

  onMenuMouseEnter() {
    this.setState({
      resetMenu: false,
    });
  }

  show(event, data) {
    if (!(event instanceof Event)) {
      event.persist();
    }

    event.stopPropagation();
    event.preventDefault();

    this.currentEvent = event;

    if (this.state.visible) {
      this.setState({ reshow: true });
    } else {
      this.setState({ visible: true }, () => {
        if (this.props.onShow) {
          this.props.onShow(this.currentEvent, data);
        }
      });
      if (data) {
        this.setState({ data });
      }
    }
  }

  hide(event) {
    if (!(event instanceof Event)) {
      event.persist();
    }

    this.currentEvent = event;
    this.setState({ visible: false, reshow: false }, () => {
      if (this.props.onHide) {
        this.props.onHide(this.currentEvent);
      }
    });
  }

  onEnter() {
    if (this.props.autoZIndex) {
      ZIndexUtils.set(
        "menu",
        this.menuRef.current,
        PrimeReact.autoZIndex,
        this.props.baseZIndex || PrimeReact.zIndex["menu"]
      );
    }

    this.position(this.currentEvent);
  }

  onEntered() {
    this.bindDocumentListeners();
  }

  onExit() {
    this.currentEvent = null;
    this.unbindDocumentListeners();
  }

  onExited() {
    ZIndexUtils.clear(this.menuRef.current);
  }

  position(event) {
    if (event) {
      let left = event.pageX + 1;
      let top = event.pageY + 1;
      let width = this.menuRef.current.offsetParent
        ? this.menuRef.current.offsetWidth
        : DomHandler.getHiddenElementOuterWidth(this.menuRef.current);
      let height = this.menuRef.current.offsetParent
        ? this.menuRef.current.offsetHeight
        : DomHandler.getHiddenElementOuterHeight(this.menuRef.current);
      let viewport = DomHandler.getViewport();

      //flip
      if (left + width - document.body.scrollLeft > viewport.width) {
        left -= width;
      }

      //flip
      if (top + height - document.body.scrollTop > viewport.height) {
        top -= height;
      }

      //fit
      if (left < document.body.scrollLeft) {
        left = document.body.scrollLeft;
      }

      //fit
      if (top < document.body.scrollTop) {
        top = document.body.scrollTop;
      }

      this.menuRef.current.style.left = left + "px";
      this.menuRef.current.style.top = top + "px";
    }
  }

  onLeafClick(event) {
    this.setState({
      resetMenu: true,
    });

    this.hide(event);

    event.stopPropagation();
  }

  isOutsideClicked(event) {
    return (
      this.menuRef &&
      this.menuRef.current &&
      !(this.menuRef.current.isSameNode(event.target) || this.menuRef.current.contains(event.target))
    );
  }

  bindDocumentListeners() {
    this.bindDocumentResizeListener();
    this.bindDocumentClickListener();
  }

  unbindDocumentListeners() {
    this.unbindDocumentResizeListener();
    this.unbindDocumentClickListener();
  }

  bindDocumentClickListener() {
    if (!this.documentClickListener) {
      this.documentClickListener = (event) => {
        if (this.isOutsideClicked(event) && event.button !== 2) {
          this.hide(event);

          this.setState({
            resetMenu: true,
          });
        }
      };

      document.addEventListener("click", this.documentClickListener);
    }
  }

  bindDocumentContextMenuListener() {
    if (!this.documentContextMenuListener) {
      this.documentContextMenuListener = (event) => {
        this.show(event);
      };

      document.addEventListener("contextmenu", this.documentContextMenuListener);
    }
  }

  bindDocumentResizeListener() {
    if (!this.documentResizeListener) {
      this.documentResizeListener = (event) => {
        if (this.state.visible && !DomHandler.isTouchDevice()) {
          this.hide(event);
        }
      };

      window.addEventListener("resize", this.documentResizeListener);
    }
  }

  unbindDocumentClickListener() {
    if (this.documentClickListener) {
      document.removeEventListener("click", this.documentClickListener);
      this.documentClickListener = null;
    }
  }

  unbindDocumentContextMenuListener() {
    if (this.documentContextMenuListener) {
      document.removeEventListener("contextmenu", this.documentContextMenuListener);
      this.documentContextMenuListener = null;
    }
  }

  unbindDocumentResizeListener() {
    if (this.documentResizeListener) {
      window.removeEventListener("resize", this.documentResizeListener);
      this.documentResizeListener = null;
    }
  }

  componentDidMount() {
    if (this.props.global) {
      this.bindDocumentContextMenuListener();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.visible && (prevState.reshow !== this.state.reshow || prevProps.model !== this.props.model)) {
      let event = this.currentEvent;
      this.setState(
        {
          visible: false,
          reshow: false,
          rePosition: false,
          resetMenu: true,
        },
        () => this.show(event)
      );
    }
  }

  componentWillUnmount() {
    this.unbindDocumentListeners();
    this.unbindDocumentContextMenuListener();

    ZIndexUtils.clear(this.menuRef.current);
  }

  renderContextMenu() {
    const className = classNames("p-contextmenu p-component", this.props.className);

    return (
      <CSSTransition
        nodeRef={this.menuRef}
        classNames="p-contextmenu"
        in={this.state.visible}
        timeout={{ enter: 250, exit: 0 }}
        options={this.props.transitionOptions}
        unmountOnExit
        onEnter={this.onEnter}
        onEntered={this.onEntered}
        onExit={this.onExit}
        onExited={this.onExited}
      >
        <div
          ref={this.menuRef}
          id={this.props.id}
          className={className}
          style={this.props.style}
          onClick={this.onMenuClick}
          onMouseEnter={this.onMenuMouseEnter}
        >
          <ContextMenuSub
            model={this.props.model}
            root
            resetMenu={this.state.resetMenu}
            onLeafClick={this.onLeafClick}
            data={this.state.data}
          />
        </div>
      </CSSTransition>
    );
  }

  render() {
    const element = this.renderContextMenu();

    return <Portal element={element} appendTo={this.props.appendTo} />;
  }
}
