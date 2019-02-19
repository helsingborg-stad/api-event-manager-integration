import Event from './Containers/Events';

const domElements = document.getElementsByClassName('modularity-event-index');
const translation = modEvent;

for (let i = 0; i < domElements.length; i++) {
    const element = domElements[i];
    const {
        moduleId,
        settings,
        restUrl,
        gridColumn,
        archiveUrl,
        endDate,
        lat,
        lng,
        distance,
        categories,
        tags,
        groups,
    } = element.dataset;

    ReactDOM.render(
        <Event
            moduleId={moduleId}
            settings={JSON.parse(settings)}
            translation={translation}
            gridColumn={gridColumn}
            restUrl={restUrl}
            archiveUrl={archiveUrl}
            endDate={endDate}
            lat={lat}
            lng={lng}
            distance={distance}
            categories={JSON.parse(categories)}
            tags={JSON.parse(tags)}
            groups={JSON.parse(groups)}
        />,
        element
    );
}
