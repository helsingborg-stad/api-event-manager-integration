import PropTypes from 'prop-types';
var today = new Date();

function getDateBadge(event, type) {
  console.log(event);
  let todaysMonth = parseInt(("0"+(today.getMonth())).slice(-2));
  let startMonth = parseInt(event.start_date.substr(5,2))-1;
  let endMonth = parseInt(event.end_date.substr(5,2))-1;
  let months = ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"];
  let todaysDay = parseInt(("0" + today.getDate()).slice(-2));
  let startDay = parseInt(event.start_date.substr(8, 2));
  let endDay = parseInt(event.end_date.substr(8, 2));

  //not started
  if (startMonth > todaysMonth || (startMonth === todaysMonth && todaysDay < startDay)) {
    switch(type) {
      case "day":
        return startDay;
      case "month": 
        return months[startMonth];
    }
  } //finished
  else if (endMonth < todaysMonth || (endMonth === todaysMonth && todaysDay > endDay)) {
   switch(type) {
    case "day":
      return endDay;
    case "month":
      return months[endMonth];
   }
  } //ongoing
  else {
    switch(type) {
      case "day":
        return todaysDay;
      case "month":
        return months[todaysMonth];
    }
  }
}

const EventItem = ({ event, gridColumn, displayFields, dateBadge }) => (
    <a className="c-card c-card--action" href={event.permalink} style={{textAlign: 'center', height: '100%'}}>
      {displayFields.includes('image') && event.image_url && (
        <div className="c-card__image c-card__image--secondary">
        {dateBadge ? (<div class="c-datebadge c-datebadge--md u-position--absolute u-margin--2"><div class="c-datebadge__daymonth"><span class="c-typography c-datebadge__date c-typography__variant--h1">{getDateBadge(event, "day")}</span><span class="c-typography c-datebadge__month c-typography__variant--h4">{getDateBadge(event, "month").substr(0,3)}</span></div></div>) : ""}
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
