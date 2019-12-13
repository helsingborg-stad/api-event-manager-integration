import PropTypes from 'prop-types';
import { Pagination, PreLoader, Notice, Button } from 'hbg-react';
import setQuery from 'set-query-string';
import update from 'immutability-helper';
import EventList from './EventList';
import FilterContainer from './FilterContainer';
import { getEvents } from '../../../Api/events';

class FilterableEventsContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      currentPage: 1,
      totalPages: 1,
      searchString: '',
      age: null,
      startDate: props.startDate,
      endDate: props.endDate,
      categories: props.categories,
      tags: props.tags,
      ageRange: props.ageRange,
    };
  }

  componentDidMount() {
    this.collectUrlParams();
  }

  /**
   * Collect query string parameters and set to state
   */
  collectUrlParams = () => {
    const { categories, tags, ageRange } = this.state;
    const taxonomies = { categories, tags, ageRange };

    // Collect query string params
    const urlParams = new URLSearchParams(window.location.search);

    // Remove empty values and map param keys with values
    const parameterValues = availableQueryStringParams
      .filter(({ param }) => urlParams.get(param))
      .map(({ param, type }) => {
        let value;
        switch (type) {
          case 'int':
            value = parseInt(urlParams.get(param));
            break;
          case 'array':
            // Get all parameter values
            const queryStringArrayParameters = urlParams.getAll(param);
            // Type cast values to integers
            const checkedValues = queryStringArrayParameters.map(val => parseInt(val));
            // Set taxonomy to checked if it exist in query string
            value = taxonomies[param].map(taxonomy => {
              taxonomy.checked = checkedValues.includes(parseInt(taxonomy.id));
              return taxonomy;
            });
            break;
          default:
          value = urlParams.get(param);
        }

        return { param, type, value };
      });

    // Create an object holding state values
    const stateObj = parameterValues.reduce(
      (acc, curr) => ({ ...acc, [curr.param]: curr.value }),
      {}
    );

    // Set state and fetch events
    this.setState({ ...stateObj }, () => this.getEvents());
  };

  /**
   * Push state values to query string
   */
  setQueryString = () => {
    const {
      currentPage,
      searchString,
      startDate,
      endDate,
      categories,
      tags,
      ageRange,
    } = this.state;

    const categoryIds = this.getTaxonomyIds(categories);
    const tagIds = this.getTaxonomyIds(tags);
    const ageRangeIds = this.getTaxonomyIds(ageRange);

    // Set query parameters
    setQuery(
      {
        currentPage,
        searchString,
        startDate,
        endDate,
        categories: categoryIds,
        tags: tagIds,
        ageRange: ageRangeIds,
      },
      { pushState: true }
    );
  };

  /**
   * Return list of taxonomy IDs
   */
  getTaxonomyIds = taxonomies => {
    let taxonomyIds = [];

    if (!Array.isArray(taxonomies) && taxonomies.length) {
      return taxonomyIds;
    }

    const checkedValues = taxonomies.filter(tax => tax.checked);

    if (checkedValues.length) {
      taxonomyIds = checkedValues.reduce((acc, curr) => [...acc, curr.id], []);
    }

    return taxonomyIds;
  };

  /**
   * Fetch events from API endpoint
   */
  getEvents = () => {
    this.setState({ isLoaded: false, error: null });

    // Set query parameters from state
    this.setQueryString();

    // Declare states and props
    const { currentPage, searchString, startDate, endDate } = this.state;
    let { categories, tags, ageRange } = this.state;
    const {
      translation,
      restUrl,
      moduleId,
      settings,
      lat,
      lng,
      distance,
      groups,
      nonce,
      lang,
    } = this.props;
    const perPage = settings.mod_event_pagination ? settings.mod_event_per_page : -1;
    // Filter checked categories
    const checkedCategories = categories.filter(category => category.checked);
    if (
      checkedCategories.length > 0 ||
      (checkedCategories.length === 0 && settings.mod_event_categories_show === true)
    ) {
      categories = checkedCategories;
    }
    // Collect IDS
    categories = categories.map(category => category.id);

    // Filter checked tags
    const checkedTags = tags.filter(tag => tag.checked);

    if (
      checkedTags.length > 0 ||
      (checkedTags.length === 0 && settings.mod_event_tags_show === true)
    ) {
      tags = checkedTags;
    }
    // Collect IDS
    tags = tags.map(tag => tag.id);

    // Filter checked ages and return the values
    const ageGroup = ageRange.filter(age => age.checked).map(age => age.value);
    // The API base url
    const url = `${restUrl}wp/v2/event/module`;
    // Create list of query parameters
    const params = {
      start_date: startDate,
      end_date: endDate,
      per_page: perPage,
      page: currentPage,
      module_id: moduleId,
      lat,
      lng,
      distance,
      categories,
      tags,
      groups,
      age_group: ageGroup,
      search_string: searchString,
      lang,
      _wpnonce: nonce,
    };

    // Fetch events
    getEvents(url, params)
      .then(response => {
        this.setState({
          error: null,
          isLoaded: true,
          items: response.items,
          totalPages: response.totalPages,
        });
      })
      .catch(error => {
        console.error('Request failed:', error.message);
        this.setState({
          items: [],
          isLoaded: true,
          error: Error(translation.somethingWentWrong),
        });
      });
  };

  /**
   * Pagination next page handler
   */
  nextPage = () => {
    let { currentPage, totalPages } = this.state;
    if (currentPage === totalPages) {
      return;
    }
    currentPage += 1;
    this.setState({ currentPage }, () => this.getEvents());
  };

  /**
   * Pagination previous page handler
   */
  prevPage = () => {
    let { currentPage } = this.state;
    if (currentPage <= 1) {
      return;
    }

    currentPage -= 1;
    this.setState({ currentPage }, () => this.getEvents());
  };

  /**
   * Pagination input page number handler
   * @param e
   */
  paginationInput = e => {
    const { totalPages } = this.state;
    let currentPage = e.target.value ? parseInt(e.target.value) : '';
    currentPage = currentPage > totalPages ? totalPages : currentPage;

    this.setState({ currentPage }, () => {
      if (currentPage) {
        this.getEvents();
      }
    });
  };

  /**
   * Search string change handler
   * @param e
   */
  updateSearchString = e => {
    this.setState({
      searchString: e.target.value,
    });
  };

  /**
   * Submit form handler
   * @param e
   */
  onSubmit = e => {
    e.preventDefault();
    this.setState({ currentPage: 1 }, () => this.getEvents());
  };

  /**
   * From date change handler
   * @param date
   */
  fromDateChange = date => {
    this.setState({ startDate: this.formatDate(date) });
  };

  /**
   * To date change handler
   * @param date
   */
  toDateChange = date => {
    this.setState({ endDate: this.formatDate(date) });
  };

  /**
   * Format date (Y-m-d)
   * @param date
   * @returns {string}
   */
  formatDate = date => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return date.toLocaleDateString('sv-SE', options);
  };

  /**
   * Handle categories checkbox changes
   * @param id
   */
  onCategoryChange = (e, id) => {
    const { categories } = this.state;
    // Get the index
    const index = categories.findIndex(obj => obj.id === id);
    // Update state
    this.setState(
      update(this.state, {
        categories: {
          [index]: {
            checked: { $set: !categories[index].checked },
          },
        },
      })
    );
  };

  /**
   * Handle categories checkbox changes
   * @param id
   */
  onTagChange = (e, id) => {
    const { tags } = this.state;
    // Get the index
    const index = tags.findIndex(obj => obj.id === id);
    // Update state
    this.setState(
      update(this.state, {
        tags: {
          [index]: {
            checked: { $set: !tags[index].checked },
          },
        },
      })
    );
  };

  /**
   * Handle age range checkbox changes
   * @param id
   */
  onAgeChange = (e, id) => {
    const { ageRange } = this.state;
    // Get the index
    const index = ageRange.findIndex(obj => obj.value === id);
    // Update state
    this.setState(
      update(this.state, {
        ageRange: {
          [index]: {
            checked: { $set: !ageRange[index].checked },
          },
        },
      })
    );
  };

  render() {
    const {
      error,
      isLoaded,
      items,
      currentPage,
      totalPages,
      categories,
      tags,
      ageRange,
      searchString,
      startDate,
      endDate,
    } = this.state;
    const { settings, translation, gridColumn, archiveUrl } = this.props;

    return (
      <div>
        {(settings.mod_event_filter_search ||
          settings.mod_event_filter_dates ||
          settings.mod_event_filter_age_group ||
          settings.mod_event_filter_tags ||
          settings.mod_event_filter_categories) && (
          <div className="u-mb-3">
            <FilterContainer
              settings={settings}
              translation={translation}
              searchString={searchString}
              updateSearchString={this.updateSearchString}
              onSubmit={this.onSubmit}
              fromDateChange={this.fromDateChange}
              toDateChange={this.toDateChange}
              startDate={startDate}
              endDate={endDate}
              formatDate={this.formatDate}
              categories={categories}
              tags={tags}
              onCategoryChange={this.onCategoryChange}
              onTagChange={this.onTagChange}
              ageRange={ageRange}
              onAgeChange={this.onAgeChange}
            />
          </div>
        )}

        {!isLoaded && (
          <div className="u-pt-5 u-pb-8">
            <PreLoader />
          </div>
        )}

        {(error || (isLoaded && items.length === 0)) && (
          <div className="u-mb-3">
            <Notice type="info">{translation.noEventsFound}</Notice>
          </div>
        )}

        {isLoaded && items.length > 0 && (
          <div className="grid grid--columns">
            <EventList
              items={items}
              gridColumn={gridColumn}
              displayFields={settings.mod_event_fields}
            />
          </div>
        )}

        <div className="grid">
          {settings.mod_event_archive && (
            <div className="grid-xs-12 grid-md-auto u-mb-2 u-mb-2@md u-mb-0@lg u-mb-0@xl">
              <Button href={archiveUrl} color="primary" title={translation.moreEvents} />
            </div>
          )}
          {settings.mod_event_pagination && (
            <div className="grid-xs-12 grid-md-fit-content u-ml-auto modularity-mod-event__pagination">
              <Pagination
                current={currentPage}
                total={totalPages}
                next={this.nextPage}
                prev={this.prevPage}
                input={this.paginationInput}
                langPrev={translation.prev}
                langNext={translation.next}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

FilterableEventsContainer.propTypes = {
  ageRange: PropTypes.array,
  archiveUrl: PropTypes.string,
  categories: PropTypes.array,
  distance: PropTypes.string,
  endDate: PropTypes.string.isRequired,
  gridColumn: PropTypes.string,
  groups: PropTypes.array,
  lang: PropTypes.string,
  lat: PropTypes.string,
  lng: PropTypes.string,
  moduleId: PropTypes.string.isRequired,
  nonce: PropTypes.string.isRequired,
  restUrl: PropTypes.string.isRequired,
  settings: PropTypes.object.isRequired,
  startDate: PropTypes.string.isRequired,
  tags: PropTypes.array,
  translation: PropTypes.object,
};

FilterableEventsContainer.defaultProps = {
  ageRange: [],
  categories: [],
  tags: [],
  groups: [],
};

export default FilterableEventsContainer;

const availableQueryStringParams = [
  {
    param: 'currentPage',
    type: 'int',
  },
  {
    param: 'searchString',
    type: 'string',
  },
  {
    param: 'ageRange',
    type: 'array',
  },
  {
    param: 'startDate',
    type: 'string',
  },
  {
    param: 'endDate',
    type: 'string',
  },
  {
    param: 'categories',
    type: 'array',
  },
  {
    param: 'tags',
    type: 'array',
  },
];
