import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import EventItem from './EventItem';

class EventList extends React.Component {
  render() {
    const { items, gridColumn, displayFields, cardStyle, imageRatio } = this.props;
    return (
      <div className="o-grid">
        {items.map(event => (
          <div className={gridColumn ?? `o-grid-12 o-grid-4@md`}>
            <EventItem
              cardStyle={cardStyle}
              key={uuidv4()}
              event={event}
              displayFields={displayFields}
              imageRatio={imageRatio}
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