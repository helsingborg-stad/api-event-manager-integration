const Card = ({ settings, event }) => (
    <a className="c-card c-card--action u-text-center" href={event.permalink}>
        {settings.mod_event_fields.includes('image') && event.image_url && (
            <img className="c-card__image" src={event.image_url} alt={event.post_title} />
        )}

        <div className="c-card__body">
            {settings.mod_event_fields.includes('occasion') && event.occasion && (
                <div className="c-card__time u-mb-2">
                    <time>{event.occasion}</time>
                </div>
            )}

            {event.post_title && <h4 className="c-card__title">{event.post_title}</h4>}

            {settings.mod_event_fields.includes('location') && event.location && (
                <span className="c-card__sub o-text-small">{event.location}</span>
            )}
        </div>
    </a>
);

export default Card;
