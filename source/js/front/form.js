const eventForm = {
    setupForms: () => {
        const forms = document.querySelectorAll('.js-event-form');
        forms.forEach((form) => {
            const conditionalFields = form.querySelectorAll('[data-condition]');
            conditionalFields.forEach((field) =>
                eventForm.setupConditionalFields(form, field)
            );
            eventForm.setupRepeaters(form);
            eventForm.setupRemoteSelect(form, eventintegration ?? {});
        });
    },
    setupConditionalFields: (form, field) => {
        eventForm.setVisiblity(form, field);
        const targetFieldKeys = JSON.parse(field.dataset.condition).map(
            (condition) => condition.key
        );
        targetFieldKeys.forEach((fieldKey) => {
            form.querySelectorAll(`input[name="${fieldKey}"]`).forEach(
                (targetField) => {
                    targetField.addEventListener('change', (e) => {
                        eventForm.setVisiblity(form, field);
                    });
                }
            );
        });
    },
    setVisiblity: (form, field) => {
        const conditions = JSON.parse(field.dataset.condition);
        const conditionResult = conditions.map((condition) => {
            let targetField = form.querySelector(
                `input[name="${condition.key}"]:checked`
            );
            if (!targetField) {
                targetField = form.querySelector(
                    `input[name="${condition.key}"]`
                );
            }
            if (targetField) {
                switch (condition.compare) {
                    case '=':
                        if (targetField.files !== null) {
                            return targetField.files.length == condition.value;
                        }
                        return targetField.value == condition.value;
                    case '!=':
                        if (targetField.files !== null) {
                            return targetField.files.length != condition.value;
                        }
                        return targetField.value != condition.value;
                    default:
                        console.warn(
                            `Compare condition '${condition.compare}' not supported`
                        );
                        break;
                }
            } else {
                console.info(`Target field '${condition.key}' not found`);
            }
            return false;
        });

        if (conditionResult.every((x) => x === true)) {
            field.classList.remove('u-display--none');
            field.querySelectorAll('input').forEach((x) => {
                x.required = true;
            });
        } else {
            field.classList.add('u-display--none');
            field.querySelectorAll('input').forEach((x) => {
                x.required = false;
            });
        }
    },
    setupRepeaters: (form) => {
        const repeaters = form.querySelectorAll('.js-repeater');
        repeaters.forEach((repeater) => {
            const addButton = repeater.querySelector('.btn-repeater-add');
            const removeButton = repeater.querySelector('.btn-repeater-remove');
            addButton.addEventListener('click', (e) => {
                const subFieldsClone = repeater
                    .querySelector('.sub-fields')
                    .cloneNode(true);
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
    setupRemoteSelect: (form, {apiurl}) => {
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
            }
            fetch(url)
                .then((data) => data.json())
                .then((items) => {
                    select
                        .querySelectorAll('option')
                        .forEach((option) => option.remove());
                    items
                        .sort((a, b) => a.title > b.title)
                        .forEach((item) => {
                            const option = document.createElement('option');
                            option.setAttribute('value', item.id);
                            if (dataSource.type === 'post') {
                                option.innerText = item.title;
                            } else {
                                option.innerText = item.name;
                            }
                            select.appendChild(option);
                        });
                });
        });
    },
};
document.addEventListener('DOMContentLoaded', function () {
    eventForm.setupForms();
});
