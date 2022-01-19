const eventFormSubmit = {
    setupFormSubmit: () => {
        const forms = document.querySelectorAll('.js-event-form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                const imageInput = form.querySelector('input[name="image_input"]');
                const formData = eventFormSubmit.formToJsonData(form);

                const imageData = new FormData();
                imageData.append('file', imageInput.files[0]);
                const formRequests = [];
                formRequests.push(eventFormSubmit.submitImageData(imageData));

                console.log(formData)
                if (formData.event_organizer === 'new') {
                    const organizerData = {title: '', phone: '', email: ''};
                    Object.keys(organizerData).forEach(key => {
                        const organizerField = form.querySelector(`organizer-${key}`);
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
                    // create event_location
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

        formData['accessibility'] = [];
        form.querySelectorAll("input[name='accessibility']:checked").forEach(input => {
            formData['accessibility'].push(input.value);
        });

        formData['user_groups'] = groups;
        formData['event_categories'] = categories;
        formData['event_tags'] = tags;

      return formData;
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
