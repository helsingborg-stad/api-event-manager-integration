import Event from './Containers/Event';

const domElements = document.getElementsByClassName('modularity-event-index');
const translation = modEvent;

for (let i = 0; i < domElements.length; i++) {
    const element = domElements[i];
    const {} = element.dataset;

    ReactDOM.render(<Event translation={translation} perPage={10} />, element);
}
