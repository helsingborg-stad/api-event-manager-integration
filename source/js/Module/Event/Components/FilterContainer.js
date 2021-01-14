import { Button } from 'hbg-react';
import PropTypes from 'prop-types';
import AgeFilter from './AgeFilter';
import CategoriesFilter from './CategoriesFilter';
import DateFilter from './DateFilter';
import SearchBar from './SearchBar';

const FilterContainer = ({
  ageRange,
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
}) => (
  <form onSubmit={onSubmit}>
    <div className="o-grid">
      {settings.mod_event_filter_search && (
        <div className="o-grid-12 o-grid-auto@lg">
          <SearchBar
            translation={translation}
            searchString={searchString}
            updateSearchString={updateSearchString}
          />
        </div>
      )}

      {settings.mod_event_filter_dates && (
        <div className="o-grid-12@xs o-grid-6@md o-grid-auto@lg">
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
        <div className="o-grid-12@xs o-grid-6@md o-grid-auto@lg">
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
        <div className="o-grid-fit u-mb-2 u-mb-2@md u-mb-0@lg u-mb-0@xl">
          <AgeFilter translation={translation} ageRange={ageRange} onAgeChange={onAgeChange} />
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
            <span class="c-button__label">
              <span class="c-button__label-text">
              {translation.search}
              </span>
            </span>
        </button>
      </div>
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
