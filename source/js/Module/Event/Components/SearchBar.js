import PropTypes from 'prop-types';
import { Input, Button } from 'hbg-react';
const SearchBar = ({ searchString, translation, updateSearchString }) => (
  <div>
      <Input
        className="form-control"
        id="filter-keyword"
        handleChange={updateSearchString}
        label={translation.search}
        type="text"
        value={searchString}
        icon='search'
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
