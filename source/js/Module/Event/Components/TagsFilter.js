import { Dropdown } from 'hbg-react';

const TagFilter = ({ translation, tags, onTagChange }) => (
    <div>
        <label htmlFor="filter-categories" className="text-sm sr-only">
            {translation.categories}
        </label>

        <Dropdown title={translation.tags} toggleClass="btn" id="filter-tags">
            {tags.map(item => (
                <label key={item.id} className="checkbox u-px-1">
                    <input
                        type="checkbox"
                        value={item.id}
                        onChange={e => onTagChange(e, item.id)}
                        checked={item.checked}
                    />{' '}
                    {item.title}
                </label>
            ))}
        </Dropdown>
    </div>
);
export default TagFilter;
