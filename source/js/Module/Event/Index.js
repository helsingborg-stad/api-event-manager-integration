// Polyfills
import 'es6-promise';
import 'isomorphic-fetch';
// Components
import Event from './Containers/Events';

const domElements = document.getElementsByClassName('modularity-event-index');
const translation = modEvent;

for (let i = 0; i < domElements.length; i++) {
    const element = domElements[i];
    const { settings, categories, tags, groups } = element.dataset;

    ReactDOM.render(
        <Event
            {...element.dataset}
            translation={translation}
            settings={JSON.parse(settings)}
            categories={JSON.parse(categories)}
            tags={JSON.parse(tags)}
            groups={JSON.parse(groups)}
        />,
        element
    );
}
