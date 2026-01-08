import PropTypes from 'prop-types';
import { Input, Button } from '@helsingborg-stad/hbg-react';
import React from 'react';

const SearchBar = ({ searchString, translation, updateSearchString }) => (
	<div>
		<Input
			className="form-control"
			id="filter-keyword"
			handleChange={updateSearchString}
			label={translation.search}
			type="search"
			value={searchString}
			icon_suffix="search"
		/>
	</div>
);

SearchBar.propTypes = {
	searchString: PropTypes.string,
	translation: PropTypes.object,
	updateSearchString: PropTypes.func,
};

SearchBar.defaultProps = {
	translation: {},
};

export default SearchBar;
