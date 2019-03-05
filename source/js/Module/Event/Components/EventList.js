import uuidv1 from 'uuid/v1';
import EventItem from './EventItem';

const EventList = ({ items, gridColumn, displayFields }) =>
    items.map(event => (
        <EventItem
            key={uuidv1()}
            event={event}
            gridColumn={gridColumn}
            displayFields={displayFields}
        />
    ));

export default EventList;
