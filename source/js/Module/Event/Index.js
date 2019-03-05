// Polyfills
import 'es6-promise';
import 'isomorphic-fetch';
// Components
import FilterableEventsContainer from './Components/FilterableEventsContainer';

const domElements = document.getElementsByClassName('modularity-event-index');
const translation = modEvent;

for (let i = 0; i < domElements.length; i++) {
    const element = domElements[i];
    const { settings, categories, tags, groups, ageRange } = element.dataset;

    ReactDOM.render(
        <FilterableEventsContainer
            {...element.dataset}
            translation={translation}
            settings={JSON.parse(settings)}
            categories={JSON.parse(categories)}
            tags={JSON.parse(tags)}
            groups={JSON.parse(groups)}
            ageRange={JSON.parse(ageRange)}
        />,
        element
    );
}
