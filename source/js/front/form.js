const eventForm = {
	setupForms: () => {
		const forms = document.querySelectorAll('.js-event-form');
		forms.forEach((form) => {
			const conditionalFields = form.querySelectorAll('[data-condition]');
			conditionalFields.forEach((field) => eventForm.setupConditionalFields(form, field));
			const conditionalValueFields = form.querySelectorAll('[data-condition-value]');
			conditionalValueFields.forEach((field) => eventForm.setupConditionalValueFields(form, field));
			eventForm.setupRepeaters(form);
			eventForm.setupRemoteSelect(form, eventintegration, eventIntegrationFront ?? {});
		});
	},
	setupConditionalFields: (form, field) => {
		eventForm.setVisiblity(form, field);
		const targetFieldKeys = JSON.parse(field.dataset.condition).map((condition) => condition.key);
		targetFieldKeys.forEach((fieldKey) => {
			form.querySelectorAll(`input[name="${fieldKey}"]`).forEach((targetField) => {
				targetField.addEventListener('change', (e) => {
					eventForm.setVisiblity(form, field);
				});
			});
		});
	},
	setupConditionalValueFields: (form, field) => {
		const conditionValue = JSON.parse(field.dataset.conditionValue);
		form.querySelectorAll(`input[name="${conditionValue.key}"]`).forEach((targetField) => {
			targetField.addEventListener('change', (e) => {
				const conditionResult = eventForm.checkConditions(form, [conditionValue]);
				if (conditionResult.every((x) => x === true)) {
					field.querySelectorAll('input').forEach((x) => {
						x.dataset.oldValue = x.value;
						x.value = conditionValue.value;
					});
				} else {
					field.querySelectorAll('input').forEach((x) => {
						if ('oldValue' in x.dataset) {
							x.value = x.dataset.oldValue;
						}
					});
				}
			});
		});
	},
	checkConditions: (form, conditions) => {
		const conditionResult = conditions.map((condition) => {
			let targetField = form.querySelector(`input[name="${condition.key}"]:checked`);
			if (!targetField) {
				targetField = form.querySelector(`input[name="${condition.key}"]`);
			}
			if (targetField) {
				switch (condition.compare) {
					case '=':
						if (targetField.type === 'checkbox') {
							return targetField.checked == condition.compareValue;
						}
						if (targetField.files !== null) {
							return targetField.files.length == condition.compareValue;
						}
						return targetField.value == condition.compareValue;
					case '!=':
						if (targetField.type === 'checkbox') {
							return targetField.checked != condition.compareValue;
						}
						if (targetField.files !== null) {
							return targetField.files.length != condition.compareValue;
						}
						return targetField.value != condition.compareValue;
					default:
						console.warn(`Compare condition '${condition.compare}' not supported`);
						break;
				}
			} else {
				console.info(`Target field '${condition.key}' not found`);
			}
			return false;
		});

		return conditionResult;
	},
	setVisiblity: (form, field) => {
		const conditions = JSON.parse(field.dataset.condition);
		const conditionResult = eventForm.checkConditions(form, conditions);
		if (conditionResult.every((x) => x === true)) {
			field.classList.remove('u-display--none');
			field.querySelectorAll('input, select').forEach((x) => {
				x.disabled = false;
			});
		} else {
			field.classList.add('u-display--none');
			field.querySelectorAll('input, select').forEach((x) => {
				x.disabled = true;
			});
		}
	},
	setupRepeaters: (form) => {
		const repeaters = form.querySelectorAll('.js-repeater');
		repeaters.forEach((repeater) => {
			const addButton = repeater.querySelector('.btn-repeater-add');
			const removeButton = repeater.querySelector('.btn-repeater-remove');
			addButton.addEventListener('click', (e) => {
				const subFieldsClone = repeater.querySelector('.sub-fields').cloneNode(true);
				subFieldsClone.querySelectorAll('input').forEach((field) => {
					field.value = '';
				});
				repeater.insertBefore(subFieldsClone, addButton);
				if (repeater.querySelectorAll('.sub-fields').length > 1) {
					removeButton.classList.remove('u-display--none');
				}
			});
			removeButton.addEventListener('click', (e) => {
				const subFields = repeater.querySelectorAll('.sub-fields');
				if (subFields.length > 1) {
					subFields[subFields.length - 1].remove();
				}
				if (subFields.length === 1) {
					removeButton.classList.add('u-display--none');
				}
			});
		});
	},
	setupRemoteSelect: (form, { apiurl }, { select_string }) => {
		if (apiurl === undefined) {
			return;
		}
		const apiUrl = apiurl.replace(/\/$/, '');
		const selects = form.querySelectorAll('select[data-source*=type]');
		selects.forEach((select) => {
			const dataSource = JSON.parse(select.dataset.source);
			let url = apiUrl + '/' + dataSource.name;

			if (dataSource.type === 'post') {
				url += '/complete';
				eventForm.fetchSelectItems(url).then((items) => {
					eventForm.setupSelectOptions(select_string, select, dataSource, items);
				});
			} else {
				let page = 1;
				const allItems = [];
				const fetchNextPage = () => {
					url = `${apiUrl}/${dataSource.name}?page=${page}&per_page=100`;
					eventForm.fetchSelectItems(url).then((items) => {
						if (items.length > 0) {
							allItems.push(...items);
							page++;
							fetchNextPage();
						} else {
							eventForm.setupSelectOptions(select_string, select, dataSource, allItems);
						}
					});
				};
				fetchNextPage();
			}
		});
	},
	fetchSelectItems: (url) => {
		return fetch(url).then((data) => data.json());
	},
	setupSelectOptions: (select_string, select, dataSource, items) => {
		select.querySelectorAll('option').forEach((option) => option.remove());
		if (!select.multiple) {
			const defaultOption = document.createElement('option');
			defaultOption.setAttribute('selected', 'selected');
			defaultOption.innerText = select_string;
			defaultOption.value = '';
			select.appendChild(defaultOption);
		}
		items
			.sort((a, b) => a.title > b.title)
			.forEach((item, index) => eventForm.createSelectOption(select, dataSource, item, index));
		if (dataSource.hiddenFields !== undefined) {
			select.addEventListener('change', () => {
				const selectedOption = select.querySelector('option[value="' + select.value + '"]');
				if (selectedOption && selectedOption.dataset.hiddenFields) {
					Object.values(dataSource.hiddenFields).forEach((key) => {
						const hiddenField = select.parentNode.querySelector(`input[name=${key}]`);
						hiddenField.value = JSON.parse(selectedOption.dataset.hiddenFields)[key];
					});
				}
			});
			Object.values(dataSource.hiddenFields).forEach((key) => eventForm.createHiddenField(select, key));
		}
	},
	createSelectOption: (select, dataSource, item, index) => {
		const option = document.createElement('option');
		option.setAttribute('value', item.id);
		if (dataSource.type === 'post') {
			option.innerText = item.title;
		} else {
			option.innerText = item.name;
		}
		if (dataSource.hiddenFields !== undefined) {
			const hiddenFieldsData = {};
			Object.keys(dataSource.hiddenFields).forEach((key) => {
				hiddenFieldsData[dataSource.hiddenFields[key]] = item[key];
			});
			option.setAttribute('data-hidden-fields', JSON.stringify(hiddenFieldsData));
		}
		select.appendChild(option);
	},
	createHiddenField: (select, key) => {
		const selectedOption = select.querySelector('option[data-hidden-fields]');
		if (selectedOption) {
			const hiddenField = document.createElement('input');
			hiddenField.name = key;
			hiddenField.type = 'hidden';
			hiddenField.value = JSON.parse(selectedOption.dataset.hiddenFields)[key];
			select.parentNode.insertBefore(hiddenField, select);
		}
	},
};

document.addEventListener('DOMContentLoaded', () => {
	eventForm.setupForms();
});
