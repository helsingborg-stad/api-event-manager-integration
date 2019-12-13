import { Dropdown } from 'hbg-react';

const AgeFilter = ({ translation, ageRange, onAgeChange }) => (
  <div>
    <label htmlFor="filter-categories" className="text-sm sr-only">
      {translation.selectAge}
    </label>
    <Dropdown title={translation.selectAge} toggleClass="btn">
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
export default AgeFilter;
