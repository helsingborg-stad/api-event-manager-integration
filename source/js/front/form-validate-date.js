const eventFormDateValidation = {
	setupEventDateValidation: () => {
		const eventSchemaSingleDates = document.querySelectorAll('#event_schema_single_date .sub-fields');
		eventSchemaSingleDates.forEach((subFields) => {
			const startDate = subFields.querySelector('input[name="start_date"]');
			const startTime = subFields.querySelector('input[name="start_time"]');
			const endDate = subFields.querySelector('input[name="end_date"]');
			const endTime = subFields.querySelector('input[name="end_time"]');

			[startTime, endTime].forEach((input) =>
				input.addEventListener('change', () => {
					if (startDate.value == endDate.value) {
						if (endTime.value <= startTime.value) {
							endTime.parentElement.querySelector('.c-field__error-icon').classList.add('u-display--block');
							if (!endTime.parentElement.parentElement.querySelector('#error-text')) {
								const errorMsg = document.createElement('span');
								errorMsg.id = 'error-text';
								errorMsg.appendChild(document.createTextNode(eventIntegrationFront.event_end_date_invalid));
								errorMsg.classList.add('u-color__text--danger');
								endTime.parentElement.parentElement.appendChild(errorMsg);
							}
						} else {
							endTime.parentElement.querySelector('.c-field__error-icon').classList.remove('u-display--block');
							endTime.parentElement.parentElement.querySelector('#error-text')?.remove();
						}
					}
				}),
			);
		});
	},
};

document.addEventListener('DOMContentLoaded', function () {
	eventFormDateValidation.setupEventDateValidation();
});
