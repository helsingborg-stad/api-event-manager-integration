export default (() => {
    // Init submit event form
    if(!EventManagerIntegration){ var EventManagerIntegration = {}; }

    EventManagerIntegration.Event = EventManagerIntegration.Event || {};

    EventManagerIntegration.Event.Form = (function($) {
        function Form() {
            $('.submit-event').each(
                function(index, eventForm) {
                    var apiUrl = eventintegration.apiurl;
                    apiUrl = apiUrl.replace(/\/$/, '');

                    $('#recurring-event', eventForm)
                        .children('.box')
                        .hide();

                    $('#new-organizer', eventForm)
                        .hide();

                    $('#new-location', eventForm)
                        .hide();

                    var organizerInputs = $('#new-organizer').find('input'),
                        locationInputs = $('#new-location').find('input');

                    locationInputs.each((index, element) => {
                        $('label[for="' + element.id + '"').append('<span class="u-color__text--danger"> * </span>')
                    });


                    organizerInputs.each((index, element) => {
                        $('label[for="' + element.id + '"').append('<span class="u-color__text--danger"> * </span>')
                    });
                    
                    this.handleEvents($(eventForm), apiUrl);
                    // this.hyperformExtensions(eventForm);
                    // this.datePickerSettings();

                    
                    if (document.getElementById('location-selector') !== null) {
                        this.loadPostType($(eventForm), apiUrl, 'location');
                    }
                    if (document.getElementById('organizer-selector') !== null) {
                        this.loadPostType($(eventForm), apiUrl, 'organizer');
                    }
                    if (document.getElementById('user_groups') !== null) {
                        this.loadTaxonomy($(eventForm), apiUrl, 'user_groups');
                    }
                    if (document.getElementById('event_categories') !== null) {
                        this.loadTaxonomy($(eventForm), apiUrl, 'event_categories');
                    }
                    if (document.getElementById('event_tags') !== null) {
                        this.loadTaxonomy($(eventForm), apiUrl, 'event_tags');
                    }
                }.bind(this)
            );
        }

        /**
         * Add custom validations with Hyperform
         */
        Form.prototype.hyperformExtensions = function(eventForm) {
            // Match email addresses

            if ('submitter_repeat_email' in eventForm) {
                hyperform.addValidator(eventForm.submitter_repeat_email, function(element) {
                    var valid = element.value === eventForm.submitter_email.value;
                    element.setCustomValidity(valid ? '' : eventIntegrationFront.email_not_matching);

                    return valid;
                });
            }

            if ('image_input' in eventForm) {
                hyperform.addValidator(eventForm.image_input, function(element) {
                    if (!$('#image_input').prop('required')) {
                        return true;
                    }

                    var valid = element.files.length > 0,
                        notice = eventForm.querySelector('.image-notice'),
                        noticeHtml = document.createElement('p');

                    if (!valid && !notice) {
                        noticeHtml.innerHTML = eventIntegrationFront.must_upload_image;
                        noticeHtml.className = 'text-danger image-notice';
                        eventForm.querySelector('.image-box').appendChild(noticeHtml);
                    }

                    element.setCustomValidity(valid ? '' : eventIntegrationFront.must_upload_image);

                    return valid;
                });
            }
        };

        // Get taxonomies from API and add to select box
        Form.prototype.loadTaxonomy = function(eventForm, resource, taxonomy) {
            resource += '/' + taxonomy + '?_jsonp=' + taxonomy + '&per_page=100';
            var select = document.getElementById(taxonomy);

            $.ajax({
                type: 'GET',
                url: resource,
                cache: false,
                dataType: 'jsonp',
                jsonpCallback: taxonomy,
                crossDomain: true,
                success: function(response) {
                    // Clear select
                    $(select).html('');

                    // Map up and populate hierarchical taxonomies
                    if (taxonomy === 'user_groups' || taxonomy === 'event_categories') {
                    var taxonomies = Form.prototype.hierarchicalTax(response);

                    // Add select option and it's children taxonomies
                    $(taxonomies.children).each(function (index, tax) {
                        // Parent option
                        Form.prototype.addOption(tax, select, '');
                        $(tax.children).each(function (index, tax) {
                        // Children option
                        Form.prototype.addOption(tax, select, ' – ');
                        $(tax.children).each(function (index, tax) {
                            // Grand children options
                            Form.prototype.addOption(tax, select, ' – – ');
                        });
                        });
                    });
                    } else {
                    // Populate non hierarchical taxonomy lists
                    var taxonomies = response;
                    $(taxonomies).each(function (index, term) {
                        var opt = document.createElement('option');
                        opt.value = term.id;
                        opt.innerHTML += term.name;
                        select.appendChild(opt);
                    });
                    }
                },
            });
        };

        Form.prototype.addOption = function(taxonomy, select, depth) {
            var opt = document.createElement('option');
            opt.value = taxonomy.data.id;
            opt.innerHTML += depth;
            opt.innerHTML += taxonomy.data.name;
            select.appendChild(opt);
        };

        function TreeNode(data) {
            this.data = data;
            this.parent = null;
            this.children = [];
        }

        TreeNode.comparer = function(a, b) {
            return a.data.name < b.data.name ? 0 : 1;
        };

        TreeNode.prototype.sortRecursive = function() {
            this.children.sort(Form.prototype.comparer);
            for (var i = 0, l = this.children.length; i < l; i++) {
                this.children[i].sortRecursive();
            }
            return this;
        };

        // List taxonomy objects hierarchical
        Form.prototype.hierarchicalTax = function(data) {
            var nodeById = {},
                i = 0,
                l = data.length,
                node;

            // Root node
            nodeById[0] = new TreeNode();

            // Make TreeNode objects for each item
            for (i = 0; i < l; i++) {
                nodeById[data[i].id] = new TreeNode(data[i]);
            }
            // Link all TreeNode objects
            for (i = 0; i < l; i++) {
                node = nodeById[data[i].id];
                node.parent = nodeById[node.data.parent];
                node.parent.children.push(node);
            }

            return nodeById[0].sortRecursive();
        };

        // Get a post type from API and add to input init autocomplete
        Form.prototype.loadPostType = function(eventForm, resource, postType) {
            resource += '/' + postType + '/complete?_jsonp=get' + postType;
 
            new autoComplete({
                selector: '#input_' + postType + '-selector',
                minChars: 1,
                source: function(term, suggest) {
                    term = term.toLowerCase();
                    $.ajax({
                        type: 'GET',
                        url: resource,
                        cache: false,
                        dataType: 'jsonp',
                        jsonpCallback: 'get' + postType,
                        crossDomain: true,
                        success: function(response) {
                            var suggestions = [];
                            $(response).each(function(index, item) {
                                if (~item.title.toLowerCase().indexOf(term))
                                    suggestions.push(
                                        [
                                            item.title, 
                                            item.id, 
                                            postType, 
                                            item.contact_phone ? item.contact_phone : '' , 
                                            item.contact_email ? item.contact_email : ''
                                        ]
                                    );
                            });
                            (suggestions);

                            suggest(suggestions);
                        },
                    });
                },
                renderItem: function(item, search) {
                    search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                    var re = new RegExp('(' + search.split(' ').join('|') + ')', 'gi');
                    return (
                        '<div class="autocomplete-suggestion" data-type="' +
                        item[2] +
                        '" data-langname="' +
                        item[0] +
                        '" data-lang="' +
                        item[1] +
                        '" data-val="' +
                        search +
                        '" contact-phone="' +
                        item[3] +
                        '" contact-email="' +
                        item[4] +
                        '"> ' +
                        item[0].replace(re, '<b>$1</b>') +
                        '</div>'
                    );
                },
                onSelect: function(e, term, item) {
                    $('#input_' + item.getAttribute('data-type') + '-selector').val(
                        item.getAttribute('data-langname')
                    );
                    $('#' + item.getAttribute('data-type')).val(item.getAttribute('data-lang'));

                    if(item.getAttribute('contact-phone')){
                        $('#contact_email').val(item.getAttribute('contact-email'));
                    }

                    if(item.getAttribute('contact-email')){
                        $('#contact_phone').val(item.getAttribute('contact-phone'));
                    }
                },
            });
        };

        // Save+format input data and return as object
        Form.prototype.jsonData = function(form) {
            var arrData = form.serializeArray(),
                objData = {},
                groups = [],
                categories = [],
                tags = [];

            $.each(arrData, function(index, elem) {
                switch (elem.name) {
                    case 'user_groups':
                        groups = $.map(elem.value.split(','), function(value) {
                            return parseInt(value, 10);
                        });
                        break;
                    case 'event_categories':
                        categories.push(parseInt(elem.value));
                        break;
                    case 'event_tags':
                        tags.push(parseInt(elem.value));
                        break;
                    default:
                        objData[elem.name] = elem.value;
                }
            });

            // Occasion
            objData['occasions'] = [];
            $('.occurance-group-single', form).each(function(index) {
                var startDate = Form.prototype.formatDate(
                    $('[name="start_date"]', this).val(),
                    $('[name="start_time_h"]', this).val(),
                    $('[name="start_time_m"]', this).val()
                );
                var endDate = Form.prototype.formatDate(
                    $('[name="end_date"]', this).val(),
                    $('[name="end_time_h"]', this).val(),
                    $('[name="end_time_m"]', this).val()
                );
                if (startDate && endDate) {
                    objData['occasions'].push({
                        start_date: startDate,
                        end_date: endDate,
                        status: 'scheduled',
                        content_mode: 'master',
                    });
                }
            });

            // Recurring occasions
            objData['rcr_rules'] = [];
            $('.occurance-group-recurring', form).each(function(index) {
                var rcrStartH = $('[name="recurring_start_h"]', this).val(),
                    rcrStartM = $('[name="recurring_start_m"]', this).val();
                var rcrStartTime =
                    rcrStartH && rcrStartM
                        ? rcrStartH.padStart(2, '0') +
                        ':' +
                        rcrStartM.padStart(2, '0') +
                        ':' +
                        '00'
                        : false;
                var rcrEndH = $('[name="recurring_end_h"]', this).val(),
                    rcrEndM = $('[name="recurring_end_m"]', this).val();
                var rcrEndTime =
                    rcrEndH && rcrEndM
                        ? rcrEndH.padStart(2, '0') +
                        ':' +
                        rcrEndM.padStart(2, '0') +
                        ':' +
                        '00'
                        : false;
                var rcrStartDate = Form.prototype.isValidDate(
                    $('[name="recurring_start_d"]', this).val()
                )
                    ? $('[name="recurring_start_d"]', this).val()
                    : false;
                var rcrEndDate = Form.prototype.isValidDate($('[name="recurring_end_d"]', this).val())
                    ? $('[name="recurring_end_d"]', this).val()
                    : false;

                if (rcrStartTime && rcrEndTime && rcrStartDate && rcrEndDate) {
                    objData['rcr_rules'].push({
                        rcr_week_day: $('[name="weekday"]', this).val(),
                        rcr_weekly_interval: $('[name="weekly_interval"]', this).val(),
                        rcr_start_time: rcrStartTime,
                        rcr_end_time: rcrEndTime,
                        rcr_start_date: rcrStartDate,
                        rcr_end_date: rcrEndDate,
                    });
                }
            });

            if ($('#organizer', form).val()) {
                objData['organizers'] = [
                    {
                        organizer: $(form)
                            .find('#organizer')
                            .val(),
                        main_organizer: true,
                    },
                ];
            }

            // Add accessibility items
            objData['accessibility'] = [];
            $.each($("input[name='accessibility']:checked"), function() {
                objData['accessibility'].push($(this).val());
            });

            objData['user_groups'] = groups;
            objData['event_categories'] = categories;
            objData['event_tags'] = tags;

            return objData;
        };

        // Send Ajax request with media data
        Form.prototype.submitImageAjax = function(eventForm, imageData) {
            imageData.append('action', 'submit_image');
            return $.ajax({
                url: eventintegration.ajaxurl,
                type: 'POST',
                cache: false,
                contentType: false,
                processData: false,
                data: imageData,
                error: function(jqXHR, textStatus) {
                    console.log(textStatus);
                },
            });
        };

        // Send Ajax request with post data
        Form.prototype.submitAjax = function(eventForm, formData, action) {
            
            if(action === 'submit_organizer' || action === 'submit_location') {
                var allFieldsHasValue = Object.keys(formData).every(
                    (key) => {
                         return formData[key].length > 0 
                    }
                );
                
                if(!allFieldsHasValue) {                    
                    return new Promise((resolve) => {
                        resolve({success: false});
                    });                    
                }

            }

            return $.ajax({
                url: eventintegration.ajaxurl,
                type: 'POST',
                data: {
                    action: action,
                    data: formData,
                },
                success: function(response) {
                    if (response.success) {
                        $('[event-submit__error]', eventForm).addClass('u-display--none');
                        let noticeSuccess = $('[event-submit__success]', eventForm);
                        noticeSuccess[0].querySelector('[id^="notice__text__"]').innerHTML = 'Evenemanget har skickats!';
                        $('[event-submit__success]', eventForm).removeClass('u-display--none');
                        
                        Form.prototype.cleanForm(eventForm);
                        
                        return response;
                    } else {
                        $('[event-submit__success]', eventForm).addClass('u-display--none');
                        let noticeSuccess = $('[event-submit__error]', eventForm);
                        noticeSuccess[0].querySelector('[id^="notice__text__"]').innerHTML = response.data;
                        $('[event-submit__error]', eventForm).removeClass('u-display--none');
                    }
                },
                error: function(jqXHR, textStatus) {                    
                    $('[event-submit__success]', eventForm).addClass('u-display--none');
                    let noticeSuccess = $('[event-submit__error]', eventForm);
                    noticeSuccess[0].querySelector('[id^="notice__text__"]').innerHTML = textStatus;
                    $('[event-submit__error]', eventForm).removeClass('u-display--none');
                },
            });
        };

        Form.prototype.endHourChange = function(event) {
            var wrapper = event.target.closest('.occurrence');
            if (wrapper) {
                var startDate = wrapper.querySelector('input[name="start_date"]').value,
                    endDate = wrapper.querySelector('input[name="end_date"]').value,
                    startTimeH = wrapper.querySelector('input[name="start_time_h"]').value;

                if (startDate >= endDate) {
                    event.target.setAttribute('min', startTimeH);
                } else {
                    event.target.setAttribute('min', 0);
                }
            }
        };

        Form.prototype.endMinuteChange = function(event) {
            var wrapper = event.target.closest('.occurrence');
            if (wrapper) {
                var startDate = wrapper.querySelector('input[name="start_date"]').value,
                    endDate = wrapper.querySelector('input[name="end_date"]').value,
                    startTimeH = wrapper.querySelector('input[name="start_time_h"]').value,
                    endTimeH = wrapper.querySelector('input[name="end_time_h"]').value,
                    startTimeM = wrapper.querySelector('input[name="start_time_m"]').value;

                if (startDate >= endDate && startTimeH >= endTimeH) {
                    startTimeM = parseInt(startTimeM) + 10;
                    if (startTimeM >= 60) {
                        wrapper
                            .querySelector('input[name="end_time_h"]')
                            .setAttribute('min', parseInt(startTimeH) + 1);
                    } else {
                        event.target.setAttribute('min', startTimeM);
                    }
                } else {
                    event.target.setAttribute('min', 0);
                }
            }
        };

        Form.prototype.initPickerEvent = function() {
            var elements = document.querySelectorAll('input[name="start_date"]');
            Array.from(elements).forEach(
                function(element) {
                    element.onchange = function(e) {
                        if (e.target.value) {
                            var wrapper = e.target.closest('.occurrence');
                            $(wrapper)
                                .find('input[name="end_date"]')
                                .datepicker('option', 'minDate', new Date(e.target.value));
                        }
                    }.bind(this);
                }.bind(this)
            );
        };

        Form.prototype.initEndHourEvent = function() {
            var elements = document.querySelectorAll('input[name="end_time_h"]');
            Array.from(elements).forEach(
                function(element) {
                    element.onchange = this.endHourChange;
                }.bind(this)
            );
        };

        Form.prototype.initEndMinuteEvent = function() {
            var elements = document.querySelectorAll('input[name="end_time_m"]');
            Array.from(elements).forEach(
                function(element) {
                    element.onchange = this.endMinuteChange;
                }.bind(this)
            );
        };

        Form.prototype.initRecurringEndHourEvent = function() {
            var elements = document.querySelectorAll('input[name="recurring_end_h"]');
            Array.from(elements).forEach(
                function(element) {
                    element.onchange = function(event) {
                        var wrapper = event.target.closest('.occurrence');
                        if (wrapper) {
                            var startTimeH = wrapper.querySelector('input[name="recurring_start_h"]')
                                .value;
                            event.target.setAttribute('min', startTimeH);
                        }
                    };
                }.bind(this)
            );
        };

        Form.prototype.initRecurringEndMinuteEvent = function() {
            var elements = document.querySelectorAll('input[name="recurring_end_m"]');
            Array.from(elements).forEach(
                function(element) {
                    element.onchange = function(event) {
                        var wrapper = event.target.closest('.occurrence');
                        if (wrapper) {
                            var startTimeH = wrapper.querySelector('input[name="recurring_start_h"]')
                                .value;
                            var endTimeH = wrapper.querySelector('input[name="recurring_end_h"]').value;
                            var startTimeM = wrapper.querySelector('input[name="recurring_start_m"]')
                                .value;

                            if (startTimeH >= endTimeH) {
                                startTimeM = parseInt(startTimeM) + 10;
                                if (startTimeM >= 60) {
                                    wrapper
                                        .querySelector('input[name="recurring_end_h"]')
                                        .setAttribute('min', parseInt(startTimeH) + 1);
                                } else {
                                    event.target.setAttribute('min', startTimeM);
                                }
                            } else {
                                event.target.setAttribute('min', 0);
                            }
                        }
                    };
                }.bind(this)
            );
        };

        Form.prototype.initDateEvents = function() {
            // Single occasions events
            this.initPickerEvent();
            this.initEndHourEvent();
            this.initEndMinuteEvent();

            // Recurring date events
            this.initRecurringEndHourEvent();
            this.initRecurringEndMinuteEvent();
        };

        Form.prototype.datePickerSettings = function() {
            $.datepicker.setDefaults({
                minDate: 'now',
                maxDate: new Date().getDate() + 365,
            });
        };

        Form.prototype.handleEvents = function(eventForm, apiUrl) {
            this.initDateEvents();

            $(eventForm).on(
                'submit',
                function(e) {
                    e.preventDefault();

                    var fileInput = eventForm.find('#image_input'),
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

                    $('[event-submit__error]', eventForm).addClass('u-display--none');
                    let noticeSuccess = $('[event-submit__success]', eventForm);
                    noticeSuccess[0].querySelector('[id^="notice__text__"]').innerHTML = 'Skickar...';
                    $('[event-submit__success]', eventForm).removeClass('u-display--none');

                    // Upload media first and append it to the post.
                    if (fileInput.val()) {
                        imageData.append('file', fileInput[0].files[0]);
                        $.when(this.submitImageAjax(eventForm, imageData)).then(function(
                            response,
                            textStatus
                        ) {
                            if (response.success) {
                                formData['featured_media'] = response.data;
                                Form.prototype.submitAjax(eventForm, formData, 'submit_event');
                            } else {
                                $('[event-submit__success]', eventForm).addClass('u-display--none');
                                let noticeSuccess = $('[event-submit__error]', eventForm);
                                noticeSuccess[0].querySelector('[id^="notice__text__"]').innerHTML = eventIntegrationFront.something_went_wrong;
                                $('[event-submit__error]', eventForm).removeClass('u-display--none');
                            }
                        });
                        // Submit post if media is not set
                    } else {
                        this.submitAjax(eventForm, organizerData, 'submit_organizer').then(function(response) {
                            
                            if(response.success) {
                                formData['organizers'] = [{
                                    organizer: response.data.id,
                                    main_organizer: true
                                }];
                                formData['contact_phone'] = response.data.phone;
                                formData['contact_email'] = response.data.email;
                            }
                            
                        }).then(function() {
                            
                            Form.prototype.submitAjax(eventForm, locationData, 'submit_location').then((response) => {
                                if(response.success) {
                                   formData['location'] = response.data.id;
                                }

                                Form.prototype.submitAjax(eventForm, formData, 'submit_event');
                            }); 
                        }) 
                    }
                }.bind(this)
            );

            // Show image approval terms
            $('.img-button', eventForm).click(function(e) {
                e.preventDefault();
                $('.image-box', eventForm).hide();
                $('.image-approve', eventForm).fadeIn();
            });

            // Show uploader if terms is approved
            $('input[name=approve]', eventForm).change(function() {
                var firstCheck = $('input:checkbox[id=first-approve]:checked', eventForm).length > 0;
                var radioCheck = $('input:radio[name=approve]:checked').val();
                var secondCheck = $('input:checkbox[id=second-approve]:checked', eventForm).length > 0;
            if ((firstCheck && radioCheck == 0) || (firstCheck && secondCheck)) {
                    $('.image-approve', eventForm).hide();
                    $('.image-upload', eventForm).fadeIn();
                }
            });

            $('input:radio[name=approve]').change(function () {
            if (this.value == 1) {
                $('#persons-approve').removeClass('hidden');
            } else {
                $('#persons-approve').addClass('hidden');
            }
            });

            // Show/hide occasion and reccuring occasion rules. And add required fields.
            $('input:radio[name=occurance-type]', eventForm).change(function(event) {
                var id = $(this).data('id');
                $('#' + id)
                    .children('.form-group .box')
                    .show()
                    .find('input')
                    .prop('required', true);
                $('#' + id)
                    .siblings('.event-occasion')
                    .children('.box')
                    .hide()
                    .find('input')
                    .prop('required', false);
            });

            // Show/hide inputs for new and excisting organizer.
            $('input:radio[name=organizer-type]', eventForm).change(function(event) {
                $('#new-organizer').toggle();
                $('#excisting-organizer').toggle();

                Form.prototype.toggleRequired($('#new-organizer').find('input'));
            });

            // Show/hide inputs for new and excisting organizer.
            $('input:radio[name=location-type]', eventForm).change(function(event) {
                $('#new-location').toggle();
                $('#excisting-location').toggle();      
                
                Form.prototype.toggleRequired($('#new-location').find('input'));                
            });

            // Add new occurance
            $('.add-occurance', eventForm).click(
                function(event) {
                    event.preventDefault();
                    var $occuranceGroup = $(event.target)
                            .parent()
                            .prev('[class*=occurance-group]'),
                        $duplicate = $occuranceGroup
                            .clone()
                            .find('input')
                            .val('')
                            .removeClass('hasDatepicker')
                            .removeAttr('id')
                            .end()
                            .insertAfter($occuranceGroup)
                            // .find('.datepicker')
                            // .datepicker()
                            .end();

                    // Re init date events
                    this.initDateEvents();

                    if ($('.remove-occurance', $duplicate).length === 0) {
                        var $removeButton = $(
                            '<div class="form-group"><button class="btn btn btn-sm remove-occurance"><i class="pricon pricon-minus-o"></i> Ta bort</button></div>'
                        );
                        $duplicate.append($removeButton);
                    }
                }.bind(this)
            );

            // Remove occurance
            $(document).on('click', '.remove-occurance', function(e) {
                e.preventDefault();
                $(this)
                    .closest('[class*=occurance-group]')
                    .remove();
            });
        };

        Form.prototype.toggleRequired = function(inputs) {
            inputs.each((index, element) => {
                if($(element).prop('required')) {
                    $(element).removeAttr('required');
                } else {
                    $(element).prop('required', true);
                }
            });
        }

        // Clean up form
        Form.prototype.cleanForm = function(eventForm) {
            $(':input', eventForm)
                .not(':button, :submit, :reset, :hidden, select')
                .val('')
                .removeAttr('selected');
        };

        // Format date and time
        Form.prototype.formatDate = function(date, hh, mm) {
            var dateTime = '';

            //Format from datepicker (dd/mm/yyyy) to wp format (yyyy-mm-dd)
            if(date.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
                let dateExploded = date.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/)

                // Pads date with 0 eg. 06 for june 
                dateExploded[2] = dateExploded[2].padStart(2,'0')
                dateExploded[1] = dateExploded[1].padStart(2,'0')

                //YYYY-MM-DD
                date = `${dateExploded[3]}-${dateExploded[2]}-${dateExploded[1]}`
            }

            if (this.isValidDate(date) && hh && mm) {
                dateTime = date + ' ' + hh.padStart(2,'0') + ':' + mm.padStart(2,'0') + ':00';
            }
            return dateTime;
        };

        // Check valid date format
        Form.prototype.isValidDate = function(dateString) {
            var regEx = /^\d{4}-\d{2}-\d{2}$/;
            return dateString.match(regEx) != null;
        };

        return new Form();
    })(jQuery);

})();