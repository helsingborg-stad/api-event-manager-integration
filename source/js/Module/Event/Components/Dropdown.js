import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';

class DropdownNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listOpen: false
    };
    this.dropdownRef = createRef();
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.toggleList = this.toggleList.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleDocumentClick);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleDocumentClick);
  }

  handleDocumentClick(event) {
    if (!this.state.listOpen) return;
    if (this.dropdownRef.current && !this.dropdownRef.current.contains(event.target)) {
      this.setState({ listOpen: false });
    }
  }

  toggleList() {
    this.setState(prevState => ({ listOpen: !prevState.listOpen }));
  }

  render() {
    const { title, children, id, toggleClass } = this.props;
    const { listOpen } = this.state;
    return (
      <div className={
        'c-dropdown js-dropdown c-dropdown-button--left c-dropdown-button--left__click c-dropdown--on-click' +
        (listOpen ? ' is-open' : '')
      } ref={this.dropdownRef} id={id}>
        <button
          className={
            'c-button js-dropdown-button c-button__filled c-button__filled--default c-button--md' +
            (toggleClass ? ` ${toggleClass}` : '')
          }
          type="button"
          aria-label={title}
          aria-expanded={listOpen}
          onClick={this.toggleList}
        >
          <span className="c-button__label">
            <span className="c-button__loader"></span>
            <span className="c-button__label-icon ">
              <span className="c-icon c-icon--keyboard-arrow-down c-icon--material c-icon--material-keyboard_arrow_down material-symbols material-symbols-rounded material-symbols-sharp material-symbols-outlined  c-icon--size-md" aria-hidden="false" data-material-symbol="keyboard_arrow_down" role="img" data-nosnippet="" translate="no" aria-label="Icon: Undefined"></span>
            </span>
            <span className="c-button__label-text ">{title}</span>
          </span>
        </button>
        {listOpen && (
          <ul 
            className="c-dropdown__list event-dropdown-ul"
            style={{ cursor: "auto", padding: "20px 16px", marginTop: "0"}}
            >
            {React.Children.map(children, (child, idx) => (
              <li
                key={idx}
                style={{ padding: "4px 0", marginTop: "0" }}
                className="c-dropdown__item"
              >
                {child}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}

DropdownNew.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  id: PropTypes.string,
  toggleClass: PropTypes.string
};

export default DropdownNew;
