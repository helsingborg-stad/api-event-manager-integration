import { Dropdown } from '@helsingborg-stad/hbg-react';
import PropTypes from 'prop-types';

const AgeFilter = ({ translation, ageRange, onAgeChange }) => (
  <div>
    <Dropdown title={translation.selectAge}>
      {ageRange.map(item => (
        <label key={item.value} className="checkbox u-px-1">
          <input
            type="checkbox"
            value={item.value}
            onChange={e => onAgeChange(e, item.value)}
            checked={item.checked}
          />{' '}
          {item.value} {translation.years}
        </label>
      ))}
    </Dropdown>
  </div>
);

AgeFilter.propTypes = {
  ageRange: PropTypes.array.isRequired,
  onAgeChange: PropTypes.func.isRequired,
  translation: PropTypes.object,
};

AgeFilter.defaultProps = {
  translation: {},
};

export default AgeFilter;
