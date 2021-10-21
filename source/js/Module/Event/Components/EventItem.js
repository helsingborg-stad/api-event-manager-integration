import PropTypes from 'prop-types';

const EventItem = ({ event, gridColumn, displayFields }) => (
    <a className="c-card c-card--action" href={event.permalink} style={{textAlign: 'center', height: '100%'}}>
      {displayFields.includes('image') && event.image_url && (
        <div className="c-card__image c-card__image--secondary">
          <div className="c-card__image-background" style={{backgroundImage: `url('${event.image_url}')`}}></div>
        </div>
      )}

      <div className="c-card__body">
        {event.post_title && <h3 className="c-card__title">{event.post_title}</h3>}

        {displayFields.includes('occasion') && event.occasion && (
          <span className="c-card__time">
            <time>{event.occasion}</time>
          </span>
        )}

        {displayFields.includes('location') && event.location && (
          <div>
            <i class="u-text-small">{event.location}</i>
          </div>
        )}
      </div>
    </a>
);

EventItem.propTypes = {
  displayFields: PropTypes.array,
  event: PropTypes.object.isRequired,
  gridColumn: PropTypes.string,
};

EventItem.defaultProps = {
  displayFields: [],
  gridColumn: '',
};

export default EventItem;
