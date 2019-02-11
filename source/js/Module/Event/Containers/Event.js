import { Pagination, PreLoader, Notice } from 'hbg-react';
import update from 'immutability-helper';

class Event extends React.Component {
    constructor() {
        super();
        this.state = {
            error: null,
        };
    }

    render() {
        const { error } = this.state;
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

        return <div className="grid">stuff</div>;
    }
}

export default Event;
