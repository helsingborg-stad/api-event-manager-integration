import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import EventItem from './EventItem';

class EventList extends React.Component {
  render() {
    const { items, gridColumn, displayFields, dateBadge } = this.props;
    
    return (
      <div className="o-grid">
        {items.map(event => (
          <div className={`o-grid-12 o-grid-4@md`}>
              <EventItem
                key={uuidv4()}
                event={event}
                gridColumn={gridColumn}
                displayFields={displayFields}
                dateBadge={dateBadge}
                />
            </div>
        ))}
      </div>
    );
  }
}

EventList.propTypes = {
  displayFields: PropTypes.array,
  gridColumn: PropTypes.string,
  items: PropTypes.array.isRequired,
};

export default EventList;
