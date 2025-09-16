import DropdownNew from './Dropdown';
import PropTypes from 'prop-types';

const CategoriesFilter = ({ categories, onCategoryChange, title }) => (
    <DropdownNew title={title} id="filter-categories">
      {categories.map(item => (
        <div key={item.id} style={{ maxWidth: '250px', width: 'max-content' }}>
          <label className="checkbox u-px-1">
            <input
              type="checkbox"
              value={item.id}
              onChange={e => onCategoryChange(e, item.id)}
              checked={item.checked}
            />{' '}
            {item.title}
          </label>
        </div>
      ))}
    </DropdownNew>
);

CategoriesFilter.propTypes = {
  categories: PropTypes.array.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  title: PropTypes.string,
};

export default CategoriesFilter;
