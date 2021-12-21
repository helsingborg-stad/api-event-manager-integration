const eventForm = {
        setupForms: () => {
            const forms = document.querySelectorAll('.js-event-form');
            forms.forEach(form => {
                const conditionalFields = form.querySelectorAll('[data-condition]');
                conditionalFields.forEach(field => eventForm.setupConditionalFields(form, field));
            });
        },
        setupConditionalFields: (form, field) => {
            eventForm.setVisiblity(form, field);
            const targetFieldKeys = JSON.parse(field.dataset.condition).map(condition => condition.key);
            targetFieldKeys.forEach(fieldKey => {
                form.querySelectorAll(`input[name="${fieldKey}"]`).forEach(targetField => {
                    targetField.addEventListener('change', e => {
                        eventForm.setVisiblity(form, field);
                    });
                })
            });
        },
        setVisiblity: (form, field) => {
            const conditions = JSON.parse(field.dataset.condition);
            const conditionResult = conditions.map(condition => {
                let targetField = form.querySelector(`input[name="${condition.key}"]:checked`);
                if (!targetField) {
                    targetField = form.querySelector(`input[name="${condition.key}"]`);
                }
                if (targetField) {
                    switch (condition.compare) {
                        case '=':
                            return targetField.value == condition.value;
                        case '!=':
                            return targetField.value != condition.value;
                        default:
                            console.warn(`Compare condition '${condition.compare}' not supported`);
                            break;
                    }
                } else {
                    console.info(`Target field '${condition.key}' not found`);
                }
                return false;
            });

            if (conditionResult.every(x => x === true)) {
                field.classList.remove('u-display--none');
            } else {
                field.classList.add('u-display--none');
            }
        }
    }
;

document.addEventListener('DOMContentLoaded', function () {
    eventForm.setupForms();
});
