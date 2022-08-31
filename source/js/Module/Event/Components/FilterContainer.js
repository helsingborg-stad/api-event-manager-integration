import PropTypes from 'prop-types';
import AgeFilter from './AgeFilter';
import CategoriesFilter from './CategoriesFilter';
import DateFilter from './DateFilter';
import SearchBar from './SearchBar';

const FilterContainer = ({
  ageRange,
  ageRangeFilter,

  minValue,
  maxValue,
  onAgeRangeChange,

  categories,
  endDate,
  formatDate,
  fromDateChange,
  onAgeChange,
  onCategoryChange,
  onSubmit,
  onTagChange,
  searchString,
  settings,
  startDate,
  tags,
  toDateChange,
  translation,
  updateSearchString,
  resetButton,
  resetButtonUrl,
}) => (
  <form onSubmit={onSubmit}>
    <div className="o-grid">
      {settings.mod_event_filter_search && (
        <div className="o-grid-12 o-grid">
          <SearchBar
            translation={translation}
            searchString={searchString}
            updateSearchString={updateSearchString}
          />
        </div>
      )}

      {settings.mod_event_filter_dates && (
        <div className="o-grid-12@xs o-grid-6@md">
          <DateFilter
            id="filter-date-from"
            label={`${translation.from} ${translation.date}`}
            onDayChange={fromDateChange}
            formatDate={formatDate}
            value={startDate}
          />
        </div>
      )}

      {settings.mod_event_filter_dates && (
        <div className="o-grid-12@xs o-grid-6@md o-grid">
          <DateFilter
            id="filter-date-to"
            label={`${translation.to} ${translation.date}`}
            onDayChange={toDateChange}
            formatDate={formatDate}
            value={endDate}
          />
        </div>
      )}

      {settings.mod_event_filter_age_group && ageRange.length > 0 && (
        <div className="o-grid-12@xs o-grid-4@md o-grid-4@lg">
          <AgeFilter 
            translation={translation} 
            onChange={onAgeRangeChange}
            minValue={ageRangeFilter.min}
            maxValue={ageRangeFilter.max}
            minLimit={ageRange[0].id}
            maxLimit={ageRange.slice(-1)[0].id}
          />
        </div>
      )}

      {settings.mod_event_filter_categories && categories.length > 0 && (
        <div className="o-grid-fit">
          <CategoriesFilter
            title={translation.categories}
            categories={categories}
            onCategoryChange={onCategoryChange}
          />
        </div>
      )}

      {settings.mod_event_filter_tags && tags.length > 0 && (
        <div className="o-grid-fit">
          <CategoriesFilter
            title={translation.tags}
            categories={tags}
            onCategoryChange={onTagChange}
          />
        </div>
      )}

      <div className="o-grid-fit">
        <button
          className="c-button c-button__filled c-button__filled--primary c-button--md ripple ripple--before"
          aria-pressed="false"
          type="submit"
          title={translation.search}>
          <span className="c-button__label">
            <span className="c-button__label-text">
              {translation.search}
            </span>
          </span>
        </button>
      </div>

      {resetButton && (
        <div className="o-grid-fit">
          <a
            className="c-button c-button__filled c-button__filled--default c-button--md ripple ripple--before"
            href={resetButtonUrl}>
            <span className="c-button__label">
              <span className="c-button__label-text">
                {translation.resetFilters}
              </span>
            </span>
          </a>
        </div>
      )}
    </div>
  </form>
);

FilterContainer.propTypes = {
  ageRange: PropTypes.array,
  categories: PropTypes.array,
  endDate: PropTypes.string,
  formatDate: PropTypes.func,
  fromDateChange: PropTypes.func,
  onAgeChange: PropTypes.func,
  onCategoryChange: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  onTagChange: PropTypes.func,
  searchString: PropTypes.string,
  settings: PropTypes.object.isRequired,
  startDate: PropTypes.string,
  tags: PropTypes.array,
  toDateChange: PropTypes.func,
  translation: PropTypes.object.isRequired,
  updateSearchString: PropTypes.func,
};

FilterContainer.defaultProps = {
  ageRange: [],
  categories: [],
  tags: [],
};

export default FilterContainer;