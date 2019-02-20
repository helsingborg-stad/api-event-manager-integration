import uuidv1 from 'uuid/v1';
import { Pagination, PreLoader, Notice } from 'hbg-react';
import Card from '../Components/Card';
import SearchForm from '../Components/SearchForm';
import { getEvents } from '../../../Api/events';

class Event extends React.Component {
    constructor() {
        super();
        this.state = {
            error: null,
            isLoaded: false,
            items: [],
            currentPage: 1,
            totalPages: 1,
            searchString: '',
        };
    }

    componentDidMount() {
        this.getEvents();
    }

    getEvents = () => {
        this.setState({ isLoaded: false, error: null });

        const { currentPage, searchString } = this.state;
        const {
            translation,
            restUrl,
            moduleId,
            settings,
            endDate,
            lat,
            lng,
            distance,
            categories,
            tags,
            groups,
        } = this.props;
        const perPage = settings.mod_event_pagination ? settings.mod_event_per_page : -1;
        const taxonomies = categories.concat(tags, groups);
        const url = `${restUrl}wp/v2/event/module`;
        const params = {
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

    nextPage = () => {
        let { currentPage, totalPages } = this.state;
        if (currentPage === totalPages) {
            return;
        }
        currentPage += 1;
        this.setState({ currentPage }, () => this.getEvents());
    };

    prevPage = () => {
        let { currentPage } = this.state;
        if (currentPage <= 1) {
            return;
        }
        currentPage -= 1;
        this.setState({ currentPage }, () => this.getEvents());
    };

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

    updateSearchString = e => {
        this.setState({
            searchString: e.target.value,
        });
    };

    onSearchSubmit = e => {
        e.preventDefault();
        this.setState({ currentPage: 1 }, () => this.getEvents());
    };

    render() {
        const { error, isLoaded, items, currentPage, totalPages } = this.state;
        const { settings, translation, gridColumn, archiveUrl } = this.props;

        return (
            <div>
                <div className="grid u-mb-3">
                    <div className="grid-xs-12 grid-md-auto u-mb-2 u-mb-0@md u-mb-0@lg u-mb-0@xl">
                        <SearchForm
                            translation={translation}
                            searchString={this.updateSearchString}
                            searchSubmit={this.onSearchSubmit}
                        />
                    </div>
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
