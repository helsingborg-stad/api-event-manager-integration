import { Button } from 'hbg-react';
import SearchBar from './SearchBar';
import DateFilter from './DateFilter';
import AgeFilter from './AgeFilter';
import CategoriesFilter from './CategoriesFilter';

const FilterContainer = ({
    settings,
    translation,
    updateSearchString,
    onSubmit,
    fromDateChange,
    toDateChange,
    formatDate,
    categories,
    onCategoryChange,
    ageRange,
    onAgeChange,
}) => (
    <form onSubmit={onSubmit}>
        <div className="grid">
            {settings.mod_event_filter_search && (
                <div className="grid-md-12 grid-lg-auto u-mb-2 u-mb-2@md u-mb-0@lg u-mb-0@xl">
                    <SearchBar translation={translation} updateSearchString={updateSearchString} />
                </div>
            )}

            {settings.mod_event_filter_dates && (
                <div className="grid-sm-12 grid-md-6 grid-lg-auto u-mb-2 u-mb-2@md u-mb-0@lg u-mb-0@xl">
                    <DateFilter
                        id="filter-date-from"
                        label={`${translation.from} ${translation.date}`}
                        onDayChange={fromDateChange}
                        formatDate={formatDate}
                    />
                </div>
            )}

            {settings.mod_event_filter_dates && (
                <div className="grid-sm-12 grid-md-6 grid-lg-auto u-mb-2 u-mb-2@md u-mb-0@lg u-mb-0@xl">
                    <DateFilter
                        id="filter-date-to"
                        label={`${translation.to} ${translation.date}`}
                        onDayChange={toDateChange}
                        formatDate={formatDate}
                    />
                </div>
            )}

            {settings.mod_event_filter_age_group && ageRange.length > 0 && (
                <div className="grid-fit-content u-mb-2 u-mb-2@md u-mb-0@lg u-mb-0@xl">
                    <AgeFilter
                        translation={translation}
                        ageRange={ageRange}
                        onAgeChange={onAgeChange}
                    />
                </div>
            )}

            {settings.mod_event_filter_categories && categories.length > 0 && (
                <div className="grid-fit-content u-mr-auto u-mb-2 u-mb-2@md u-mb-0@lg u-mb-0@xl">
                    <CategoriesFilter
                        translation={translation}
                        categories={categories}
                        onCategoryChange={onCategoryChange}
                    />
                </div>
            )}

            <div className="grid-fit-content">
                <Button title={translation.search} color="primary" submit />
            </div>
        </div>
    </form>
);

export default FilterContainer;
