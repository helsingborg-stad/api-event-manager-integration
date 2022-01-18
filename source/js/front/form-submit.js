const eventFormSubmit = {
    setupFormSubmit: () => {
        const forms = document.querySelectorAll('.js-event-form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                /*
                var fileInput = $(eventForm.find('#fs_image_input')[0]),
                        formData = this.jsonData(eventForm),
                        imageData = new FormData(),
                        organizerData = {title: '', phone: '', email: ''},
                        locationData = {title: '', street_address: '', city: '', postal_code: ''},
                        newOrganizerinputs = $('#new-organizer input'),
                        newLocationinputs = $('#new-location input');

                    newOrganizerinputs.each((index, element) => {
                        organizerData[element.getAttribute('field')] = element.value;
                    });

                    newLocationinputs.each((index, element) => {
                        locationData[element.getAttribute('field')] = element.value;
                    });
                 */
                const imageInput = form.querySelector('input[name="image_input"]');
                const formData = eventFormSubmit.serializeArray(form);

                const imageData = new FormData();
                imageData.append('file', imageInput.files[0]);
                const formRequests = [];
                formRequests.push(eventFormSubmit.submitImageData(imageData));

                if (formData.event_organizer === 'new') {
                    // create event_organizer
                } else {
                    formData['organizers'] = [{
                        organizer: formData['event_existing_organizer'],
                        main_organizer: true
                    }];
                    // How should we retrieve this? Add phone and email as data on the options?
                    //formData['contact_phone'] = organizerResponse[0].data.phone;
                    //formData['contact_email'] = organizerResponse[0].data.email;
                    formRequests.push([]);
                }

                if (formData.event_location === 'new') {
                    // create event_location
                } else {
                    // use existing
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

                        console.log(imageResponse, organizerResponse, locationResponse);
                    });
            });
        });
    },
    submitImageData: (data) => {
        data.append('action', 'submit_image');
        return eventFormSubmit.submitForm(data);
    },
    submitFormData: (data, action) => {
        return eventFormSubmit.submitForm({data, action});
    },
    submitForm: (body) => {
        return new Promise((resolve, reject) => {
            if (!eventintegration?.ajaxurl) {
                console.error('[submitImageData] No ajax url defined');
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
    serializeArray: (form) => {
        const formData = new FormData(form);
        const pairs = [];

        for (const [name, value] of formData) {
            pairs.push({name, value});
        }

        return pairs;
    }
};

document.addEventListener('DOMContentLoaded', function () {
    eventFormSubmit.setupFormSubmit();
});
