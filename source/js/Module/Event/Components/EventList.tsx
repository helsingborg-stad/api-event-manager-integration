import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@helsingborg-stad/hbg-react';
import EventItem from './EventItem';

class EventList extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			currentIndex: 0,
		};
		this.itemRefs = [];
		this.containerRef = React.createRef();
		this.uniqueId = `event-list-${uuidv4()}`;
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
			(prevState) => ({ currentIndex: Math.max(prevState.currentIndex - 1, 0) }),
			() => this.scrollToItem(this.state.currentIndex),
		);
	};

	handleNext = () => {
		const { items } = this.props;

		this.setState(
			(prevState) => ({ currentIndex: Math.min(prevState.currentIndex + 1, items.length - 1) }),
			() => this.scrollToItem(this.state.currentIndex),
		);
	};

	render() {
		const { items, gridColumn, displayFields, cardStyle, imageRatio, mobileSlider, translation } = this.props;
		const { currentIndex } = this.state;
		this.itemRefs = [];

		// TODO: Update to use Button component from @helsingborg-stad/hbg-react
		// This however doesn't align with the current HTML structure for icons etc
		// And doesn't support passing of HTML properties
		return (
			<>
				{mobileSlider && (
					<nav className="modularity-event-index__mobile-scroll-nav" aria-controls={this.uniqueId}>
						<button
							className="c-button c-button__filled c-button--sm c-button__filled--primary c-button--pill"
							onClick={this.handlePrev}
							aria-label={translation.prev}
							disabled={currentIndex === 0}
						>
							<span className="c-button__label">
								<span
									className="c-icon c-icon--keyboard-arrow-left c-icon--material c-icon--material-keyboard_arrow_left material-symbols material-symbols-rounded material-symbols-sharp material-symbols-outlined  c-icon--size-md"
									aria-hidden="true"
									data-material-symbol="keyboard_arrow_left "
									role="img"
									data-nosnippet=""
									translate="no"
								></span>
							</span>
						</button>
						<button
							className="c-button c-button__filled c-button--sm c-button__filled--primary c-button--pill"
							onClick={this.handleNext}
							aria-label={translation.next}
							disabled={currentIndex === items.length - 1}
						>
							<span className="c-button__label">
								<span
									class="c-icon c-icon--keyboard-arrow-right c-icon--material c-icon--material-keyboard_arrow_right material-symbols material-symbols-rounded material-symbols-sharp material-symbols-outlined  c-icon--size-md"
									aria-hidden="true"
									data-material-symbol="keyboard_arrow_right"
									role="img"
									data-nosnippet=""
									translate="no"
								></span>
							</span>
						</button>
					</nav>
				)}
				<div id={this.uniqueId} className="o-grid" ref={this.containerRef}>
					{items.map((event, idx) => (
						<div
							className={gridColumn ?? `o-grid-12 o-grid-4@md`}
							key={uuidv4()}
							ref={(el) => (this.itemRefs[idx] = el)}
						>
							<EventItem cardStyle={cardStyle} event={event} displayFields={displayFields} imageRatio={imageRatio} />
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
