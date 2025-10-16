import PropTypes from 'prop-types';

function getDateBadge(event, type) {
  const date = new Date();
  const startDate = parseInt(event.start_date.substr(0, 4) + event.start_date.substr(5, 2) - 1 + event.start_date.substr(8, 2));
  const endDate = parseInt(event.end_date.substr(0, 4) + event.end_date.substr(5, 2) - 1 + event.end_date.substr(8, 2));
  const todaysDate = parseInt(date.getFullYear() + ("0" + (date.getMonth())).slice(-2) + ("0" + date.getDate()).slice(-2));
  const months = ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"];

  function getDate(date) {
    switch (type) {
      case "getDay":
        return date.toString().substr(6, 2);
      case "getMonth":
        return months[parseInt(date.toString().substr(4, 2))].substring(0,3);
    }
  }

  const notStarted = startDate > todaysDate;
  const finished = todaysDate > endDate;
  const eventDate = notStarted ? startDate : finished ? endDate : todaysDate;

  return getDate(eventDate);

}

const EventItem = ({ event, displayFields, cardStyle, imageRatio }) => (
  <a className={"c-card c-card--action c-card--event " + cardStyle + " c-card--ratio-" + imageRatio} href={event.permalink} style={{ textAlign: 'center', height: '100%' }}>
    {displayFields.includes('image') && event.image_url && (
      <div className="c-card__image-container">
        <figure className="c-image c-card__image c-image--cover">
            <img loading="lazy" className="c-image__image" src={event.image_url} alt={event.post_title}/>
        </figure>
      </div>
    )}

    {displayFields.includes('dateBadge') ? (
    <div class="c-datebadge c-datebadge--md u-position--absolute u-margin--2 u-level-2">
          <span class="c-typography c-datebadge__month">{getDateBadge(event, "getMonth")}</span>
          <span class="c-typography c-datebadge__date">{getDateBadge(event, "getDay")}</span>
    </div>) : ""}

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