import PropTypes from 'prop-types';
var today = new Date();

function getDateBadge(event, type) {
  let startDate = parseInt(event.start_date.substr(0, 4) + event.start_date.substr(5, 2) - 1 + event.start_date.substr(8, 2));
  let endDate = parseInt(event.end_date.substr(0, 4) + event.end_date.substr(5, 2) - 1 + event.end_date.substr(8, 2));
  let todaysDate = parseInt(today.getFullYear() + ("0" + (today.getMonth())).slice(-2) + ("0" + today.getDate()).slice(-2));
  let months = ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"];

  //get date formula
  function getDate (date, type) {
    switch(type) {
      case "getDay":
        return date.toString().substr(6,2);
      case "getMonth":
        return months[parseInt(date.toString().substr(4,2))];
    }
  }
  //event not started
  if (startDate > todaysDate) {
    switch(type) {
      case "day":
        return getDate(startDate, "getDay");
      case "month": 
        return getDate(startDate, "getMonth");
    }
  }
   //event finished
  else if (todaysDate > endDate) {
   switch(type) {
    case "day":
      return getDate(endDate, "getDay");
    case "month":
      return getDate(endDate, "getMonth");
   }
  } //event ongoing
  else {
    switch(type) {
      case "day":
        return getDate(todaysDate, "getDay"); 
      case "month":
        return getDate(todaysDate, "getMonth");
    }
  }
}

const EventItem = ({ event, displayFields }) => (
    <a className="c-card c-card--action" href={event.permalink} style={{textAlign: 'center', height: '100%'}}>
      {displayFields.includes('image') && event.image_url && (
        <div className="c-card__image c-card__image--secondary">
        {displayFields.includes('dateBadge') ? (<div class="c-datebadge c-datebadge--md u-position--absolute u-margin--2"><div class="c-datebadge__daymonth"><span class="c-typography c-datebadge__date c-typography__variant--h1">{getDateBadge(event, "day")}</span><span class="c-typography c-datebadge__month c-typography__variant--h4">{getDateBadge(event, "month").substr(0, 3)}</span></div></div>) : ""}
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
