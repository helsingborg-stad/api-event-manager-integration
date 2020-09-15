import { Button, Notice, Pagination, PreLoader } from 'hbg-react';
import update from 'immutability-helper';
import PropTypes from 'prop-types';
import setQuery from 'set-query-string';
import { getEvents } from '../../../Api/events';
import EventList from './EventList';
import FilterContainer from './FilterContainer';

class FilterableEventsContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      age: null,
      ageRange: props.ageRange,
      categories: props.categories,
      currentPage: 1,
      endDate: props.endDate,
      error: null,
      isLoaded: false,
      items: [],
      searchString: '',
      startDate: props.startDate,
      tags: props.tags,
      totalPages: 1,
      translate: '',
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

   loadQueryString = () => {
    let parameters = {};
    let searchString = location.search.substr(1);
    let pairs = searchString.split("&");
    let parts;
    for(let i = 0; i < pairs.length; i++){
        parts = pairs[i].split("=");
        let name = parts[0];
        let data = decodeURI(parts[1]);
        parameters[name] = data;
    }
    return parameters;
  }
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
      translate,
    } = this.state;

    const categoryIds = this.getTaxonomyIds(categories);
    const tagIds = this.getTaxonomyIds(tags);
    const ageRangeIds = this.getTaxonomyIds(ageRange);
    const params = this.loadQueryString();
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
        translate,
      },
      { pushState: true }
    );
      if(params.translate){
        location.hash = "#translate";
      }

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
      distance,
      groups,
      lang,
      lat,
      lng,
      moduleId,
      nonce,
      restUrl,
      settings,
      translation,
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
      _wpnonce: nonce,
      age_group: ageGroup,
      categories,
      distance,
      end_date: endDate,
      groups,
      lang,
      lat,
      lng,
      module_id: moduleId,
      page: currentPage,
      per_page: perPage,
      search_string: searchString,
      start_date: startDate,
      tags,
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
      ageRange,
      categories,
      currentPage,
      endDate,
      error,
      isLoaded,
      items,
      searchString,
      startDate,
      tags,
      totalPages,
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
              ageRange={ageRange}
              categories={categories}
              endDate={endDate}
              formatDate={this.formatDate}
              fromDateChange={this.fromDateChange}
              onAgeChange={this.onAgeChange}
              onCategoryChange={this.onCategoryChange}
              onSubmit={this.onSubmit}
              onTagChange={this.onTagChange}
              searchString={searchString}
              settings={settings}
              startDate={startDate}
              tags={tags}
              toDateChange={this.toDateChange}
              translation={translation}
              updateSearchString={this.updateSearchString}
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
                input={this.paginationInput}
                langNext={translation.next}
                langPrev={translation.prev}
                next={this.nextPage}
                prev={this.prevPage}
                total={totalPages}
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
  groups: [],
  tags: [],
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
  {
    param: 'translate',
    type: 'string',
  },
];
