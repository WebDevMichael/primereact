import React, { Component } from "react";
import PropTypes from "prop-types";
import { DomHandler, classNames } from "../utils/Utils";
import { TreeTableBodyCell } from "./TreeTableBodyCell";
import { Ripple } from "../ripple/Ripple";
import { isArray, isObject } from "lodash";

export function getValueToCopy(realData) {
  if (isArray(realData) || isObject(realData)) {
    return JSON.stringify(realData, null, 2);
  }
  return realData;
}

export class TreeTableRow extends Component {
  static defaultProps = {
    node: null,
    level: null,
    columns: null,
    expandedKeys: null,
    contextMenuSelectionKey: null,
    selectionMode: null,
    selectionKeys: null,
    metaKeySelection: true,
    propagateSelectionUp: true,
    propagateSelectionDown: true,
    rowClassName: null,
    onExpand: null,
    onCollapse: null,
    onToggle: null,
    onRowClick: null,
    onRowDoubleClick: null,
    onSelect: null,
    onUnselect: null,
    onSelectionChange: null,
    onPropagateUp: null,
    onContextMenuSelectionChange: null,
    onContextMenu: null,
    selectOnFocus: true,
    onKeyDown: null,
  };

  static propTypes = {
    node: PropTypes.any,
    level: PropTypes.number,
    columns: PropTypes.array,
    expandedKeys: PropTypes.object,
    contextMenuSelectionKey: PropTypes.any,
    selectionMode: PropTypes.string,
    selectionKeys: PropTypes.any,
    metaKeySelection: PropTypes.bool,
    propagateSelectionUp: PropTypes.bool,
    propagateSelectionDown: PropTypes.bool,
    selectOnFocus: PropTypes.bool,
    rowClassName: PropTypes.func,
    onExpand: PropTypes.func,
    onCollapse: PropTypes.func,
    onToggle: PropTypes.func,
    onRowClick: PropTypes.func,
    onRowDoubleClick: PropTypes.func,
    onSelect: PropTypes.func,
    onUnselect: PropTypes.func,
    onSelectionChange: PropTypes.func,
    onFocus: PropTypes.func,
    onPropagateUp: PropTypes.func,
    onContextMenuSelectionChange: PropTypes.func,
    onContextMenu: PropTypes.func,
    onKeyDown: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.onTogglerClick = this.onTogglerClick.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onRowDoubleClick = this.onRowDoubleClick.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.propagateUp = this.propagateUp.bind(this);
    this.onCheckboxChange = this.onCheckboxChange.bind(this);
    this.onCheckboxFocus = this.onCheckboxFocus.bind(this);
    this.onCheckboxBlur = this.onCheckboxBlur.bind(this);
    this.onRightClick = this.onRightClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  isLeaf() {
    return this.props.node.leaf === false ? false : !(this.props.node.children && this.props.node.children.length);
  }

  onTogglerClick(event) {
    if (this.isExpanded()) this.collapse(event);
    else this.expand(event);

    event.preventDefault();
    event.stopPropagation();
  }

  expand(event) {
    let expandedKeys = this.props.expandedKeys ? { ...this.props.expandedKeys } : {};
    expandedKeys[this.props.node.key] = true;

    this.props.onToggle({
      originalEvent: event,
      value: expandedKeys,
    });

    this.invokeToggleEvents(event, true);
  }

  collapse(event) {
    let expandedKeys = { ...this.props.expandedKeys };
    delete expandedKeys[this.props.node.key];

    this.props.onToggle({
      originalEvent: event,
      value: expandedKeys,
    });

    this.invokeToggleEvents(event, false);
  }

  invokeToggleEvents(event, expanded) {
    if (expanded) {
      if (this.props.onExpand) {
        this.props.onExpand({
          originalEvent: event,
          node: this.props.node,
        });
      }
    } else {
      if (this.props.onCollapse) {
        this.props.onCollapse({
          originalEvent: event,
          node: this.props.node,
        });
      }
    }
  }

  onClick(event) {
    if (this.props.onRowClick) {
      this.props.onRowClick(event, this.props.node);
    }

    this.nodeTouched = false;
  }

  onRowDoubleClick(event) {
    if (this.props.onRowDoubleClick) {
      this.props.onRowDoubleClick(event, this.props.node);
    }
  }

  onTouchEnd() {
    this.nodeTouched = true;
  }

  onCheckboxChange(event) {
    const checked = this.isChecked();
    let selectionKeys = this.props.selectionKeys ? { ...this.props.selectionKeys } : {};

    if (checked) {
      if (this.props.propagateSelectionDown) this.propagateDown(this.props.node, false, selectionKeys);
      else delete selectionKeys[this.props.node.key];

      if (this.props.propagateSelectionUp && this.props.onPropagateUp) {
        this.props.onPropagateUp({
          originalEvent: event,
          check: false,
          selectionKeys: selectionKeys,
        });
      }

      if (this.props.onUnselect) {
        this.props.onUnselect({
          originalEvent: event,
          node: this.props.node,
        });
      }
    } else {
      if (this.props.propagateSelectionDown) this.propagateDown(this.props.node, true, selectionKeys);
      else selectionKeys[this.props.node.key] = { checked: true };

      if (this.props.propagateSelectionUp && this.props.onPropagateUp) {
        this.props.onPropagateUp({
          originalEvent: event,
          check: true,
          selectionKeys: selectionKeys,
        });
      }

      if (this.props.onSelect) {
        this.props.onSelect({
          originalEvent: event,
          node: this.props.node,
        });
      }
    }

    if (this.props.onSelectionChange) {
      this.props.onSelectionChange({
        originalEvent: event,
        value: selectionKeys,
      });
    }

    DomHandler.clearSelection();
  }

  onCheckboxFocus() {
    DomHandler.addClass(this.checkboxBox, "p-focus");
    DomHandler.addClass(this.checkboxRef, "p-checkbox-focused");
  }

  onCheckboxBlur() {
    DomHandler.removeClass(this.checkboxBox, "p-focus");
    DomHandler.removeClass(this.checkboxRef, "p-checkbox-focused");
  }

  propagateUp(event) {
    let check = event.check;
    let selectionKeys = event.selectionKeys;
    let checkedChildCount = 0;
    let childPartialSelected = false;

    for (let child of this.props.node.children) {
      if (selectionKeys[child.key] && selectionKeys[child.key].checked) checkedChildCount++;
      else if (selectionKeys[child.key] && selectionKeys[child.key].partialChecked) childPartialSelected = true;
    }

    if (check && checkedChildCount === this.props.node.children.length) {
      selectionKeys[this.props.node.key] = { checked: true, partialChecked: false };
    } else {
      if (!check) {
        delete selectionKeys[this.props.node.key];
      }

      if (childPartialSelected || (checkedChildCount > 0 && checkedChildCount !== this.props.node.children.length))
        selectionKeys[this.props.node.key] = { checked: false, partialChecked: true };
      else selectionKeys[this.props.node.key] = { checked: false, partialChecked: false };
    }

    if (this.props.propagateSelectionUp && this.props.onPropagateUp) {
      this.props.onPropagateUp(event);
    }
  }

  propagateDown(node, check, selectionKeys) {
    if (check) selectionKeys[node.key] = { checked: true, partialChecked: false };
    else delete selectionKeys[node.key];

    if (node.children && node.children.length) {
      for (let i = 0; i < node.children.length; i++) {
        this.propagateDown(node.children[i], check, selectionKeys);
      }
    }
  }

  onRightClick(event, nodeData) {
    console.log("onRightClick");
    DomHandler.clearSelection();

    if (this.props.onContextMenuSelectionChange) {
      this.props.onContextMenuSelectionChange({
        originalEvent: event,
        value: this.props.node.key,
      });
    }

    if (this.props.onContextMenu) {
      this.props.onContextMenu({
        originalEvent: event,
        node: this.props.node,
        nodeData,
      });
    }
  }

  onKeyDown(event, nodeData) {
    if (this.props.onKeyDown) {
      this.props.onKeyDown(event, nodeData);
    }
    if (event.metaKey && event.key === "c") {
      const realData = nodeData.data.realData;
      const valueToCopy = getValueToCopy(realData);
      navigator.clipboard.writeText(valueToCopy);
    }

    if (event.target === this.container) {
      const rowElement = event.currentTarget;
      switch (event.which) {
        //down arrow
        case 40:
          const nextRow = rowElement.nextElementSibling;
          if (nextRow) {
            nextRow.focus();
            if (this.props.selectOnFocus) {
              this.onClick(event);
            }
          }

          event.preventDefault();
          break;

        //up arrow
        case 38:
          const previousRow = rowElement.previousElementSibling;
          if (previousRow) {
            previousRow.focus();
            if (this.props.selectOnFocus) {
              this.onClick(event);
            }
          }

          event.preventDefault();
          break;

        //right arrow
        case 39:
          if (!this.isExpanded()) {
            this.expand(event);
          }

          event.preventDefault();
          break;

        //left arrow
        case 37:
          const expanded = this.isExpanded();
          if (expanded) {
            this.collapse(event);
          } else if (this.props.parent.isExpanded()) {
            this.props.parent.onClick(event);
            this.props.parentRef.focus();
          }

          event.preventDefault();
          break;

        //enter
        case 13:
          this.onClick(event);
          event.preventDefault();
          break;

        default:
          //no op
          break;
      }
    }
  }

  isExpanded() {
    return this.props.expandedKeys ? this.props.expandedKeys[this.props.node.key] !== undefined : false;
  }

  isSelected() {
    if ((this.props.selectionMode === "single" || this.props.selectionMode === "multiple") && this.props.selectionKeys)
      return this.props.selectionMode === "single"
        ? this.props.selectionKeys === this.props.node.key
        : this.props.selectionKeys[this.props.node.key] !== undefined;
    else return false;
  }

  isChecked() {
    return this.props.selectionKeys
      ? this.props.selectionKeys[this.props.node.key] && this.props.selectionKeys[this.props.node.key].checked
      : false;
  }

  isPartialChecked() {
    return this.props.selectionKeys
      ? this.props.selectionKeys[this.props.node.key] && this.props.selectionKeys[this.props.node.key].partialChecked
      : false;
  }

  renderToggler() {
    const expanded = this.isExpanded();
    const iconClassName = classNames('"p-treetable-toggler-icon pi pi-fw', {
      "pi-chevron-right": !expanded,
      "pi-chevron-down": expanded,
    });
    const style = {
      marginLeft: this.props.level * 16 + "px",
      visibility:
        this.props.node.leaf === false || (this.props.node.children && this.props.node.children.length)
          ? "visible"
          : "hidden",
    };

    return (
      <button
        type="button"
        className="p-treetable-toggler p-link p-unselectable-text"
        onClick={this.onTogglerClick}
        tabIndex={-1}
        style={style}
      >
        <i className={iconClassName}></i>
        <Ripple />
      </button>
    );
  }

  renderCheckbox() {
    if (this.props.selectionMode === "checkbox" && this.props.node.selectable !== false) {
      const checked = this.isChecked();
      const partialChecked = this.isPartialChecked();
      const className = classNames("p-checkbox-box", {
        "p-highlight": checked,
        "p-indeterminate": partialChecked,
      });
      const icon = classNames("p-checkbox-icon p-c", { "pi pi-check": checked, "pi pi-minus": partialChecked });

      return (
        <div
          className="p-checkbox p-treetable-checkbox p-component"
          ref={(el) => (this.checkboxRef = el)}
          onClick={this.onCheckboxChange}
          role="checkbox"
          aria-checked={checked}
        >
          <div className="p-hidden-accessible">
            <input type="checkbox" onFocus={this.onCheckboxFocus} onBlur={this.onCheckboxBlur} />
          </div>
          <div className={className} ref={(el) => (this.checkboxBox = el)}>
            <span className={icon}></span>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  renderCell(column) {
    let toggler, checkbox;

    if (column.props.expander) {
      toggler = this.renderToggler();
      checkbox = this.renderCheckbox();
    }

    return (
      <TreeTableBodyCell
        key={column.props.columnKey || column.props.field}
        {...column.props}
        selectOnEdit={this.props.selectOnEdit}
        selected={this.isSelected()}
        node={this.props.node}
        rowIndex={this.props.rowIndex}
      >
        {toggler}
        {checkbox}
      </TreeTableBodyCell>
    );
  }

  renderChildren() {
    if (this.isExpanded() && this.props.node.children) {
      return this.props.node.children.map((childNode, index) => {
        return (
          <TreeTableRow
            key={childNode.key || JSON.stringify(childNode.data)}
            level={this.props.level + 1}
            rowIndex={this.props.rowIndex + "_" + index}
            node={childNode}
            columns={this.props.columns}
            expandedKeys={this.props.expandedKeys}
            selectOnEdit={this.props.selectOnEdit}
            onToggle={this.props.onToggle}
            onExpand={this.props.onExpand}
            onCollapse={this.props.onCollapse}
            selectionMode={this.props.selectionMode}
            selectionKeys={this.props.selectionKeys}
            onSelectionChange={this.props.onSelectionChange}
            metaKeySelection={this.props.metaKeySelection}
            onRowClick={this.props.onRowClick}
            onSelect={this.props.onSelect}
            onUnselect={this.props.onUnselect}
            propagateSelectionUp={this.props.propagateSelectionUp}
            propagateSelectionDown={this.props.propagateSelectionDown}
            onPropagateUp={this.propagateUp}
            rowClassName={this.props.rowClassName}
            contextMenuSelectionKey={this.props.contextMenuSelectionKey}
            onContextMenuSelectionChange={this.props.onContextMenuSelectionChange}
            onContextMenu={(evt) => {
              this.props.onContextMenu(evt);
            }}
            onKeyDown={this.props.onKeyDown}
            onRowDoubleClick={this.props.onRowDoubleClick}
            parent={this}
            parentRef={this.container}
          />
        );
      });
    } else {
      return null;
    }
  }

  render() {
    const cells = this.props.columns.map((col) => this.renderCell(col));
    const children = this.renderChildren();
    let className = {
      "p-highlight": this.isSelected(),
      "p-highlight-contextmenu":
        this.props.contextMenuSelectionKey && this.props.contextMenuSelectionKey === this.props.node.key,
    };

    if (this.props.rowClassName) {
      let rowClassName = this.props.rowClassName(this.props.node);
      className = { ...className, ...rowClassName };
    }

    className = classNames(className, this.props.node.className);

    return (
      <>
        <tr
          ref={(el) => (this.container = el)}
          tabIndex={0}
          className={className}
          style={this.props.node.style}
          onClick={this.onClick}
          onDoubleClick={(evt) => this.onRowDoubleClick(evt, this.props.node)}
          onTouchEnd={this.onTouchEnd}
          onContextMenu={(evt) => this.onRightClick(evt, this.props.node)}
          onKeyDown={(evt) => this.onKeyDown(evt, this.props.node)}
        >
          {cells}
        </tr>
        {children}
      </>
    );
  }
}
