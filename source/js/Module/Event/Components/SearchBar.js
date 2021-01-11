import PropTypes from 'prop-types';

const SearchBar = ({ searchString, translation, updateSearchString }) => (
  <div>
    <div className="c-field c-field--icon c-field--md c-field--radius-md c-field__text">
        <i className="c-icon c-icon--size-md material-icons">
          search
        </i>

        <input 
        id="filter-keyword"
        onChange={updateSearchString}
        placeholder={translation.search}
        type="text"
        value={searchString} />
        <label className="c-field__text--label">{translation.search}</label>
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
