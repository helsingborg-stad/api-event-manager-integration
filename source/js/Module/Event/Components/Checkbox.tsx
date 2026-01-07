import React, { Component } from 'react';
import PropTypes from 'prop-types';

class CheckboxList extends Component {
  render() {
    const { title, items, onChange, checkedItems, id, className } = this.props;

    return (
      <div className={`checkbox-list ${className || ''}`} id={id}>
        {title && <h4>{title}</h4>}
        <ul>
          {items.map((item, idx) => (
            <li key={item.id || idx} style={{ padding: '4px 0' }}>
              <label>
                <input
                  type="checkbox"
                  value={item.id}
                  checked={!!checkedItems[item.id]}
                  onChange={e => onChange(e, item.id)}
                />
                {item.title}
              </label>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

CheckboxList.propTypes = {
  title: PropTypes.string,
  items: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  checkedItems: PropTypes.object,
  id: PropTypes.string,
  className: PropTypes.string,
};

export default CheckboxList;
