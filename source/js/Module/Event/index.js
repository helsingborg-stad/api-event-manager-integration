// Polyfills
import 'es6-promise';
import 'isomorphic-fetch';
// Components
import FilterableEventsContainer from './Components/FilterableEventsContainer';
import './module-event.css';

document.addEventListener('DOMContentLoaded', e => {
  if (!modEvent) {
    return;
  }

  const domElements = document.getElementsByClassName('modularity-event-index');
  const translation = modEvent;
  const todaysDate = new Date();
  const startDate = todaysDate.toLocaleDateString('sv-SE');

  if (domElements.length > 0) {
    for (let i = 0; i < domElements.length; i++) {
      const element = domElements[i];
      const { settings, categories, tags, groups, ageRange } = element.dataset;

      ReactDOM.render(
        <FilterableEventsContainer
          {...element.dataset}
          ageRange={JSON.parse(ageRange)}
          categories={JSON.parse(categories)}
          groups={JSON.parse(groups)}
          settings={JSON.parse(settings)}
          tags={JSON.parse(tags)}
          translation={translation}
          startDate={startDate}
        />,
        element
      );
    }
  }
});
