const eventFormValidate = {
    setupFormValidate: () => {
        const forms = document.querySelectorAll('.js-event-form');
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea, select');

            // Validate fields on change
            ['keyup', 'change'].forEach(function(e) {
                inputs.forEach(input => {
                    input.addEventListener(e, function() { eventFormValidate.validateInput(input); });
                });
            });

            // Validate fields on submit
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.addEventListener('click', (e) => {
                if(!form.checkValidity()) {
                    inputs.forEach(input => {
                        eventFormValidate.validateInput(input);
                    });
                }
            });
        });
    },
    validateInput: (input) => {
        if(input.checkValidity()) {
            eventFormValidate.inputSuccess(input);
        } else {
            eventFormValidate.inputError(input);
        }
    },
    getFieldWrapper: (input) => {
        var fieldWrapper = input;
        do {
            if(fieldWrapper.parentNode !== document.body) {
                fieldWrapper = fieldWrapper.parentNode;
            } else {
                return input;
            }
        } while(!fieldWrapper.matches('.c-field, .c-option'));

        return fieldWrapper;
    },
    inputSuccess: (input) => {
        eventFormValidate.getFieldWrapper(input).classList.remove('is-invalid');
    },
    inputError: (input) => {
        eventFormValidate.getFieldWrapper(input).classList.add('is-invalid');
    },
}

document.addEventListener('DOMContentLoaded', function () {
    eventFormValidate.setupFormValidate();
});
