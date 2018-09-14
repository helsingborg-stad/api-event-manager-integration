"use strict";

// Init submit event form
EventManagerIntegration = EventManagerIntegration || {};
EventManagerIntegration.Event = EventManagerIntegration.Event || {};

EventManagerIntegration.Event.Form = (function ($) {

    function Form() {
        $(".submit-event").each(function (index, eventForm) {
            var apiUrl = eventintegration.apiurl;
            apiUrl = apiUrl.replace(/\/$/, '');

            $('#recurring-event', eventForm).children('.box').hide();
            this.handleEvents($(eventForm), apiUrl);
            this.hyperformExtensions(eventForm);

            if (document.getElementById('location') !== null) {
                this.loadPostType($(eventForm), apiUrl, 'location');
            }
            if (document.getElementById('organizer') !== null) {
                this.loadPostType($(eventForm), apiUrl, 'organizer');
            }
            if (document.getElementById('user_groups') !== null) {
                this.loadTaxonomy($(eventForm), apiUrl, 'user_groups');
            }
            if (document.getElementById('event_categories') !== null) {
                this.loadTaxonomy($(eventForm), apiUrl, 'event_categories');
            }
        }.bind(this));
    }

    /**
     * Add custom validations with Hyperform
     */
    Form.prototype.hyperformExtensions = function (eventForm) {
        // Match email addresses
        hyperform.addValidator(
            eventForm.submitter_repeat_email,
            function (element) {
                var valid = element.value === eventForm.submitter_email.value;
                element.setCustomValidity(valid ? '' : eventIntegrationFront.email_not_matching);

                return valid;
            }
        );
    };

    // Get taxonomies from API and add to select box
    Form.prototype.loadTaxonomy = function (eventForm, resource, taxonomy) {
        resource += '/' + taxonomy + '?_jsonp=' + taxonomy + '&per_page=100';
        var select = document.getElementById(taxonomy);

        $.ajax({
            type: "GET",
            url: resource,
            cache: false,
            dataType: "jsonp",
            jsonpCallback: taxonomy,
            crossDomain: true,
            success: function (response) {
                // Clear select
                $(select).html('');
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
            }
        });
    };

    Form.prototype.addOption = function (taxonomy, select, depth) {
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

    TreeNode.comparer = function (a, b) {
        return a.data.name < b.data.name ? 0 : 1;
    };

    TreeNode.prototype.sortRecursive = function () {
        this.children.sort(Form.prototype.comparer);
        for (var i = 0, l = this.children.length; i < l; i++) {
            this.children[i].sortRecursive();
        }
        return this;
    };

    // List taxonomy objects hierarchical
    Form.prototype.hierarchicalTax = function (data) {
        var nodeById = {}, i = 0, l = data.length, node;

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
    Form.prototype.loadPostType = function (eventForm, resource, postType) {
        resource += '/' + postType + '/complete?_jsonp=get' + postType;
        new autoComplete({
            selector: '#' + postType + '-selector',
            minChars: 1,
            source: function (term, suggest) {
                term = term.toLowerCase();
                $.ajax({
                    type: "GET",
                    url: resource,
                    cache: false,
                    dataType: "jsonp",
                    jsonpCallback: 'get' + postType,
                    crossDomain: true,
                    success: function (response) {
                        var suggestions = [];
                        $(response).each(function (index, item) {
                            if (~(item.title).toLowerCase().indexOf(term))
                                suggestions.push([item.title, item.id, postType]);
                        });
                        suggest(suggestions);
                    }
                });
            },
            renderItem: function (item, search) {
                search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                var re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
                return '<div class="autocomplete-suggestion" data-type="' + item[2] + '" data-langname="' + item[0] + '" data-lang="' + item[1] + '" data-val="' + search + '"> ' + item[0].replace(re, "<b>$1</b>") + '</div>';
            },
            onSelect: function (e, term, item) {
                $('#' + item.getAttribute('data-type') + '-selector').val(item.getAttribute('data-langname'));
                $('#' + item.getAttribute('data-type')).val(item.getAttribute('data-lang'));
            }
        });
    };

    // Save+format input data and return as object
    Form.prototype.jsonData = function (form) {
        var arrData = form.serializeArray(),
            objData = {},
            groups = [],
            categories = [];

        $.each(arrData, function (index, elem) {
            switch (elem.name) {
                case 'user_groups':
                    groups = $.map(elem.value.split(','), function (value) {
                        return parseInt(value, 10);
                    });
                    break;
                case 'event_categories':
                    categories.push(parseInt(elem.value));
                    break;
                default:
                    objData[elem.name] = elem.value;
            }
        });

        // Occasion
        objData['occasions'] = [];
        $('.occurance-group-single', form).each(function (index) {
            var startDate = Form.prototype.formatDate($('[name="start_date"]', this).val(), $('[name="start_time_h"]', this).val(), $('[name="start_time_m"]', this).val());
            var endDate = Form.prototype.formatDate($('[name="end_date"]', this).val(), $('[name="end_time_h"]', this).val(), $('[name="end_time_m"]', this).val());

            if (startDate && endDate) {
                objData['occasions'].push({
                    "start_date": startDate,
                    "end_date": endDate,
                    "status": "scheduled",
                    "content_mode": "master"
                });
            }
        });

        // Recurring occasions
        objData['rcr_rules'] = [];
        $('.occurance-group-recurring', form).each(function (index) {
            var rcrStartH = $('[name="recurring_start_h"]', this).val(),
                rcrStartM = $('[name="recurring_start_m"]', this).val();
            var rcrStartTime = (rcrStartH && rcrStartM) ? Form.prototype.addZero(rcrStartH) + ":" + Form.prototype.addZero(rcrStartM) + ":" + "00" : false;
            var rcrEndH = $('[name="recurring_end_h"]', this).val(),
                rcrEndM = $('[name="recurring_end_m"]', this).val();
            var rcrEndTime = (rcrEndH && rcrEndM) ? Form.prototype.addZero(rcrEndH) + ":" + Form.prototype.addZero(rcrEndM) + ":" + "00" : false;
            var rcrStartDate = (Form.prototype.isValidDate($('[name="recurring_start_d"]', this).val())) ? $('[name="recurring_start_d"]', this).val() : false;
            var rcrEndDate = (Form.prototype.isValidDate($('[name="recurring_end_d"]', this).val())) ? $('[name="recurring_end_d"]', this).val() : false;
            if (rcrStartTime && rcrEndTime && rcrStartDate && rcrEndDate) {
                objData['rcr_rules'].push({
                    'rcr_week_day': $('[name="weekday"]', this).val(),
                    'rcr_weekly_interval': $('[name="weekly_interval"]', this).val(),
                    'rcr_start_time': rcrStartTime,
                    'rcr_end_time': rcrEndTime,
                    'rcr_start_date': rcrStartDate,
                    'rcr_end_date': rcrEndDate,
                });
            }
        });

        if ($('#organizer', form).val()) {
            objData['organizers'] = [{
                "organizer": $(form).find("#organizer").val(),
                "main_organizer": true
            }];
        }
        objData['user_groups'] = groups;
        objData['event_categories'] = categories;

        return objData;
    };

    // Send Ajax request with media data
    Form.prototype.submitImageAjax = function (eventForm, imageData) {
        imageData.append('action', 'submit_image');
        return $.ajax({
            url: eventintegration.ajaxurl,
            type: "POST",
            cache: false,
            contentType: false,
            processData: false,
            data: imageData,
            error: function (jqXHR, textStatus) {
                console.log(textStatus);
            }
        });
    };

    // Send Ajax request with post data
    Form.prototype.submitEventAjax = function (eventForm, formData) {
        $.ajax({
            url: eventintegration.ajaxurl,
            type: "POST",
            data: {
                action: "submit_event",
                data: formData
            },
            success: function (response) {
                if (response.success) {
                    $('.submit-success', eventForm).removeClass('hidden');
                    $('.submit-success .success', eventForm).empty().append('<i class="fa fa-send"></i>Evenemanget har skickats!</li>');
                    Form.prototype.cleanForm(eventForm);
                } else {
                    console.log(response.data);
                    $('.submit-success', eventForm).addClass('hidden');
                    $('.submit-error', eventForm).removeClass('hidden');
                    $('.submit-error .warning', eventForm).empty().append('<i class="fa fa-warning"></i>' + response.data + '</li>');
                }
            },
            error: function (jqXHR, textStatus) {
                $('.submit-success', eventForm).addClass('hidden');
                $('.submit-error', eventForm).removeClass('hidden');
                $('.submit-error .warning', eventForm).empty().append('<i class="fa fa-warning"></i>' + textStatus + '</li>');
            }
        });
    };

    Form.prototype.endHourChange = function (event) {
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

    Form.prototype.endMinuteChange = function (event) {
        var wrapper = event.target.closest('.occurrence');
        if (wrapper) {
            var startDate = wrapper.querySelector('input[name="start_date"]').value,
                endDate = wrapper.querySelector('input[name="end_date"]').value,
                startTimeH = wrapper.querySelector('input[name="start_time_h"]').value,
                endTimeH = wrapper.querySelector('input[name="end_time_h"]').value,
                startTimeM = wrapper.querySelector('input[name="start_time_m"]').value;

            if ((startDate >= endDate) && (startTimeH >= endTimeH)) {
                startTimeM = parseInt(startTimeM) + 10;
                if (startTimeM >= 60) {
                    wrapper.querySelector('input[name="end_time_h"]').setAttribute('min', parseInt(startTimeH) + 1);
                } else {
                    event.target.setAttribute('min', startTimeM);
                }
            } else {
                event.target.setAttribute('min', 0);
            }
        }
    };

    Form.prototype.datePickerSettings = function () {
        $('.hasDatepicker', '.submit-event').datepicker('option', {
            minDate: 'now',
            maxDate: new Date().getDate() + 365
        });
    };

    Form.prototype.initPickerEvent = function () {
        var elements = document.querySelectorAll('input[name="start_date"]');
        Array.from(elements).forEach(function (element) {
            element.onchange = function (e) {
                if (e.target.value) {
                    var wrapper = e.target.closest('.occurrence');
                    $(wrapper).find('input[name="end_date"]').datepicker('option', 'minDate', new Date(e.target.value));
                }
            }.bind(this);
        }.bind(this));
    };

    Form.prototype.initEndHourEvent = function () {
        var elements = document.querySelectorAll('input[name="end_time_h"]');
        Array.from(elements).forEach(function (element) {
            element.onchange = this.endHourChange;
        }.bind(this));
    };

    Form.prototype.initEndMinuteEvent = function () {
        var elements = document.querySelectorAll('input[name="end_time_m"]');
        Array.from(elements).forEach(function (element) {
            element.onchange = this.endMinuteChange;
        }.bind(this));
    };

    Form.prototype.initRecurringEndHourEvent = function () {
        var elements = document.querySelectorAll('input[name="recurring_end_h"]');
        Array.from(elements).forEach(function (element) {
            element.onchange = function (event) {
                var wrapper = event.target.closest('.occurrence');
                if (wrapper) {
                    var startTimeH = wrapper.querySelector('input[name="recurring_start_h"]').value;
                    event.target.setAttribute('min', startTimeH);
                }
            };
        }.bind(this));
    };

    Form.prototype.initRecurringEndMinuteEvent = function () {
        var elements = document.querySelectorAll('input[name="recurring_end_m"]');
        Array.from(elements).forEach(function (element) {
            element.onchange = function (event) {
                var wrapper = event.target.closest('.occurrence');
                if (wrapper) {
                    var startTimeH = wrapper.querySelector('input[name="recurring_start_h"]').value;
                    var endTimeH = wrapper.querySelector('input[name="recurring_end_h"]').value;
                    var startTimeM = wrapper.querySelector('input[name="recurring_start_m"]').value;

                    if (startTimeH >= endTimeH) {
                        startTimeM = parseInt(startTimeM) + 10;
                        if (startTimeM >= 60) {
                            wrapper.querySelector('input[name="recurring_end_h"]').setAttribute('min', parseInt(startTimeH) + 1);
                        } else {
                            event.target.setAttribute('min', startTimeM);
                        }
                    } else {
                        event.target.setAttribute('min', 0);
                    }
                }
            };
        }.bind(this));
    };

    Form.prototype.initDateEvents = function () {
        this.datePickerSettings();

        // Single occasions events
        this.initPickerEvent();
        this.initEndHourEvent();
        this.initEndMinuteEvent();

        // Recurring date events
        this.initRecurringEndHourEvent();
        this.initRecurringEndMinuteEvent();
    };

    Form.prototype.handleEvents = function (eventForm, apiUrl) {
        this.initDateEvents();

        $(eventForm).on('submit', function (e) {
            e.preventDefault();

            var fileInput = eventForm.find('#image_input'),
                formData = this.jsonData(eventForm),
                imageData = new FormData();

            $('.submit-error', eventForm).addClass('hidden');
            $('.submit-success', eventForm).removeClass('hidden');
            $('.submit-success .success', eventForm).empty().append('<i class="fa fa-send"></i>Skickar...</li>');

            // Upload media first and append it to the post.
            if (fileInput.val()) {
                imageData.append('file', fileInput[0].files[0]);
                $.when(this.submitImageAjax(eventForm, imageData))
                    .then(function (response, textStatus) {
                        if (response.success) {
                            formData['featured_media'] = response.data;
                            Form.prototype.submitEventAjax(eventForm, formData);
                        } else {
                            $('.submit-success', eventForm).addClass('hidden');
                            $('.submit-error', eventForm).removeClass('hidden');
                            $('.submit-error .warning', eventForm).empty().append('<i class="fa fa-warning"></i>' + eventIntegrationFront.something_went_wrong + '</li>');
                        }
                    });
                // Submit post if media is not set
            } else {
                this.submitEventAjax(eventForm, formData);
            }
        }.bind(this));

        // Show image approval terms
        $('.img-button', eventForm).click(function (e) {
            e.preventDefault();
            $('.image-box', eventForm).hide();
            $('.image-approve', eventForm).fadeIn();
        });

        // Show uploader if terms is approved
        $('input[name=approve]', eventForm).change(function () {
            var firstCheck = $('input:checkbox[id=first-approve]:checked', eventForm).length > 0,
                secondCheck = $('input:checkbox[id=second-approve]:checked', eventForm).length > 0;
            if (firstCheck && secondCheck) {
                $('.image-approve', eventForm).hide();
                $('.image-upload', eventForm).fadeIn();
            }
        });

        // Show/hide occasion and reccuring occasion rules. And add required fields.
        $('input:radio[name=occurance-type]', eventForm).change(function (event) {
            var id = $(this).data('id');
            $('#' + id).children('.form-group .box').show().find('input').prop('required', true);
            $('#' + id).siblings('.event-occasion').children('.box').hide().find('input').prop('required', false);
        });

        // Add new occurance
        $('.add-occurance', eventForm).click(function (event) {
            event.preventDefault();
            var $occuranceGroup = $(event.target).parent().prev('[class*=occurance-group]'),
                $duplicate = $occuranceGroup.clone().find('input').val('')
                    .removeClass('hasDatepicker')
                    .removeAttr('id').end()
                    .insertAfter($occuranceGroup)
                    .find('.datepicker').datepicker().end();

            // Re init date events
            this.initDateEvents();

            if ($('.remove-occurance', $duplicate).length === 0) {
                var $removeButton = $('<div class="form-group"><button class="btn btn btn-sm remove-occurance"><i class="pricon pricon-minus-o"></i> Ta bort</button></div>');
                $duplicate.append($removeButton);
            }

        }.bind(this));

        // Remove occurance
        $(document).on('click', '.remove-occurance', function (e) {
            e.preventDefault();
            $(this).closest('[class*=occurance-group]').remove();
        });
    };

    // Clean up form
    Form.prototype.cleanForm = function (eventForm) {
        $(':input', eventForm)
            .not(':button, :submit, :reset, :hidden, select')
            .val('')
            .removeAttr('selected');
    };

    // Format date and time
    Form.prototype.formatDate = function (date, hh, mm) {
        var dateTime = "";
        if (this.isValidDate(date) && hh && mm) {
            dateTime = date + "T" + this.addZero(hh) + ":" + this.addZero(mm) + ":" + "00";
        }
        return dateTime;
    };

    // Check valid date format
    Form.prototype.isValidDate = function (dateString) {
        var regEx = /^\d{4}-\d{2}-\d{2}$/;
        return dateString.match(regEx) != null;
    };

    // Prefix with zero
    Form.prototype.addZero = function (i) {
        if (i.toString().length === 1) {
            i = "0" + i;
        }
        return i;
    };

    return new Form();
})(jQuery);
