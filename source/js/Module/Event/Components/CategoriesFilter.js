import { Dropdown } from 'hbg-react';

const CategoriesFilter = ({ categories, onCategoryChange, title }) => (
    <div>
        <label htmlFor="filter-categories" className="text-sm sr-only">
            {title}
        </label>

        <Dropdown title={title} toggleClass="btn" id="filter-categories">
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
        </Dropdown>
    </div>
);
export default CategoriesFilter;
