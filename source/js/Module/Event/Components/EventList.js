import PropTypes from 'prop-types';
import uuidv1 from 'uuid/v1';
import EventItem from './EventItem';

class EventList extends React.Component {
  render() {
    const { items, gridColumn, displayFields } = this.props;
    return (
      <div className="o-grid">
        {items.map(event => (
          <div className={`o-grid-12 o-grid-4@md`}>
              <EventItem
                key={uuidv1()}
                event={event}
                gridColumn={gridColumn}
                displayFields={displayFields}
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
