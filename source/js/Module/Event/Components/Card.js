const Card = ({ event }) => (
    <a className="c-card c-card--action u-text-center" href="">
        <img className="c-card__image" src="" alt="" />

        <div className="c-card__body">
            <div className="c-card__time u-mb-2">
                <time>2019-01-01</time>
            </div>

            <h4 className="c-card__title">{event.post_title}</h4>

            <span className="c-card__sub o-text-small">Location here</span>
        </div>
    </a>
);

export default Card;
