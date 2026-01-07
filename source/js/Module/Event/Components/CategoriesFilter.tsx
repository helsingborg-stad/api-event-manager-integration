import CheckboxList from './Checkbox';
import PropTypes from 'prop-types';

const CategoriesFilter = ({ categories, onCategoryChange, title }) => {
	// Convert categories array to a checkedItems map
	const checkedItems = {};
	categories.forEach((c) => (checkedItems[c.id] = c.checked));

	return (
		<CheckboxList
			title={title}
			items={categories}
			onChange={onCategoryChange}
			checkedItems={checkedItems}
			id="filter-categories"
		/>
	);
};

CategoriesFilter.propTypes = {
	categories: PropTypes.array.isRequired,
	onCategoryChange: PropTypes.func.isRequired,
	title: PropTypes.string,
};

export default CategoriesFilter;
