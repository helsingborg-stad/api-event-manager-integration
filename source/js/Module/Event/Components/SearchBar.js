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
        value={searchString}
        type="text"
        id="filter-keyword"
        className="form-control"
        onChange={updateSearchString}
        placeholder={translation.search}
      />
    </div>
  </div>
);
export default SearchBar;
