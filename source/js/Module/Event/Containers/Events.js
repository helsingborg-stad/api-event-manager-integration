import uuidv1 from 'uuid/v1';
import { Pagination, PreLoader, Notice } from 'hbg-react';
import Card from '../Components/Card';
import Filters from '../Components/Filters';
import { getEvents } from '../../../Api/events';

class Event extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: [],
            currentPage: 1,
            totalPages: 1,
            searchString: '',
            startDate: props.startDate,
            endDate: props.endDate,
        };
    }

    componentDidMount() {
        this.getEvents();
    }

    /**
     * Fetch events from API endpoint
     */
    getEvents = () => {
        this.setState({ isLoaded: false, error: null });
        // Declare states and props
        const { currentPage, searchString, startDate, endDate } = this.state;
        const {
            translation,
            restUrl,
            moduleId,
            settings,
            lat,
            lng,
            distance,
            categories,
            tags,
            groups,
        } = this.props;
        const perPage = settings.mod_event_pagination ? settings.mod_event_per_page : -1;
        // Concatenate all taxonomies together
        const taxonomies = categories.concat(tags, groups);
        // The API base url
        const url = `${restUrl}wp/v2/event/module`;
        // Create list of filterable parameters
        const params = {
            start_date: startDate,
            end_date: endDate,
            per_page: perPage,
            page: currentPage,
            module_id: moduleId,
            lat: lat,
            lng: lng,
            distance: distance,
            taxonomies: taxonomies,
            search_string: searchString,
        };

        console.log('Start');
        console.log(startDate);
        console.log('End');
        console.log(endDate);

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
        console.log('Change from date');
        this.setState({ startDate: this.formatDate(date) });
    };

    /**
     * To date change handler
     * @param date
     */
    toDateChange = date => {
        console.log('Change To date');
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

    render() {
        const { error, isLoaded, items, currentPage, totalPages } = this.state;
        const { settings, translation, gridColumn, archiveUrl } = this.props;

        return (
            <div>
                <div className="u-mb-3">
                    <Filters
                        translation={translation}
                        updateSearchString={this.updateSearchString}
                        onSubmit={this.onSubmit}
                        fromDateChange={this.fromDateChange}
                        toDateChange={this.toDateChange}
                        formatDate={this.formatDate}
                    />
                </div>

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
                        {items.map(event => (
                            <div className={`u-flex ${gridColumn}`} key={uuidv1()}>
                                <Card event={event} settings={settings} />
                            </div>
                        ))}
                    </div>
                )}

                <div className="grid">
                    {settings.mod_event_archive && (
                        <div className="grid-xs-12 grid-md-auto">
                            <a className="btn btn-primary" href={archiveUrl}>
                                {translation.moreEvents}
                            </a>
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

export default Event;
