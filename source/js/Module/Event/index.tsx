// Polyfills
import 'es6-promise';
import 'isomorphic-fetch';
import React from 'react';
import ReactDOM from 'react-dom';

// Components
import FilterableEventsContainer from './Components/FilterableEventsContainer';
import './module-event.css';

declare const modEvent: any;

document.addEventListener('DOMContentLoaded', (e) => {
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
			const { settings, categories, tags, groups, ageFrom, ageTo, noUrl, cardStyle, mobileSlider } = element.dataset;
			const resetButtonUrl = element.getAttribute('data-reset-url');

			ReactDOM.render(
				<FilterableEventsContainer
					{...element.dataset}
					categories={JSON.parse(categories)}
					groups={JSON.parse(groups)}
					settings={JSON.parse(settings)}
					tags={JSON.parse(tags)}
					translation={translation}
					startDate={startDate}
					resetButtonUrl={resetButtonUrl}
					ageFrom={ageFrom}
					ageTo={ageTo}
					noUrl={noUrl}
					cardStyle={cardStyle}
					mobileSlider={mobileSlider === 'true' ? true : false}
				/>,
				element,
			);
		}
	}
});
