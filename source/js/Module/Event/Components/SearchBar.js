import PropTypes from 'prop-types';

const SearchBar = ({ searchString, translation, updateSearchString }) => (
  <div>
    <label htmlFor="filter-keyword" className="text-sm sr-only">
      <strong>{translation.search}</strong>
    </label>

    <div className="input-group">
      <span className="input-group-addon">
        <i className="fa fa-search" />
      </span>
      <input
        className="form-control"
        id="filter-keyword"
        onChange={updateSearchString}
        placeholder={translation.search}
        type="text"
        value={searchString}
      />
    </div>
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
