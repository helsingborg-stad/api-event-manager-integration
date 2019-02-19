import uuidv1 from 'uuid/v1';
import { Pagination, PreLoader, Notice } from 'hbg-react';
import update from 'immutability-helper';
import Card from '../Components/Card';
import { getEvents } from '../../../Api/events';

class Event extends React.Component {
    constructor() {
        super();
        this.state = {
            page: 1,
            error: null,
            isLoaded: false,
            items: [],
        };
    }

    componentDidMount() {
        this.getEvents();
    }

    getEvents = () => {
        const { page } = this.state;
        const {
            translation,
            restUrl,
            moduleId,
            settings,
            endDate,
            lat,
            lng,
            distance,
        } = this.props;
        const perPage = settings.mod_event_pagination ? settings.mod_event_per_page : -1;

        const url = `${restUrl}wp/v2/event/module`;
        const params = {
            end_date: endDate,
            per_page: perPage,
            page: page,
            module_id: moduleId,
            lat: lat,
            lng: lng,
            distance: distance,
        };

        getEvents(url, params)
            .then(response => {
                console.log(response);
                this.setState({
                    isLoaded: true,
                    items: response,
                });
            })
            .catch(error => {
                console.error('Request failed:', error.message);
                this.setState({ isLoaded: true, error: Error(translation.somethingWentWrong) });
            });
    };

    render() {
        const { error, isLoaded, items } = this.state;
        const { settings, translation, gridColumn, archiveUrl } = this.props;

        if (error) {
            return (
                <Notice type="warning" icon>
                    TODO error message here
                </Notice>
            );
        }

        if (!isLoaded) {
            return (
                <div className="gutter">
                    <PreLoader />
                </div>
            );
        }

        if (items.count === 0) {
            return <div className="gutter">{translation.noEventsFound}</div>;
        }

        return (
            <div>
                <div className="grid grid--columns">
                    {items.map(event => (
                        <div className={`u-flex ${gridColumn}`} key={uuidv1()}>
                            <Card event={event} settings={settings} />
                        </div>
                    ))}
                </div>
                {settings.mod_event_archive && (
                    <div className="grid-xs-12 u-text-center">
                        <a className="btn btn-primary" href={archiveUrl}>
                            {translation.moreEvents}
                        </a>
                    </div>
                )}
            </div>
        );
    }
}

export default Event;
