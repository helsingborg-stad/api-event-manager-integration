const eventFormSubmit = {
    setupFormSubmit: () => {
        const forms = document.querySelectorAll('.js-event-form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                const submitButton = form.querySelector('.event-submit__submit-button');
                submitButton.disabled = true;

                form.querySelector('.event-submit__success').classList.add('u-display--none');
                form.querySelector('.event-submit__error').classList.add('u-display--none');

                const imageInput = form.querySelector('input[name="image_input"]');
                const formData = eventFormSubmit.formToJsonData(form);

                const imageData = new FormData();
                imageData.append('file', imageInput.files[0]);
                const formRequests = [];
                formRequests.push(eventFormSubmit.submitImageData(imageData));

                if (formData.event_organizer === 'new') {
                    const organizerData = { title: '', phone: '', email: '' };
                    Object.keys(organizerData).forEach(key => {
                        const organizerField = form.querySelector(`[name="organizer-${key}"]`);
                        if (organizerField) {
                            organizerData[key] = organizerField.value;
                        }
                    });

                    formRequests.push(eventFormSubmit.submitFormData(organizerData, 'submit_organizer'));
                } else {
                    formData['organizers'] = [{
                        organizer: formData['event_existing_organizer'],
                        main_organizer: true
                    }];
                    formRequests.push([]);
                }

                if (formData.event_location === 'new') {
                    const locationData = { title: '', street_address: '', city: '', postal_code: '' };
                    Object.keys(locationData).forEach(key => {
                        const locationField = form.querySelector(`[name="location-${key.replace('_', '-')}"]`);
                        if (locationField) {
                            locationData[key] = locationField.value;
                        }
                    });

                    formRequests.push(eventFormSubmit.submitFormData(locationData, 'submit_location'));
                } else {
                    formData['location'] = formData['event_existing_location'];
                    formRequests.push([]);
                }

                Promise.all(formRequests)
                    .then(([imageResponse, organizerResponse, locationResponse]) => {
                        if (imageResponse?.success) {
                            formData['featured_media'] = imageResponse.data;
                        }

                        if (organizerResponse?.success) {
                            formData['organizers'] = [{
                                organizer: organizerResponse.data.id,
                                main_organizer: true
                            }];
                            formData['contact_phone'] = organizerResponse.data.phone;
                            formData['contact_email'] = organizerResponse.data.email;
                        }

                        if (locationResponse?.success) {
                            formData['location'] = locationResponse.data.id;
                        }

                        const errorResponses = [imageResponse, organizerResponse, locationResponse].filter(x => !Array.isArray(x) && !x.success).map(x => x.data);
                        if (errorResponses.length > 0) {
                            eventFormSubmit.displayErorrNotice(form, errorResponses.join('<br />'));
                        } else {
                            eventFormSubmit.submitFormData(formData, 'submit_event').then(response => {
                                if (response.success) {
                                    eventFormSubmit.displaySuccessNotice(form, eventintegrationFront.event_submitted_message);
                                    form.reset();
                                } else {
                                    eventFormSubmit.displayErorrNotice(form, response.data);
                                }
                            });
                        }
                    }).catch(e => {
                        eventFormSubmit.displayErorrNotice(form, e.message);
                    }).finally(x => {
                        submitButton.disabled = false;
                    });
            });
        });
    },
    displayErorrNotice: (form, text) => {
        form.querySelector('.event-submit__success').classList.add('u-display--none');
        const errorNotice = form.querySelector('.event-submit__error');
        errorNotice.classList.remove('u-display--none');
        errorNotice.querySelector('[id^="notice__text__"]').innerHTML = text;
    },
    displaySuccessNotice: (form, text) => {
        form.querySelector('.event-submit__error').classList.add('u-display--none');
        const successNotice = form.querySelector('.event-submit__success');
        successNotice.classList.remove('u-display--none');
        successNotice.querySelector('[id^="notice__text__"]').innerHTML = text;
    },
    submitImageData: (data) => {
        data.append('action', 'submit_image');
        return eventFormSubmit.submitForm(data);
    },
    submitFormData: (data, action) => {
        let formData = new FormData();
        formData = eventFormSubmit.buildFormData(formData, data, 'data');
        formData.append('action', action);
        return eventFormSubmit.submitForm(new URLSearchParams(formData));
    },
    buildFormData: (formData, data, parentKey) => {
        if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
            Object.keys(data).forEach(key => {
                formData = eventFormSubmit.buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
            });
        } else {
            const value = data == null ? '' : data;

            formData.append(parentKey, value);
        }
        return formData;
    },
    submitForm: (body) => {
        return new Promise((resolve, reject) => {
            if (!eventintegration?.ajaxurl) {
                return reject('[submitImageData] No ajax url defined');
            }
            fetch(eventintegration.ajaxurl,
                {
                    method: 'POST',
                    body
                }).then(res => res.json())
                .then(json => resolve(json))
                .catch(err => reject(err));
        });
    },
    formToJsonData: (form) => {
        const formArray = eventFormSubmit.serializeArray(form);
        let formData = {};
        let groups;
        const categories = [];
        const tags = [];

        formArray.forEach(field => {
            switch (field.name) {
                case 'user_groups':
                    groups = field.value.split(',').map(value => parseInt(value, 10));
                    break;
                case 'event_categories':
                    categories.push(parseInt(field.value));
                    break;
                case 'event_tags':
                    tags.push(parseInt(field.value));
                    break;
                default:
                    formData[field.name] = field.value;
            }
        });

        formData['occasions'] = [];
        form
            .querySelectorAll('#event_schema_single_date .sub-fields')
            .forEach(occasionGroup => {
                const startDate = eventFormSubmit.formatDate(
                    occasionGroup.querySelector('[name="start_date"]').value,
                    occasionGroup.querySelector('[name="start_time"]').value
                );
                const endDate = eventFormSubmit.formatDate(
                    occasionGroup.querySelector('[name="end_date"]').value,
                    occasionGroup.querySelector('[name="end_time"]').value
                );
                if (startDate && endDate) {
                    formData['occasions'].push({
                        start_date: startDate,
                        end_date: endDate,
                        status: 'scheduled',
                        content_mode: 'master',
                    });
                }
            });

        // Recurring occasions
        formData['rcr_rules'] = [];
        {
            const occasionGroup = form.querySelector('#event_schema_recurring_date');
            const startTime = occasionGroup.querySelector('[name="recurring_start_time"]').value
            const endTime = occasionGroup.querySelector('[name="recurring_end_time"]').value

            let startDate = occasionGroup.querySelector('[name="recurring_start_date"]').value;
            startDate = eventFormSubmit.isValidDate(startDate) ? startDate : false;
            let endDate = occasionGroup.querySelector('[name="recurring_end_date"]').value;
            endDate = eventFormSubmit.isValidDate(endDate) ? endDate : false;

            if (startTime && endTime && startDate && endDate) {
                formData['rcr_rules'].push({
                    rcr_week_day: occasionGroup.querySelector('[name="weekday"]').value,
                    rcr_weekly_interval: occasionGroup.querySelector('[name="weekly_interval"]').value,
                    rcr_start_time: startTime,
                    rcr_end_time: endTime,
                    rcr_start_date: startDate,
                    rcr_end_date: endDate,
                });
            }
        }


        formData['accessibility'] = [];
        form.querySelectorAll("input[name='accessibility']:checked").forEach(input => {
            formData['accessibility'].push(input.value);
        });

        if (groups) {
            formData['user_groups'] = groups;
        }
        formData['event_categories'] = categories;
        formData['event_tags'] = tags;

        return formData;
    },
    serializeArray: (form) => {
        const formData = new FormData(form);
        const pairs = [];

        for (const [name, value] of formData) {
            pairs.push({ name, value });
        }

        return pairs;
    },
    formatDate: (date, time) => {
        let dateTime = '';
        let hh = time.split(':')[0];
        let mm = time.split(':')[1];

        //Format from datepicker (dd/mm/yyyy) to wp format (yyyy-mm-dd)
        if (date.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
            let dateExploded = date.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/)

            // Pads date with 0 eg. 06 for june
            dateExploded[2] = dateExploded[2].padStart(2, '0')
            dateExploded[1] = dateExploded[1].padStart(2, '0')

            //YYYY-MM-DD
            date = `${dateExploded[3]}-${dateExploded[2]}-${dateExploded[1]}`
        }

        if (eventFormSubmit.isValidDate(date) && hh && mm) {
            dateTime = date + ' ' + hh.padStart(2, '0') + ':' + mm.padStart(2, '0') + ':00';
        }
        return dateTime;
    },
    isValidDate: (dateString) => {
        const regEx = /^\d{4}-\d{2}-\d{2}$/;
        return dateString.match(regEx) != null;
    },
};

document.addEventListener('DOMContentLoaded', function () {
    eventFormSubmit.setupFormSubmit();
});
