/* eslint-disable no-fallthrough */

import React, { Component } from "react";
import ArrowDown from "../arrows/Down";
import TrebleClef from "../../assets/img/TrebleClef";
import BassClef from "../../assets/img/BassClef";
import TenorClef from "../../assets/img/TenorClef";
import AltoClef from "../../assets/img/AltoClef";
import NoNoteClef from "../../assets/img/NoNoteClef";

let ClefComponent = TrebleClef;

class SubMenu extends Component {
  constructor(props) {
    super(props);
    this.toggleClass = this.toggleClass.bind(this);
    const initactive = props.active ? true : false;
    this.state = {
      active: initactive,
      focusedIndex: -1, // -1 = trigger focused, 0+ = menu item index
    };
    this.menuItemRefs = []; // Array to hold refs to menu items
    this.triggerRef = React.createRef(); // Ref for the trigger button
  }

  toggleClass() {
    const currentState = this.state.active;
    this.setState({
      active: !currentState,
      focusedIndex: -1 // Reset focus index when toggling
    });
  }

  handleKeyDown = (event) => {
    // Keyboard accessibility: Activate on Enter or Space key
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault(); // Prevent Space from scrolling page
      this.toggleClass();
    }
  };

  /**
   * Check if a menu item is disabled
   * @param {HTMLElement} element - Menu item DOM element
   * @returns {boolean} True if disabled
   */
  isMenuItemDisabled = (element) => {
    return element?.hasAttribute('aria-disabled') &&
           element.getAttribute('aria-disabled') === 'true';
  };

  /**
   * Find the next enabled menu item index
   * @param {number} currentIndex - Current focused item index
   * @param {number} direction - 1 for down, -1 for up
   * @returns {number} Next enabled item index
   */
  findNextEnabledIndex = (currentIndex, direction) => {
    const items = this.menuItemRefs;
    const totalItems = items.length;
    let nextIndex = currentIndex;
    let attempts = 0;

    do {
      // Wrap using modulo arithmetic
      nextIndex = (nextIndex + direction + totalItems) % totalItems;
      attempts++;

      // Prevent infinite loop if all items disabled
      if (attempts > totalItems) {
        return currentIndex; // Stay on current item
      }
    } while (this.isMenuItemDisabled(items[nextIndex]));

    return nextIndex;
  };

  /**
   * Find the first enabled menu item index
   * @returns {number} First enabled item index, or 0 if all disabled
   */
  findFirstEnabledItem = () => {
    const items = this.menuItemRefs;
    for (let i = 0; i < items.length; i++) {
      if (!this.isMenuItemDisabled(items[i])) {
        return i;
      }
    }
    return 0; // Fallback if all disabled
  };

  /**
   * Find the last enabled menu item index
   * @returns {number} Last enabled item index, or length-1 if all disabled
   */
  findLastEnabledItem = () => {
    const items = this.menuItemRefs;
    for (let i = items.length - 1; i >= 0; i--) {
      if (!this.isMenuItemDisabled(items[i])) {
        return i;
      }
    }
    return items.length - 1; // Fallback if all disabled
  };

  /**
   * Handle keyboard navigation within the menu
   */
  handleMenuKeyDown = (event) => {
    if (!this.state.active) return; // Only handle keys when menu is open

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (this.state.focusedIndex === -1) {
          // Moving from trigger to first enabled item
          const firstIndex = this.findFirstEnabledItem();
          this.setState({ focusedIndex: firstIndex });
          this.menuItemRefs[firstIndex]?.focus();
        } else {
          // Navigate to next enabled item
          const nextIndex = this.findNextEnabledIndex(this.state.focusedIndex, 1);
          this.setState({ focusedIndex: nextIndex });
          this.menuItemRefs[nextIndex]?.focus();
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (this.state.focusedIndex === -1) {
          // Moving from trigger to first enabled item
          const firstIndex = this.findFirstEnabledItem();
          this.setState({ focusedIndex: firstIndex });
          this.menuItemRefs[firstIndex]?.focus();
        } else {
          // Navigate to previous enabled item
          const prevIndex = this.findNextEnabledIndex(this.state.focusedIndex, -1);
          this.setState({ focusedIndex: prevIndex });
          this.menuItemRefs[prevIndex]?.focus();
        }
        break;

      case 'Home':
        event.preventDefault();
        const firstIndex = this.findFirstEnabledItem();
        this.setState({ focusedIndex: firstIndex });
        this.menuItemRefs[firstIndex]?.focus();
        break;

      case 'End':
        event.preventDefault();
        const lastIndex = this.findLastEnabledItem();
        this.setState({ focusedIndex: lastIndex });
        this.menuItemRefs[lastIndex]?.focus();
        break;

      case 'Escape':
        event.preventDefault();
        this.setState({ active: false, focusedIndex: -1 });
        this.triggerRef.current?.focus();
        break;

      case 'Tab':
        // Allow default Tab behavior (menu stays open)
        break;

      default:
        break;
    }
  };

  componentDidMount() {
    if (this.props.displayClef) {
      this.selectPictoClef();
    }
    // Collect menu item refs after render
    this.updateMenuItemRefs();
  }

  componentDidUpdate(prevProps, prevState) {
    // Update refs when menu opens/closes
    if (this.state.active !== prevState.active) {
      this.updateMenuItemRefs();
    }
  }

  updateMenuItemRefs = () => {
    // Query all elements with role="menuitemradio" within this menu
    if (this.menuContainerRef) {
      const menuItems = this.menuContainerRef.querySelectorAll('[role="menuitemradio"]');
      this.menuItemRefs = Array.from(menuItems);
    }
  };

  selectPictoClef() {
    // Better solution to load dyncamically components
    // but not working on github pages
    //ClefComponent = loadable(props => import(`../../assets/img/${imgClass}Clef`));
    // in render : <ClefComponent clef={this.props.selected} />
    // console.log("selectPictoClef this.props.selected", this.props.selected);
    // dirty solution :
    switch (this.props.selected) {
      case "treble":
        ClefComponent = TrebleClef;
        break;
      case "bass":
        ClefComponent = BassClef;
        break;
      case "tenor":
        ClefComponent = TenorClef;
        break;
      case "alto":
        ClefComponent = AltoClef;
        break;
      case "hide notes":
        ClefComponent = NoNoteClef;
        break;
      default:
        ClefComponent = TrebleClef;
    }
  }

  render() {
    let isActive = this.state.active ? "selected" : null;
    this.selectPictoClef();

    // Clone content to add refs to menu items (Radio components)
    const enhancedContent = React.Children.map(this.props.content, (child) => {
      if (!child || !child.props) return child;

      // If child is a container (div with className items-list)
      if (child.type === 'div' && child.props.className === 'items-list') {
        const enhancedChildren = React.Children.map(child.props.children, (listChild) => {
          if (!listChild || !listChild.type) return listChild;

          // If it's ListRadio, clone it and enhance its children
          if (listChild.type.name === 'ListRadio' || (listChild.type.displayName === 'ListRadio')) {
            // We need to enhance the Radio components rendered by ListRadio
            // This is handled by modifying the Radio component itself
            return listChild;
          }

          return listChild;
        });

        return React.cloneElement(child, {}, enhancedChildren);
      }

      return child;
    });

    return (
      <React.Fragment>
        <div className="sub-menu">
          <div
            ref={ref => this.menuContainerRef = ref}
            className={`sub-menu__content ${isActive}`}
            onKeyDown={this.handleMenuKeyDown}
            role="menu"
            tabIndex={-1}>
            {enhancedContent}
          </div>
          <div
            ref={this.triggerRef}
            className={`button ${isActive}`}
            onClick={this.toggleClass}
            onKeyDown={this.handleKeyDown}
            tabIndex={0}
            role="button"
            aria-label={this.props.title}
            aria-expanded={this.state.active}>
            <div className="button-title">
              {this.props.selectedImg}

              {this.props.displayClef ? <ClefComponent /> : ""}
              {this.props.displayClef ? (
                <span className="sub-menu__item selected">{this.props.selected}</span>
              ) : (
                <span className="sub-menu__title selected">{this.props.selected}</span>
              )}
            </div>
            <ArrowDown />
            {/* <div className={`content ${isActive}`}>{this.props.content}</div> */}
          </div>
        </div>
        <div className="title-wrapper">
          <span className={`title ${isActive}`} title={this.props.title}>
            {this.props.title}
          </span>
        </div>
        {/* <hr className={isActive} /> */}
      </React.Fragment>
    );
  }
}

export default SubMenu;
