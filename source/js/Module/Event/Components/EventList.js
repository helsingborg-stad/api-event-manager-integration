import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import EventItem from './EventItem';

class EventList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: 0,
    };
    this.itemRefs = [];
    this.containerRef = React.createRef();
  }

  scrollToItem = (index) => {
    const itemNode = this.itemRefs[index];
    const container = this.containerRef.current;
    if (itemNode && container) {
      const scrollLeft = itemNode.offsetLeft - container.offsetLeft;
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  };

  handlePrev = () => {
    this.setState(
      prevState => ({ currentIndex: Math.max(prevState.currentIndex - 1, 0) }),
      () => this.scrollToItem(this.state.currentIndex)
    );
  };

  handleNext = () => {
    const { items } = this.props;
    this.setState(
      prevState => ({ currentIndex: Math.min(prevState.currentIndex + 1, items.length - 1) }),
      () => this.scrollToItem(this.state.currentIndex)
    );
  };

  render() {
    const { items, gridColumn, displayFields, cardStyle, imageRatio, mobileSlider, translation } = this.props;
    const { currentIndex } = this.state;
    this.itemRefs = [];
    return (
      <>
        {mobileSlider && 
          <ul>
            <li className="prev" aria-label={translation.prev}>
              <button onClick={this.handlePrev} disabled={currentIndex === 0}>&lt;</button>
            </li>
            <li className="next" aria-label={translation.next}>
              <button onClick={this.handleNext} disabled={currentIndex === items.length - 1}>&gt;</button>
            </li>
          </ul>
        }
        <div className="o-grid" ref={this.containerRef}>
          {items.map((event, idx) => (
            <div
              className={gridColumn ?? `o-grid-12 o-grid-4@md`}
              key={uuidv4()}
              ref={el => this.itemRefs[idx] = el}
            >
              <EventItem
                cardStyle={cardStyle}
                event={event}
                displayFields={displayFields}
                imageRatio={imageRatio}
              />
            </div>
          ))}
        </div>
      </>
    );
  }
}

EventList.propTypes = {
  displayFields: PropTypes.array,
  gridColumn: PropTypes.string,
  items: PropTypes.array.isRequired,
  mobileSlider: PropTypes.bool,
};

export default EventList;