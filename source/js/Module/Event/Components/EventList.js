import PropTypes from 'prop-types';
import uuidv1 from 'uuid/v1';
import EventItem from './EventItem';

class EventList extends React.Component {
  /**
   * Prevent component from re-rendering
   * @param nextProps
   * @param nextState
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  render() {
    const { items, gridColumn, displayFields } = this.props;
    return items.map(event => (
      <EventItem
        key={uuidv1()}
        event={event}
        gridColumn={gridColumn}
        displayFields={displayFields}
      />
    ));
  }
}

EventList.propTypes = {
  displayFields: PropTypes.array,
  gridColumn: PropTypes.string,
  items: PropTypes.array.isRequired,
};

export default EventList;
