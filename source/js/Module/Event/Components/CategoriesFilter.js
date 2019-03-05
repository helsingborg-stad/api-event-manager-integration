import { Dropdown } from 'hbg-react';

const CategoriesFilter = ({ translation, categories, onCategoryChange }) => (
    <div>
        <label htmlFor="filter-categories" className="text-sm sr-only">
            {translation.categories}
        </label>

        <Dropdown title={translation.categories} toggleClass="btn" id="filter-categories">
            {categories.map(item => (
                <label key={item.id} className="checkbox u-px-1">
                    <input
                        type="checkbox"
                        value={item.id}
                        onChange={e => onCategoryChange(e, item.id)}
                        checked={item.checked}
                    />{' '}
                    {item.title}
                </label>
            ))}
        </Dropdown>
    </div>
);
export default CategoriesFilter;
