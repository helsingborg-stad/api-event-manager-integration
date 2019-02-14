import { getEvents } from '../../../Api/events';
import Card from '../Components/Card';
import { Pagination, PreLoader, Notice } from 'hbg-react';
import update from 'immutability-helper';

class Event extends React.Component {
    constructor() {
        super();
        this.state = {
            error: null,
            isLoaded: false,
            items: [],
        };
    }

    componentDidMount() {
        this.getEvents();
    }

    getEvents = () => {
        const { translation } = this.props;

        const restUrl =
            'https://single.local/wp-json/wp/v2/event/module?end_date=2019-12-30&per_page=20&page=1';

        getEvents(restUrl)
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
        const { translation } = this.props;

        if (error) {
            return (
                <div className="u-p-2">
                    <Notice type="warning" icon>
                        error message
                    </Notice>
                </div>
            );
        }

        if (!isLoaded) {
            return (
                <div className="gutter gutter-xl">
                    <PreLoader />
                </div>
            );
        }

        return items.map(event => (
            <div className="grid-xs-12 grid-md-4 u-flex" key={event.ID}>
                <Card event={event} />
            </div>
        ));
    }
}

export default Event;
