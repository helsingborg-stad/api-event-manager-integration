'use strict';

EventManagerIntegration = EventManagerIntegration || {};
EventManagerIntegration.Event = EventManagerIntegration.Event || {};

EventManagerIntegration.Event.Map = (function() {

    function Map() {
        if (typeof google === 'object' && typeof google.maps === 'object') {
            this.init();
        }
    }

    Map.prototype.init = function() {
        var mapElement,
            position,
            mapOptions,
            map,
            marker,
            infowindow,
            locationTitle;

        mapElement = document.getElementById('event-map');

        if (!mapElement) {
            return;
        }

        position = {
            lat: parseFloat(mapElement.getAttribute('data-lat')),
            lng: parseFloat(mapElement.getAttribute('data-lng'))
        };

        mapOptions = {
            zoom: 15,
            center: position,
            disableDefaultUI: false
        };

        map = new google.maps.Map(mapElement, mapOptions);
        locationTitle = mapElement.getAttribute('data-title') ? mapElement.getAttribute('data-title') : '';

        infowindow = new google.maps.InfoWindow({
            content: '<b>' + locationTitle + '</b>'
        });

        marker = new google.maps.Marker({
            position: position,
            map: map
        });

        if (locationTitle) {
            marker.addListener('click', function() {
                infowindow.open(map, marker);
            });
        }
    };

    return new Map();
})();

// Init
var EventManagerIntegration = {};

// Init event pagination
EventManagerIntegration = EventManagerIntegration || {};
EventManagerIntegration.Event = EventManagerIntegration.Event || {};

EventManagerIntegration.Event.Module = (function ($) {

    function Module() {
        $(function() {
        	this.initEventPagination();
        }.bind(this));
    }

    // Load pagination bar to event modules
    Module.prototype.initEventPagination = function () {
    	$(".modularity-mod-event").each(function( key, value ) {
    		var moduleId 	= $(this).find('[data-module-id]').attr('data-module-id');
    		var pages 	 	= $(this).find('.module-pagination').attr('data-pages');
    		var showArrows 	= $(this).find('.module-pagination').attr('data-show-arrows');
    		var module   	= $(this);

		    $(this).find('.module-pagination').pagination({
		    	pages: pages,
		    	displayedPages: 4,
		        edges: 0,
		        cssStyle: '',
		        ellipsePageSet: false,
		        prevText: (showArrows) ? '&laquo;' : '',
		        nextText: (showArrows) ? '&raquo;' : '',
		       	currentPage: 1,
		       	selectOnClick: false,
		        onPageClick: function(page, event) {
		        	Module.prototype.loadEvents(page, moduleId, module);
		        	$(module).find('.module-pagination').pagination('redraw');
		        	$(module).find('.pagination a:not(.current)').each(function() {
						$(this).parent().addClass('disabled temporary');
					});
		        },
		    });
		});
    };

    // Get event list with Ajax on pagination click
    Module.prototype.loadEvents = function (page, moduleId, module) {
		var height 	  = $(module).find('.event-module-content').height();
	    var windowTop = $(window).scrollTop();
	    var moduleTop = $(module).offset().top;

		$.ajax({
			url: eventintegration.ajaxurl,
			type: 'post',
			data: {
				action: 'ajax_pagination',
				page: page,
				id: moduleId
			},
			beforeSend: function() {
				$(module).find('.event-module-list').remove();
				$(module).find('.event-module-content').append('<div class="event-loader"><div class="loading-wrapper"><div class="loading"><div></div><div></div><div></div><div></div></div></div></div>');
				$(module).find('.event-loader').height(height);
			    if (moduleTop < windowTop) {
					$('html, body').animate({
			        scrollTop: moduleTop
			    	}, 100);
				}
			},
			success: function(html) {
				$(module).find('.event-module-content').append(html).hide().fadeIn(80).height('auto');
			},
			error: function() {
				$(module).find('.event-module-content').append('<ul class="event-module-list"><li><p>' + eventIntegrationFront.event_pagination_error + '</p></li></ul>').hide().fadeIn(80).height('auto');
			},
			complete: function() {
				$(module).find('.event-loader').remove();
				$(module).find('.pagination .temporary').each(function() {
					$(this).removeClass('disabled temporary');
				});
			},

		})
	};

	return new Module();
})(jQuery);

'use strict';

// Init submit event form
EventManagerIntegration = EventManagerIntegration || {};
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
                this.handleEvents($(eventForm), apiUrl);
                this.hyperformExtensions(eventForm);
                this.datePickerSettings();

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
                var taxonomies = Form.prototype.hierarchicalTax(response);
                // Add select option and it's children taxonomies
                $(taxonomies.children).each(function(index, tax) {
                    // Parent option
                    Form.prototype.addOption(tax, select, '');
                    $(tax.children).each(function(index, tax) {
                        // Children option
                        Form.prototype.addOption(tax, select, ' – ');
                        $(tax.children).each(function(index, tax) {
                            // Grand children options
                            Form.prototype.addOption(tax, select, ' – – ');
                        });
                    });
                });
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
            selector: '#' + postType + '-selector',
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
                                suggestions.push([item.title, item.id, postType]);
                        });
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
                    '"> ' +
                    item[0].replace(re, '<b>$1</b>') +
                    '</div>'
                );
            },
            onSelect: function(e, term, item) {
                $('#' + item.getAttribute('data-type') + '-selector').val(
                    item.getAttribute('data-langname')
                );
                $('#' + item.getAttribute('data-type')).val(item.getAttribute('data-lang'));
            },
        });
    };

    // Save+format input data and return as object
    Form.prototype.jsonData = function(form) {
        var arrData = form.serializeArray(),
            objData = {},
            groups = [],
            categories = [];

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
                    ? Form.prototype.addZero(rcrStartH) +
                      ':' +
                      Form.prototype.addZero(rcrStartM) +
                      ':' +
                      '00'
                    : false;
            var rcrEndH = $('[name="recurring_end_h"]', this).val(),
                rcrEndM = $('[name="recurring_end_m"]', this).val();
            var rcrEndTime =
                rcrEndH && rcrEndM
                    ? Form.prototype.addZero(rcrEndH) +
                      ':' +
                      Form.prototype.addZero(rcrEndM) +
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
    Form.prototype.submitEventAjax = function(eventForm, formData) {
        $.ajax({
            url: eventintegration.ajaxurl,
            type: 'POST',
            data: {
                action: 'submit_event',
                data: formData,
            },
            success: function(response) {
                if (response.success) {
                    $('.submit-success', eventForm).removeClass('hidden');
                    $('.submit-success .success', eventForm)
                        .empty()
                        .append('<i class="fa fa-send"></i>Evenemanget har skickats!</li>');
                    Form.prototype.cleanForm(eventForm);
                } else {
                    console.log(response.data);
                    $('.submit-success', eventForm).addClass('hidden');
                    $('.submit-error', eventForm).removeClass('hidden');
                    $('.submit-error .warning', eventForm)
                        .empty()
                        .append('<i class="fa fa-warning"></i>' + response.data + '</li>');
                }
            },
            error: function(jqXHR, textStatus) {
                $('.submit-success', eventForm).addClass('hidden');
                $('.submit-error', eventForm).removeClass('hidden');
                $('.submit-error .warning', eventForm)
                    .empty()
                    .append('<i class="fa fa-warning"></i>' + textStatus + '</li>');
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
                    imageData = new FormData();

                $('.submit-error', eventForm).addClass('hidden');
                $('.submit-success', eventForm).removeClass('hidden');
                $('.submit-success .success', eventForm)
                    .empty()
                    .append('<i class="fa fa-send"></i>Skickar...</li>');

                // Upload media first and append it to the post.
                if (fileInput.val()) {
                    imageData.append('file', fileInput[0].files[0]);
                    $.when(this.submitImageAjax(eventForm, imageData)).then(function(
                        response,
                        textStatus
                    ) {
                        if (response.success) {
                            formData['featured_media'] = response.data;
                            Form.prototype.submitEventAjax(eventForm, formData);
                        } else {
                            $('.submit-success', eventForm).addClass('hidden');
                            $('.submit-error', eventForm).removeClass('hidden');
                            $('.submit-error .warning', eventForm)
                                .empty()
                                .append(
                                    '<i class="fa fa-warning"></i>' +
                                        eventIntegrationFront.something_went_wrong +
                                        '</li>'
                                );
                        }
                    });
                    // Submit post if media is not set
                } else {
                    this.submitEventAjax(eventForm, formData);
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
            var firstCheck = $('input:checkbox[id=first-approve]:checked', eventForm).length > 0,
                secondCheck = $('input:checkbox[id=second-approve]:checked', eventForm).length > 0;
            if (firstCheck && secondCheck) {
                $('.image-approve', eventForm).hide();
                $('.image-upload', eventForm).fadeIn();
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
                        .find('.datepicker')
                        .datepicker()
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
        if (this.isValidDate(date) && hh && mm) {
            dateTime = date + ' ' + this.addZero(hh) + ':' + this.addZero(mm) + ':00';
        }
        return dateTime;
    };

    // Check valid date format
    Form.prototype.isValidDate = function(dateString) {
        var regEx = /^\d{4}-\d{2}-\d{2}$/;
        return dateString.match(regEx) != null;
    };

    // Prefix with zero
    Form.prototype.addZero = function(i) {
        if (i.toString().length === 1) {
            i = '0' + i;
        }
        return i;
    };

    return new Form();
})(jQuery);

"use strict";

//Init event widget
EventManagerIntegration = EventManagerIntegration || {};
EventManagerIntegration.Widget = EventManagerIntegration.Widget || {};

//Component
EventManagerIntegration.Widget.TemplateParser = (function ($) {
    var date                = new Date();
    var dd                  = date.getDate();
    var mm                  = date.getMonth()+1;
    var year                = date.getFullYear();
    var months              = ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];

    var template            = {};
    var errorTemplate       = {};

    function TemplateParser() {
        this.init();
    }

    TemplateParser.prototype.init = function () {
        $(".event-api").each(function(index,module){
            var dataApiurl          = ($(module).attr('data-apiurl'));
                dataApiurl          = dataApiurl.replace(/\/$/, "");
                dataApiurl          = dataApiurl + '/event/time?start=' + year + '-' + mm + '-' + dd + '&end=' + (year+1) + '-' + mm + '-' + dd;
            var dataLimit           = ($(module).attr('post-limit'));
            var dataGroupId         = ($(module).attr('group-id'));
            var dataCategoryId      = ($(module).attr('category-id'));
            var latlng              = ($(module).attr('latlng'));
            var distance            = ($(module).attr('distance'));

            var apiUrl = (typeof dataLimit != 'undefined' && $.isNumeric(dataLimit)) ? dataApiurl + '&post-limit=' + dataLimit : dataApiurl + '&post-limit=' + 10;
                apiUrl += (typeof dataGroupId != 'undefined' && dataGroupId) ? '&group-id=' + dataGroupId : '';
                apiUrl += (typeof dataCategoryId != 'undefined' && dataCategoryId) ? '&category-id=' + dataCategoryId : '';
                apiUrl += (typeof latlng != 'undefined' && latlng) ? '&latlng=' + latlng : '';
                apiUrl += (typeof distance != 'undefined' && distance) ? '&distance=' + distance : '';
                apiUrl += '&_jsonp=getevents';
            this.storeErrorTemplate($(module));
            this.storeTemplate($(module));
            this.storeModalTemplate($(module));
            this.loadEvent($(module),apiUrl);
        }.bind(this));
    };

    TemplateParser.prototype.storeTemplate = function (module) {
        module.data('template',$('.template',module).html());
        module.find('.template').remove();
    };

    TemplateParser.prototype.storeErrorTemplate = function (module) {
        module.data('error-template',$('.error-template',module).html());
        module.find('.error-template').remove();
    };

    TemplateParser.prototype.storeModalTemplate = function (module) {
        module.data('modal-template',$('.modal-template',module).html());
        module.find('.modal-template').remove();
    };

    TemplateParser.prototype.loadEvent = function(module, resource) {
        $.ajax({
            type: "GET",
            url: resource,
            cache: false,
            dataType: "jsonp",
            jsonpCallback: 'getevents',
            crossDomain: true,
            success: function( response ) {
                //Store response on module
                module.data('json-response', response);

                //Clear target div
                TemplateParser.prototype.clear(module);

                $(response).each(function(index,event){

                    // Get the correct occasion
                    var eventOccasion = "";
                    $.each(event.occasions, function(occationindex,occation) {
                        if (typeof occation.current_occasion != 'undefined' && occation.current_occasion == true) {
                            eventOccasion = occation;
                            return false;
                        }
                    });

                    var occasionDate    = new Date(eventOccasion.start_date);

                    //Load template data
                    var moduleTemplate  = module.data('template');

                    //Replace with values
                    moduleTemplate      = moduleTemplate.replace('{event-id}', event.id);
                    moduleTemplate      = moduleTemplate.replace('{event-occasion}', occasionDate.getDate() + '<div class="clearfix"></div>' + months[occasionDate.getMonth()]);
                    moduleTemplate      = moduleTemplate.replace('{event-title}', '<p class="link-item">' + event.title.rendered + '</p>');

                    //Append
                    module.append(moduleTemplate);
                });
                //bind click
                TemplateParser.prototype.click(module);
            },
            error: function( response ) {
                TemplateParser.prototype.clear(module);
                module.html(module.data('error-template'));
            }
        });


    };

    TemplateParser.prototype.clear = function(module){
        jQuery(module).html('');
    };

    TemplateParser.prototype.addZero = function (i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    };

    TemplateParser.prototype.click = function(module){

        jQuery("li a",module).on('click',{},function(e){

            var eventId = jQuery(e.target).closest("a.modal-event").data('event-id');

            $.each(module.data('json-response'), function(index,object) {

                if(object.id == eventId) {

                    // Main modal
                    var modalTemplate = module.data('modal-template');
                        modalTemplate = modalTemplate.replace('{event-modal-title}', object.title.rendered);
                        modalTemplate = modalTemplate.replace('{event-modal-content}', (object.content.rendered != null) ? object.content.rendered : '');
                        modalTemplate = modalTemplate.replace('{event-modal-link}', (object.event_link != null) ? '<p><a href="' + object.event_link + '" target="_blank">' + object.event_link + '</a></p>' : '');
                        modalTemplate = modalTemplate.replace('{event-modal-image}', (object.featured_media != null) ? '<img src=' + object.featured_media.source_url + ' alt="' + object.title.rendered + '" style="display:block; width:100%;">' : '');
                        // Occations accordion section
                        var modalOccationResult = "";
                        $.each(object.occasions, function(occationindex,occation) {
                            // Format start and end date
                            var d = new Date(occation.start_date);
                            var start = this.addZero(d.getDate()) + ' ' + months[d.getMonth()] + ' ' + d.getFullYear() + ' kl. ' + this.addZero(d.getHours()) + ':' + this.addZero(d.getMinutes());

                            var e = new Date(occation.end_date);
                            var end = "";
                            if (e.getDate() === d.getDate()) {
                                end = 'kl. ' + this.addZero(e.getHours()) + ':' + this.addZero(e.getMinutes());
                            } else {
                                end = e.getDate() + ' ' + months[e.getMonth()] + ' ' + e.getFullYear() + ' kl. ' + this.addZero(e.getHours()) + ':' + this.addZero(e.getMinutes());
                            }
                            modalOccationResult = modalOccationResult + '<li class="text-sm gutter-sm gutter-vertical">' + start + ' - ' + end + '</li>';

                        }.bind(this));
                        modalTemplate = modalTemplate.replace('{event-modal-occations}','<section class="accordion-section"><input type="radio" name="active-section" id="accordion-section-1"><label class="accordion-toggle" for="accordion-section-1"><h2>Evenemanget inträffar</h2></label><div class="accordion-content"><ul id="modal-occations">' + modalOccationResult + '</ul></div></section>');
                        // Location accordion section
                        var locationData = "";
                            locationData += (object.location != null && object.location.title != null) ? '<li><strong>' + object.location.title + '</strong></li>' : '';
                            locationData += (object.location != null && object.location.street_address != null) ? '<li>' + object.location.street_address + '</li>' : '';
                            locationData += (object.location != null && object.location.postal_code != null) ? '<li>' + object.location.postal_code + '</li>' : '';
                            locationData += (object.location != null && object.location.city != null) ? '<il>' + object.location.city + '</li>' : '';
                        var location = (locationData) ? '<section class="accordion-section"><input type="radio" name="active-section" id="accordion-section-2"><label class="accordion-toggle" for="accordion-section-2"><h2>Plats</h2></label><div class="accordion-content"><ul>' + locationData + '</ul></div></section>' : '';
                        modalTemplate = modalTemplate.replace('{event-modal-location}', location);
                        // Boooking accordion section
                        var bookingData = "";
                            bookingData += (object.booking_phone != null) ? '<li>Telefon: ' + object.booking_phone + '</li>' : '';
                            bookingData += (object.price_adult != null) ? '<li>Pris: ' + object.price_adult + ' kr</li>' : '';
                            bookingData += (object.price_children != null) ? '<li>Barnpris: ' + object.price_children + ' kr</li>' : '';
                            bookingData += (object.price_senior != null) ? '<li>Pensionärspris: ' + object.price_senior + ' kr</li>' : '';
                            bookingData += (object.price_student != null) ? '<li>Studentpris: ' + object.price_student + ' kr</li>' : '';
                            bookingData += (object.age_restriction != null) ? '<li>Åldersgräns: ' + object.age_restriction + ' kr</li>' : '';
                        var membershipCards = "";
                        $.each(object.membership_cards, function(cardindex,card) {
                            membershipCards = membershipCards + '<li>' + card.post_title + '</li>';
                        }.bind(this));
                            bookingData += (membershipCards) ? '<li>&nbsp;</li><li><strong>Ingår i medlemskort</strong></li>' + membershipCards : '';
                            bookingData += (object.booking_link != null) ? '<li>&nbsp;</li><li><a href="' + object.booking_link + '" class="link-item" target="_blank">Boka bljetter här</a></li>' : '';
                        var booking = (bookingData) ? '<section class="accordion-section"><input type="radio" name="active-section" id="accordion-section-3"><label class="accordion-toggle" for="accordion-section-3"><h2>Bokning</h2></label><div class="accordion-content"><ul>' + bookingData + '</ul></div></section>' : '';
                        modalTemplate = modalTemplate.replace('{event-modal-booking}', booking);

                    $('#modal-event').remove();
                    $('body').append(modalTemplate);
                }

            }.bind(this));

        }.bind(this));

    };

    return new TemplateParser();

})(jQuery);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImV2ZW50LW1hcC5qcyIsImV2ZW50LXBhZ2luYXRpb24uanMiLCJldmVudC1zdWJtaXQuanMiLCJldmVudC13aWRnZXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImV2ZW50LWludGVncmF0aW9uLWZyb250LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5FdmVudE1hbmFnZXJJbnRlZ3JhdGlvbiA9IEV2ZW50TWFuYWdlckludGVncmF0aW9uIHx8IHt9O1xuRXZlbnRNYW5hZ2VySW50ZWdyYXRpb24uRXZlbnQgPSBFdmVudE1hbmFnZXJJbnRlZ3JhdGlvbi5FdmVudCB8fCB7fTtcblxuRXZlbnRNYW5hZ2VySW50ZWdyYXRpb24uRXZlbnQuTWFwID0gKGZ1bmN0aW9uKCkge1xuXG4gICAgZnVuY3Rpb24gTWFwKCkge1xuICAgICAgICBpZiAodHlwZW9mIGdvb2dsZSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIGdvb2dsZS5tYXBzID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBNYXAucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG1hcEVsZW1lbnQsXG4gICAgICAgICAgICBwb3NpdGlvbixcbiAgICAgICAgICAgIG1hcE9wdGlvbnMsXG4gICAgICAgICAgICBtYXAsXG4gICAgICAgICAgICBtYXJrZXIsXG4gICAgICAgICAgICBpbmZvd2luZG93LFxuICAgICAgICAgICAgbG9jYXRpb25UaXRsZTtcblxuICAgICAgICBtYXBFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2V2ZW50LW1hcCcpO1xuXG4gICAgICAgIGlmICghbWFwRWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcG9zaXRpb24gPSB7XG4gICAgICAgICAgICBsYXQ6IHBhcnNlRmxvYXQobWFwRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbGF0JykpLFxuICAgICAgICAgICAgbG5nOiBwYXJzZUZsb2F0KG1hcEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWxuZycpKVxuICAgICAgICB9O1xuXG4gICAgICAgIG1hcE9wdGlvbnMgPSB7XG4gICAgICAgICAgICB6b29tOiAxNSxcbiAgICAgICAgICAgIGNlbnRlcjogcG9zaXRpb24sXG4gICAgICAgICAgICBkaXNhYmxlRGVmYXVsdFVJOiBmYWxzZVxuICAgICAgICB9O1xuXG4gICAgICAgIG1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAobWFwRWxlbWVudCwgbWFwT3B0aW9ucyk7XG4gICAgICAgIGxvY2F0aW9uVGl0bGUgPSBtYXBFbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS10aXRsZScpID8gbWFwRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGl0bGUnKSA6ICcnO1xuXG4gICAgICAgIGluZm93aW5kb3cgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdyh7XG4gICAgICAgICAgICBjb250ZW50OiAnPGI+JyArIGxvY2F0aW9uVGl0bGUgKyAnPC9iPidcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG4gICAgICAgICAgICBwb3NpdGlvbjogcG9zaXRpb24sXG4gICAgICAgICAgICBtYXA6IG1hcFxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAobG9jYXRpb25UaXRsZSkge1xuICAgICAgICAgICAgbWFya2VyLmFkZExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGluZm93aW5kb3cub3BlbihtYXAsIG1hcmtlcik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gbmV3IE1hcCgpO1xufSkoKTtcbiIsIi8vIEluaXRcbnZhciBFdmVudE1hbmFnZXJJbnRlZ3JhdGlvbiA9IHt9O1xuXG4vLyBJbml0IGV2ZW50IHBhZ2luYXRpb25cbkV2ZW50TWFuYWdlckludGVncmF0aW9uID0gRXZlbnRNYW5hZ2VySW50ZWdyYXRpb24gfHwge307XG5FdmVudE1hbmFnZXJJbnRlZ3JhdGlvbi5FdmVudCA9IEV2ZW50TWFuYWdlckludGVncmF0aW9uLkV2ZW50IHx8IHt9O1xuXG5FdmVudE1hbmFnZXJJbnRlZ3JhdGlvbi5FdmVudC5Nb2R1bGUgPSAoZnVuY3Rpb24gKCQpIHtcblxuICAgIGZ1bmN0aW9uIE1vZHVsZSgpIHtcbiAgICAgICAgJChmdW5jdGlvbigpIHtcbiAgICAgICAgXHR0aGlzLmluaXRFdmVudFBhZ2luYXRpb24oKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICAvLyBMb2FkIHBhZ2luYXRpb24gYmFyIHRvIGV2ZW50IG1vZHVsZXNcbiAgICBNb2R1bGUucHJvdG90eXBlLmluaXRFdmVudFBhZ2luYXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgXHQkKFwiLm1vZHVsYXJpdHktbW9kLWV2ZW50XCIpLmVhY2goZnVuY3Rpb24oIGtleSwgdmFsdWUgKSB7XG4gICAgXHRcdHZhciBtb2R1bGVJZCBcdD0gJCh0aGlzKS5maW5kKCdbZGF0YS1tb2R1bGUtaWRdJykuYXR0cignZGF0YS1tb2R1bGUtaWQnKTtcbiAgICBcdFx0dmFyIHBhZ2VzIFx0IFx0PSAkKHRoaXMpLmZpbmQoJy5tb2R1bGUtcGFnaW5hdGlvbicpLmF0dHIoJ2RhdGEtcGFnZXMnKTtcbiAgICBcdFx0dmFyIHNob3dBcnJvd3MgXHQ9ICQodGhpcykuZmluZCgnLm1vZHVsZS1wYWdpbmF0aW9uJykuYXR0cignZGF0YS1zaG93LWFycm93cycpO1xuICAgIFx0XHR2YXIgbW9kdWxlICAgXHQ9ICQodGhpcyk7XG5cblx0XHQgICAgJCh0aGlzKS5maW5kKCcubW9kdWxlLXBhZ2luYXRpb24nKS5wYWdpbmF0aW9uKHtcblx0XHQgICAgXHRwYWdlczogcGFnZXMsXG5cdFx0ICAgIFx0ZGlzcGxheWVkUGFnZXM6IDQsXG5cdFx0ICAgICAgICBlZGdlczogMCxcblx0XHQgICAgICAgIGNzc1N0eWxlOiAnJyxcblx0XHQgICAgICAgIGVsbGlwc2VQYWdlU2V0OiBmYWxzZSxcblx0XHQgICAgICAgIHByZXZUZXh0OiAoc2hvd0Fycm93cykgPyAnJmxhcXVvOycgOiAnJyxcblx0XHQgICAgICAgIG5leHRUZXh0OiAoc2hvd0Fycm93cykgPyAnJnJhcXVvOycgOiAnJyxcblx0XHQgICAgICAgXHRjdXJyZW50UGFnZTogMSxcblx0XHQgICAgICAgXHRzZWxlY3RPbkNsaWNrOiBmYWxzZSxcblx0XHQgICAgICAgIG9uUGFnZUNsaWNrOiBmdW5jdGlvbihwYWdlLCBldmVudCkge1xuXHRcdCAgICAgICAgXHRNb2R1bGUucHJvdG90eXBlLmxvYWRFdmVudHMocGFnZSwgbW9kdWxlSWQsIG1vZHVsZSk7XG5cdFx0ICAgICAgICBcdCQobW9kdWxlKS5maW5kKCcubW9kdWxlLXBhZ2luYXRpb24nKS5wYWdpbmF0aW9uKCdyZWRyYXcnKTtcblx0XHQgICAgICAgIFx0JChtb2R1bGUpLmZpbmQoJy5wYWdpbmF0aW9uIGE6bm90KC5jdXJyZW50KScpLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQkKHRoaXMpLnBhcmVudCgpLmFkZENsYXNzKCdkaXNhYmxlZCB0ZW1wb3JhcnknKTtcblx0XHRcdFx0XHR9KTtcblx0XHQgICAgICAgIH0sXG5cdFx0ICAgIH0pO1xuXHRcdH0pO1xuICAgIH07XG5cbiAgICAvLyBHZXQgZXZlbnQgbGlzdCB3aXRoIEFqYXggb24gcGFnaW5hdGlvbiBjbGlja1xuICAgIE1vZHVsZS5wcm90b3R5cGUubG9hZEV2ZW50cyA9IGZ1bmN0aW9uIChwYWdlLCBtb2R1bGVJZCwgbW9kdWxlKSB7XG5cdFx0dmFyIGhlaWdodCBcdCAgPSAkKG1vZHVsZSkuZmluZCgnLmV2ZW50LW1vZHVsZS1jb250ZW50JykuaGVpZ2h0KCk7XG5cdCAgICB2YXIgd2luZG93VG9wID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuXHQgICAgdmFyIG1vZHVsZVRvcCA9ICQobW9kdWxlKS5vZmZzZXQoKS50b3A7XG5cblx0XHQkLmFqYXgoe1xuXHRcdFx0dXJsOiBldmVudGludGVncmF0aW9uLmFqYXh1cmwsXG5cdFx0XHR0eXBlOiAncG9zdCcsXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdGFjdGlvbjogJ2FqYXhfcGFnaW5hdGlvbicsXG5cdFx0XHRcdHBhZ2U6IHBhZ2UsXG5cdFx0XHRcdGlkOiBtb2R1bGVJZFxuXHRcdFx0fSxcblx0XHRcdGJlZm9yZVNlbmQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkKG1vZHVsZSkuZmluZCgnLmV2ZW50LW1vZHVsZS1saXN0JykucmVtb3ZlKCk7XG5cdFx0XHRcdCQobW9kdWxlKS5maW5kKCcuZXZlbnQtbW9kdWxlLWNvbnRlbnQnKS5hcHBlbmQoJzxkaXYgY2xhc3M9XCJldmVudC1sb2FkZXJcIj48ZGl2IGNsYXNzPVwibG9hZGluZy13cmFwcGVyXCI+PGRpdiBjbGFzcz1cImxvYWRpbmdcIj48ZGl2PjwvZGl2PjxkaXY+PC9kaXY+PGRpdj48L2Rpdj48ZGl2PjwvZGl2PjwvZGl2PjwvZGl2PjwvZGl2PicpO1xuXHRcdFx0XHQkKG1vZHVsZSkuZmluZCgnLmV2ZW50LWxvYWRlcicpLmhlaWdodChoZWlnaHQpO1xuXHRcdFx0ICAgIGlmIChtb2R1bGVUb3AgPCB3aW5kb3dUb3ApIHtcblx0XHRcdFx0XHQkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7XG5cdFx0XHQgICAgICAgIHNjcm9sbFRvcDogbW9kdWxlVG9wXG5cdFx0XHQgICAgXHR9LCAxMDApO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0c3VjY2VzczogZnVuY3Rpb24oaHRtbCkge1xuXHRcdFx0XHQkKG1vZHVsZSkuZmluZCgnLmV2ZW50LW1vZHVsZS1jb250ZW50JykuYXBwZW5kKGh0bWwpLmhpZGUoKS5mYWRlSW4oODApLmhlaWdodCgnYXV0bycpO1xuXHRcdFx0fSxcblx0XHRcdGVycm9yOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0JChtb2R1bGUpLmZpbmQoJy5ldmVudC1tb2R1bGUtY29udGVudCcpLmFwcGVuZCgnPHVsIGNsYXNzPVwiZXZlbnQtbW9kdWxlLWxpc3RcIj48bGk+PHA+JyArIGV2ZW50SW50ZWdyYXRpb25Gcm9udC5ldmVudF9wYWdpbmF0aW9uX2Vycm9yICsgJzwvcD48L2xpPjwvdWw+JykuaGlkZSgpLmZhZGVJbig4MCkuaGVpZ2h0KCdhdXRvJyk7XG5cdFx0XHR9LFxuXHRcdFx0Y29tcGxldGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkKG1vZHVsZSkuZmluZCgnLmV2ZW50LWxvYWRlcicpLnJlbW92ZSgpO1xuXHRcdFx0XHQkKG1vZHVsZSkuZmluZCgnLnBhZ2luYXRpb24gLnRlbXBvcmFyeScpLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQgdGVtcG9yYXJ5Jyk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSxcblxuXHRcdH0pXG5cdH07XG5cblx0cmV0dXJuIG5ldyBNb2R1bGUoKTtcbn0pKGpRdWVyeSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIEluaXQgc3VibWl0IGV2ZW50IGZvcm1cbkV2ZW50TWFuYWdlckludGVncmF0aW9uID0gRXZlbnRNYW5hZ2VySW50ZWdyYXRpb24gfHwge307XG5FdmVudE1hbmFnZXJJbnRlZ3JhdGlvbi5FdmVudCA9IEV2ZW50TWFuYWdlckludGVncmF0aW9uLkV2ZW50IHx8IHt9O1xuXG5FdmVudE1hbmFnZXJJbnRlZ3JhdGlvbi5FdmVudC5Gb3JtID0gKGZ1bmN0aW9uKCQpIHtcbiAgICBmdW5jdGlvbiBGb3JtKCkge1xuICAgICAgICAkKCcuc3VibWl0LWV2ZW50JykuZWFjaChcbiAgICAgICAgICAgIGZ1bmN0aW9uKGluZGV4LCBldmVudEZvcm0pIHtcbiAgICAgICAgICAgICAgICB2YXIgYXBpVXJsID0gZXZlbnRpbnRlZ3JhdGlvbi5hcGl1cmw7XG4gICAgICAgICAgICAgICAgYXBpVXJsID0gYXBpVXJsLnJlcGxhY2UoL1xcLyQvLCAnJyk7XG5cbiAgICAgICAgICAgICAgICAkKCcjcmVjdXJyaW5nLWV2ZW50JywgZXZlbnRGb3JtKVxuICAgICAgICAgICAgICAgICAgICAuY2hpbGRyZW4oJy5ib3gnKVxuICAgICAgICAgICAgICAgICAgICAuaGlkZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlRXZlbnRzKCQoZXZlbnRGb3JtKSwgYXBpVXJsKTtcbiAgICAgICAgICAgICAgICB0aGlzLmh5cGVyZm9ybUV4dGVuc2lvbnMoZXZlbnRGb3JtKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGVQaWNrZXJTZXR0aW5ncygpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2NhdGlvbicpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZFBvc3RUeXBlKCQoZXZlbnRGb3JtKSwgYXBpVXJsLCAnbG9jYXRpb24nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvcmdhbml6ZXInKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRQb3N0VHlwZSgkKGV2ZW50Rm9ybSksIGFwaVVybCwgJ29yZ2FuaXplcicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VzZXJfZ3JvdXBzJykgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkVGF4b25vbXkoJChldmVudEZvcm0pLCBhcGlVcmwsICd1c2VyX2dyb3VwcycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2V2ZW50X2NhdGVnb3JpZXMnKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRUYXhvbm9teSgkKGV2ZW50Rm9ybSksIGFwaVVybCwgJ2V2ZW50X2NhdGVnb3JpZXMnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LmJpbmQodGhpcylcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGQgY3VzdG9tIHZhbGlkYXRpb25zIHdpdGggSHlwZXJmb3JtXG4gICAgICovXG4gICAgRm9ybS5wcm90b3R5cGUuaHlwZXJmb3JtRXh0ZW5zaW9ucyA9IGZ1bmN0aW9uKGV2ZW50Rm9ybSkge1xuICAgICAgICAvLyBNYXRjaCBlbWFpbCBhZGRyZXNzZXNcblxuICAgICAgICBpZiAoJ3N1Ym1pdHRlcl9yZXBlYXRfZW1haWwnIGluIGV2ZW50Rm9ybSkge1xuICAgICAgICAgICAgaHlwZXJmb3JtLmFkZFZhbGlkYXRvcihldmVudEZvcm0uc3VibWl0dGVyX3JlcGVhdF9lbWFpbCwgZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHZhciB2YWxpZCA9IGVsZW1lbnQudmFsdWUgPT09IGV2ZW50Rm9ybS5zdWJtaXR0ZXJfZW1haWwudmFsdWU7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zZXRDdXN0b21WYWxpZGl0eSh2YWxpZCA/ICcnIDogZXZlbnRJbnRlZ3JhdGlvbkZyb250LmVtYWlsX25vdF9tYXRjaGluZyk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsaWQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgnaW1hZ2VfaW5wdXQnIGluIGV2ZW50Rm9ybSkge1xuICAgICAgICAgICAgaHlwZXJmb3JtLmFkZFZhbGlkYXRvcihldmVudEZvcm0uaW1hZ2VfaW5wdXQsIGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoISQoJyNpbWFnZV9pbnB1dCcpLnByb3AoJ3JlcXVpcmVkJykpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIHZhbGlkID0gZWxlbWVudC5maWxlcy5sZW5ndGggPiAwLFxuICAgICAgICAgICAgICAgICAgICBub3RpY2UgPSBldmVudEZvcm0ucXVlcnlTZWxlY3RvcignLmltYWdlLW5vdGljZScpLFxuICAgICAgICAgICAgICAgICAgICBub3RpY2VIdG1sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCF2YWxpZCAmJiAhbm90aWNlKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vdGljZUh0bWwuaW5uZXJIVE1MID0gZXZlbnRJbnRlZ3JhdGlvbkZyb250Lm11c3RfdXBsb2FkX2ltYWdlO1xuICAgICAgICAgICAgICAgICAgICBub3RpY2VIdG1sLmNsYXNzTmFtZSA9ICd0ZXh0LWRhbmdlciBpbWFnZS1ub3RpY2UnO1xuICAgICAgICAgICAgICAgICAgICBldmVudEZvcm0ucXVlcnlTZWxlY3RvcignLmltYWdlLWJveCcpLmFwcGVuZENoaWxkKG5vdGljZUh0bWwpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGVsZW1lbnQuc2V0Q3VzdG9tVmFsaWRpdHkodmFsaWQgPyAnJyA6IGV2ZW50SW50ZWdyYXRpb25Gcm9udC5tdXN0X3VwbG9hZF9pbWFnZSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsaWQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBHZXQgdGF4b25vbWllcyBmcm9tIEFQSSBhbmQgYWRkIHRvIHNlbGVjdCBib3hcbiAgICBGb3JtLnByb3RvdHlwZS5sb2FkVGF4b25vbXkgPSBmdW5jdGlvbihldmVudEZvcm0sIHJlc291cmNlLCB0YXhvbm9teSkge1xuICAgICAgICByZXNvdXJjZSArPSAnLycgKyB0YXhvbm9teSArICc/X2pzb25wPScgKyB0YXhvbm9teSArICcmcGVyX3BhZ2U9MTAwJztcbiAgICAgICAgdmFyIHNlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRheG9ub215KTtcblxuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdHlwZTogJ0dFVCcsXG4gICAgICAgICAgICB1cmw6IHJlc291cmNlLFxuICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29ucCcsXG4gICAgICAgICAgICBqc29ucENhbGxiYWNrOiB0YXhvbm9teSxcbiAgICAgICAgICAgIGNyb3NzRG9tYWluOiB0cnVlLFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAvLyBDbGVhciBzZWxlY3RcbiAgICAgICAgICAgICAgICAkKHNlbGVjdCkuaHRtbCgnJyk7XG4gICAgICAgICAgICAgICAgdmFyIHRheG9ub21pZXMgPSBGb3JtLnByb3RvdHlwZS5oaWVyYXJjaGljYWxUYXgocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIC8vIEFkZCBzZWxlY3Qgb3B0aW9uIGFuZCBpdCdzIGNoaWxkcmVuIHRheG9ub21pZXNcbiAgICAgICAgICAgICAgICAkKHRheG9ub21pZXMuY2hpbGRyZW4pLmVhY2goZnVuY3Rpb24oaW5kZXgsIHRheCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBQYXJlbnQgb3B0aW9uXG4gICAgICAgICAgICAgICAgICAgIEZvcm0ucHJvdG90eXBlLmFkZE9wdGlvbih0YXgsIHNlbGVjdCwgJycpO1xuICAgICAgICAgICAgICAgICAgICAkKHRheC5jaGlsZHJlbikuZWFjaChmdW5jdGlvbihpbmRleCwgdGF4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDaGlsZHJlbiBvcHRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIEZvcm0ucHJvdG90eXBlLmFkZE9wdGlvbih0YXgsIHNlbGVjdCwgJyDigJMgJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRheC5jaGlsZHJlbikuZWFjaChmdW5jdGlvbihpbmRleCwgdGF4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR3JhbmQgY2hpbGRyZW4gb3B0aW9uc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEZvcm0ucHJvdG90eXBlLmFkZE9wdGlvbih0YXgsIHNlbGVjdCwgJyDigJMg4oCTICcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIEZvcm0ucHJvdG90eXBlLmFkZE9wdGlvbiA9IGZ1bmN0aW9uKHRheG9ub215LCBzZWxlY3QsIGRlcHRoKSB7XG4gICAgICAgIHZhciBvcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICAgICAgb3B0LnZhbHVlID0gdGF4b25vbXkuZGF0YS5pZDtcbiAgICAgICAgb3B0LmlubmVySFRNTCArPSBkZXB0aDtcbiAgICAgICAgb3B0LmlubmVySFRNTCArPSB0YXhvbm9teS5kYXRhLm5hbWU7XG4gICAgICAgIHNlbGVjdC5hcHBlbmRDaGlsZChvcHQpO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBUcmVlTm9kZShkYXRhKSB7XG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgICAgIHRoaXMucGFyZW50ID0gbnVsbDtcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xuICAgIH1cblxuICAgIFRyZWVOb2RlLmNvbXBhcmVyID0gZnVuY3Rpb24oYSwgYikge1xuICAgICAgICByZXR1cm4gYS5kYXRhLm5hbWUgPCBiLmRhdGEubmFtZSA/IDAgOiAxO1xuICAgIH07XG5cbiAgICBUcmVlTm9kZS5wcm90b3R5cGUuc29ydFJlY3Vyc2l2ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmNoaWxkcmVuLnNvcnQoRm9ybS5wcm90b3R5cGUuY29tcGFyZXIpO1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuW2ldLnNvcnRSZWN1cnNpdmUoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLy8gTGlzdCB0YXhvbm9teSBvYmplY3RzIGhpZXJhcmNoaWNhbFxuICAgIEZvcm0ucHJvdG90eXBlLmhpZXJhcmNoaWNhbFRheCA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgdmFyIG5vZGVCeUlkID0ge30sXG4gICAgICAgICAgICBpID0gMCxcbiAgICAgICAgICAgIGwgPSBkYXRhLmxlbmd0aCxcbiAgICAgICAgICAgIG5vZGU7XG5cbiAgICAgICAgLy8gUm9vdCBub2RlXG4gICAgICAgIG5vZGVCeUlkWzBdID0gbmV3IFRyZWVOb2RlKCk7XG5cbiAgICAgICAgLy8gTWFrZSBUcmVlTm9kZSBvYmplY3RzIGZvciBlYWNoIGl0ZW1cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgbm9kZUJ5SWRbZGF0YVtpXS5pZF0gPSBuZXcgVHJlZU5vZGUoZGF0YVtpXSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gTGluayBhbGwgVHJlZU5vZGUgb2JqZWN0c1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBub2RlID0gbm9kZUJ5SWRbZGF0YVtpXS5pZF07XG4gICAgICAgICAgICBub2RlLnBhcmVudCA9IG5vZGVCeUlkW25vZGUuZGF0YS5wYXJlbnRdO1xuICAgICAgICAgICAgbm9kZS5wYXJlbnQuY2hpbGRyZW4ucHVzaChub2RlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBub2RlQnlJZFswXS5zb3J0UmVjdXJzaXZlKCk7XG4gICAgfTtcblxuICAgIC8vIEdldCBhIHBvc3QgdHlwZSBmcm9tIEFQSSBhbmQgYWRkIHRvIGlucHV0IGluaXQgYXV0b2NvbXBsZXRlXG4gICAgRm9ybS5wcm90b3R5cGUubG9hZFBvc3RUeXBlID0gZnVuY3Rpb24oZXZlbnRGb3JtLCByZXNvdXJjZSwgcG9zdFR5cGUpIHtcbiAgICAgICAgcmVzb3VyY2UgKz0gJy8nICsgcG9zdFR5cGUgKyAnL2NvbXBsZXRlP19qc29ucD1nZXQnICsgcG9zdFR5cGU7XG4gICAgICAgIG5ldyBhdXRvQ29tcGxldGUoe1xuICAgICAgICAgICAgc2VsZWN0b3I6ICcjJyArIHBvc3RUeXBlICsgJy1zZWxlY3RvcicsXG4gICAgICAgICAgICBtaW5DaGFyczogMSxcbiAgICAgICAgICAgIHNvdXJjZTogZnVuY3Rpb24odGVybSwgc3VnZ2VzdCkge1xuICAgICAgICAgICAgICAgIHRlcm0gPSB0ZXJtLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ0dFVCcsXG4gICAgICAgICAgICAgICAgICAgIHVybDogcmVzb3VyY2UsXG4gICAgICAgICAgICAgICAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29ucCcsXG4gICAgICAgICAgICAgICAgICAgIGpzb25wQ2FsbGJhY2s6ICdnZXQnICsgcG9zdFR5cGUsXG4gICAgICAgICAgICAgICAgICAgIGNyb3NzRG9tYWluOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN1Z2dlc3Rpb25zID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHJlc3BvbnNlKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKH5pdGVtLnRpdGxlLnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0ZXJtKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VnZ2VzdGlvbnMucHVzaChbaXRlbS50aXRsZSwgaXRlbS5pZCwgcG9zdFR5cGVdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3VnZ2VzdChzdWdnZXN0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVuZGVySXRlbTogZnVuY3Rpb24oaXRlbSwgc2VhcmNoKSB7XG4gICAgICAgICAgICAgICAgc2VhcmNoID0gc2VhcmNoLnJlcGxhY2UoL1stXFwvXFxcXF4kKis/LigpfFtcXF17fV0vZywgJ1xcXFwkJicpO1xuICAgICAgICAgICAgICAgIHZhciByZSA9IG5ldyBSZWdFeHAoJygnICsgc2VhcmNoLnNwbGl0KCcgJykuam9pbignfCcpICsgJyknLCAnZ2knKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImF1dG9jb21wbGV0ZS1zdWdnZXN0aW9uXCIgZGF0YS10eXBlPVwiJyArXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1bMl0gK1xuICAgICAgICAgICAgICAgICAgICAnXCIgZGF0YS1sYW5nbmFtZT1cIicgK1xuICAgICAgICAgICAgICAgICAgICBpdGVtWzBdICtcbiAgICAgICAgICAgICAgICAgICAgJ1wiIGRhdGEtbGFuZz1cIicgK1xuICAgICAgICAgICAgICAgICAgICBpdGVtWzFdICtcbiAgICAgICAgICAgICAgICAgICAgJ1wiIGRhdGEtdmFsPVwiJyArXG4gICAgICAgICAgICAgICAgICAgIHNlYXJjaCArXG4gICAgICAgICAgICAgICAgICAgICdcIj4gJyArXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1bMF0ucmVwbGFjZShyZSwgJzxiPiQxPC9iPicpICtcbiAgICAgICAgICAgICAgICAgICAgJzwvZGl2PidcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9uU2VsZWN0OiBmdW5jdGlvbihlLCB0ZXJtLCBpdGVtKSB7XG4gICAgICAgICAgICAgICAgJCgnIycgKyBpdGVtLmdldEF0dHJpYnV0ZSgnZGF0YS10eXBlJykgKyAnLXNlbGVjdG9yJykudmFsKFxuICAgICAgICAgICAgICAgICAgICBpdGVtLmdldEF0dHJpYnV0ZSgnZGF0YS1sYW5nbmFtZScpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAkKCcjJyArIGl0ZW0uZ2V0QXR0cmlidXRlKCdkYXRhLXR5cGUnKSkudmFsKGl0ZW0uZ2V0QXR0cmlidXRlKCdkYXRhLWxhbmcnKSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy8gU2F2ZStmb3JtYXQgaW5wdXQgZGF0YSBhbmQgcmV0dXJuIGFzIG9iamVjdFxuICAgIEZvcm0ucHJvdG90eXBlLmpzb25EYXRhID0gZnVuY3Rpb24oZm9ybSkge1xuICAgICAgICB2YXIgYXJyRGF0YSA9IGZvcm0uc2VyaWFsaXplQXJyYXkoKSxcbiAgICAgICAgICAgIG9iakRhdGEgPSB7fSxcbiAgICAgICAgICAgIGdyb3VwcyA9IFtdLFxuICAgICAgICAgICAgY2F0ZWdvcmllcyA9IFtdO1xuXG4gICAgICAgICQuZWFjaChhcnJEYXRhLCBmdW5jdGlvbihpbmRleCwgZWxlbSkge1xuICAgICAgICAgICAgc3dpdGNoIChlbGVtLm5hbWUpIHtcbiAgICAgICAgICAgICAgICBjYXNlICd1c2VyX2dyb3Vwcyc6XG4gICAgICAgICAgICAgICAgICAgIGdyb3VwcyA9ICQubWFwKGVsZW0udmFsdWUuc3BsaXQoJywnKSwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUludCh2YWx1ZSwgMTApO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnZXZlbnRfY2F0ZWdvcmllcyc6XG4gICAgICAgICAgICAgICAgICAgIGNhdGVnb3JpZXMucHVzaChwYXJzZUludChlbGVtLnZhbHVlKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIG9iakRhdGFbZWxlbS5uYW1lXSA9IGVsZW0udmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIE9jY2FzaW9uXG4gICAgICAgIG9iakRhdGFbJ29jY2FzaW9ucyddID0gW107XG4gICAgICAgICQoJy5vY2N1cmFuY2UtZ3JvdXAtc2luZ2xlJywgZm9ybSkuZWFjaChmdW5jdGlvbihpbmRleCkge1xuICAgICAgICAgICAgdmFyIHN0YXJ0RGF0ZSA9IEZvcm0ucHJvdG90eXBlLmZvcm1hdERhdGUoXG4gICAgICAgICAgICAgICAgJCgnW25hbWU9XCJzdGFydF9kYXRlXCJdJywgdGhpcykudmFsKCksXG4gICAgICAgICAgICAgICAgJCgnW25hbWU9XCJzdGFydF90aW1lX2hcIl0nLCB0aGlzKS52YWwoKSxcbiAgICAgICAgICAgICAgICAkKCdbbmFtZT1cInN0YXJ0X3RpbWVfbVwiXScsIHRoaXMpLnZhbCgpXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdmFyIGVuZERhdGUgPSBGb3JtLnByb3RvdHlwZS5mb3JtYXREYXRlKFxuICAgICAgICAgICAgICAgICQoJ1tuYW1lPVwiZW5kX2RhdGVcIl0nLCB0aGlzKS52YWwoKSxcbiAgICAgICAgICAgICAgICAkKCdbbmFtZT1cImVuZF90aW1lX2hcIl0nLCB0aGlzKS52YWwoKSxcbiAgICAgICAgICAgICAgICAkKCdbbmFtZT1cImVuZF90aW1lX21cIl0nLCB0aGlzKS52YWwoKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChzdGFydERhdGUgJiYgZW5kRGF0ZSkge1xuICAgICAgICAgICAgICAgIG9iakRhdGFbJ29jY2FzaW9ucyddLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBzdGFydF9kYXRlOiBzdGFydERhdGUsXG4gICAgICAgICAgICAgICAgICAgIGVuZF9kYXRlOiBlbmREYXRlLFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6ICdzY2hlZHVsZWQnLFxuICAgICAgICAgICAgICAgICAgICBjb250ZW50X21vZGU6ICdtYXN0ZXInLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBSZWN1cnJpbmcgb2NjYXNpb25zXG4gICAgICAgIG9iakRhdGFbJ3Jjcl9ydWxlcyddID0gW107XG4gICAgICAgICQoJy5vY2N1cmFuY2UtZ3JvdXAtcmVjdXJyaW5nJywgZm9ybSkuZWFjaChmdW5jdGlvbihpbmRleCkge1xuICAgICAgICAgICAgdmFyIHJjclN0YXJ0SCA9ICQoJ1tuYW1lPVwicmVjdXJyaW5nX3N0YXJ0X2hcIl0nLCB0aGlzKS52YWwoKSxcbiAgICAgICAgICAgICAgICByY3JTdGFydE0gPSAkKCdbbmFtZT1cInJlY3VycmluZ19zdGFydF9tXCJdJywgdGhpcykudmFsKCk7XG4gICAgICAgICAgICB2YXIgcmNyU3RhcnRUaW1lID1cbiAgICAgICAgICAgICAgICByY3JTdGFydEggJiYgcmNyU3RhcnRNXG4gICAgICAgICAgICAgICAgICAgID8gRm9ybS5wcm90b3R5cGUuYWRkWmVybyhyY3JTdGFydEgpICtcbiAgICAgICAgICAgICAgICAgICAgICAnOicgK1xuICAgICAgICAgICAgICAgICAgICAgIEZvcm0ucHJvdG90eXBlLmFkZFplcm8ocmNyU3RhcnRNKSArXG4gICAgICAgICAgICAgICAgICAgICAgJzonICtcbiAgICAgICAgICAgICAgICAgICAgICAnMDAnXG4gICAgICAgICAgICAgICAgICAgIDogZmFsc2U7XG4gICAgICAgICAgICB2YXIgcmNyRW5kSCA9ICQoJ1tuYW1lPVwicmVjdXJyaW5nX2VuZF9oXCJdJywgdGhpcykudmFsKCksXG4gICAgICAgICAgICAgICAgcmNyRW5kTSA9ICQoJ1tuYW1lPVwicmVjdXJyaW5nX2VuZF9tXCJdJywgdGhpcykudmFsKCk7XG4gICAgICAgICAgICB2YXIgcmNyRW5kVGltZSA9XG4gICAgICAgICAgICAgICAgcmNyRW5kSCAmJiByY3JFbmRNXG4gICAgICAgICAgICAgICAgICAgID8gRm9ybS5wcm90b3R5cGUuYWRkWmVybyhyY3JFbmRIKSArXG4gICAgICAgICAgICAgICAgICAgICAgJzonICtcbiAgICAgICAgICAgICAgICAgICAgICBGb3JtLnByb3RvdHlwZS5hZGRaZXJvKHJjckVuZE0pICtcbiAgICAgICAgICAgICAgICAgICAgICAnOicgK1xuICAgICAgICAgICAgICAgICAgICAgICcwMCdcbiAgICAgICAgICAgICAgICAgICAgOiBmYWxzZTtcbiAgICAgICAgICAgIHZhciByY3JTdGFydERhdGUgPSBGb3JtLnByb3RvdHlwZS5pc1ZhbGlkRGF0ZShcbiAgICAgICAgICAgICAgICAkKCdbbmFtZT1cInJlY3VycmluZ19zdGFydF9kXCJdJywgdGhpcykudmFsKClcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICA/ICQoJ1tuYW1lPVwicmVjdXJyaW5nX3N0YXJ0X2RcIl0nLCB0aGlzKS52YWwoKVxuICAgICAgICAgICAgICAgIDogZmFsc2U7XG4gICAgICAgICAgICB2YXIgcmNyRW5kRGF0ZSA9IEZvcm0ucHJvdG90eXBlLmlzVmFsaWREYXRlKCQoJ1tuYW1lPVwicmVjdXJyaW5nX2VuZF9kXCJdJywgdGhpcykudmFsKCkpXG4gICAgICAgICAgICAgICAgPyAkKCdbbmFtZT1cInJlY3VycmluZ19lbmRfZFwiXScsIHRoaXMpLnZhbCgpXG4gICAgICAgICAgICAgICAgOiBmYWxzZTtcblxuICAgICAgICAgICAgaWYgKHJjclN0YXJ0VGltZSAmJiByY3JFbmRUaW1lICYmIHJjclN0YXJ0RGF0ZSAmJiByY3JFbmREYXRlKSB7XG4gICAgICAgICAgICAgICAgb2JqRGF0YVsncmNyX3J1bGVzJ10ucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHJjcl93ZWVrX2RheTogJCgnW25hbWU9XCJ3ZWVrZGF5XCJdJywgdGhpcykudmFsKCksXG4gICAgICAgICAgICAgICAgICAgIHJjcl93ZWVrbHlfaW50ZXJ2YWw6ICQoJ1tuYW1lPVwid2Vla2x5X2ludGVydmFsXCJdJywgdGhpcykudmFsKCksXG4gICAgICAgICAgICAgICAgICAgIHJjcl9zdGFydF90aW1lOiByY3JTdGFydFRpbWUsXG4gICAgICAgICAgICAgICAgICAgIHJjcl9lbmRfdGltZTogcmNyRW5kVGltZSxcbiAgICAgICAgICAgICAgICAgICAgcmNyX3N0YXJ0X2RhdGU6IHJjclN0YXJ0RGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgcmNyX2VuZF9kYXRlOiByY3JFbmREYXRlLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoJCgnI29yZ2FuaXplcicsIGZvcm0pLnZhbCgpKSB7XG4gICAgICAgICAgICBvYmpEYXRhWydvcmdhbml6ZXJzJ10gPSBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvcmdhbml6ZXI6ICQoZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maW5kKCcjb3JnYW5pemVyJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC52YWwoKSxcbiAgICAgICAgICAgICAgICAgICAgbWFpbl9vcmdhbml6ZXI6IHRydWUsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBZGQgYWNjZXNzaWJpbGl0eSBpdGVtc1xuICAgICAgICBvYmpEYXRhWydhY2Nlc3NpYmlsaXR5J10gPSBbXTtcbiAgICAgICAgJC5lYWNoKCQoXCJpbnB1dFtuYW1lPSdhY2Nlc3NpYmlsaXR5J106Y2hlY2tlZFwiKSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBvYmpEYXRhWydhY2Nlc3NpYmlsaXR5J10ucHVzaCgkKHRoaXMpLnZhbCgpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgb2JqRGF0YVsndXNlcl9ncm91cHMnXSA9IGdyb3VwcztcbiAgICAgICAgb2JqRGF0YVsnZXZlbnRfY2F0ZWdvcmllcyddID0gY2F0ZWdvcmllcztcblxuICAgICAgICByZXR1cm4gb2JqRGF0YTtcbiAgICB9O1xuXG4gICAgLy8gU2VuZCBBamF4IHJlcXVlc3Qgd2l0aCBtZWRpYSBkYXRhXG4gICAgRm9ybS5wcm90b3R5cGUuc3VibWl0SW1hZ2VBamF4ID0gZnVuY3Rpb24oZXZlbnRGb3JtLCBpbWFnZURhdGEpIHtcbiAgICAgICAgaW1hZ2VEYXRhLmFwcGVuZCgnYWN0aW9uJywgJ3N1Ym1pdF9pbWFnZScpO1xuICAgICAgICByZXR1cm4gJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogZXZlbnRpbnRlZ3JhdGlvbi5hamF4dXJsLFxuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgICAgICAgY29udGVudFR5cGU6IGZhbHNlLFxuICAgICAgICAgICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxuICAgICAgICAgICAgZGF0YTogaW1hZ2VEYXRhLFxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKGpxWEhSLCB0ZXh0U3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codGV4dFN0YXR1cyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy8gU2VuZCBBamF4IHJlcXVlc3Qgd2l0aCBwb3N0IGRhdGFcbiAgICBGb3JtLnByb3RvdHlwZS5zdWJtaXRFdmVudEFqYXggPSBmdW5jdGlvbihldmVudEZvcm0sIGZvcm1EYXRhKSB7XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6IGV2ZW50aW50ZWdyYXRpb24uYWpheHVybCxcbiAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBhY3Rpb246ICdzdWJtaXRfZXZlbnQnLFxuICAgICAgICAgICAgICAgIGRhdGE6IGZvcm1EYXRhLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLnN1Ym1pdC1zdWNjZXNzJywgZXZlbnRGb3JtKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgICAgICQoJy5zdWJtaXQtc3VjY2VzcyAuc3VjY2VzcycsIGV2ZW50Rm9ybSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5lbXB0eSgpXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKCc8aSBjbGFzcz1cImZhIGZhLXNlbmRcIj48L2k+RXZlbmVtYW5nZXQgaGFyIHNraWNrYXRzITwvbGk+Jyk7XG4gICAgICAgICAgICAgICAgICAgIEZvcm0ucHJvdG90eXBlLmNsZWFuRm9ybShldmVudEZvcm0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLmRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAkKCcuc3VibWl0LXN1Y2Nlc3MnLCBldmVudEZvcm0pLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnLnN1Ym1pdC1lcnJvcicsIGV2ZW50Rm9ybSkucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgICAgICAkKCcuc3VibWl0LWVycm9yIC53YXJuaW5nJywgZXZlbnRGb3JtKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmVtcHR5KClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoJzxpIGNsYXNzPVwiZmEgZmEtd2FybmluZ1wiPjwvaT4nICsgcmVzcG9uc2UuZGF0YSArICc8L2xpPicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oanFYSFIsIHRleHRTdGF0dXMpIHtcbiAgICAgICAgICAgICAgICAkKCcuc3VibWl0LXN1Y2Nlc3MnLCBldmVudEZvcm0pLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICAkKCcuc3VibWl0LWVycm9yJywgZXZlbnRGb3JtKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgJCgnLnN1Ym1pdC1lcnJvciAud2FybmluZycsIGV2ZW50Rm9ybSlcbiAgICAgICAgICAgICAgICAgICAgLmVtcHR5KClcbiAgICAgICAgICAgICAgICAgICAgLmFwcGVuZCgnPGkgY2xhc3M9XCJmYSBmYS13YXJuaW5nXCI+PC9pPicgKyB0ZXh0U3RhdHVzICsgJzwvbGk+Jyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgRm9ybS5wcm90b3R5cGUuZW5kSG91ckNoYW5nZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIHZhciB3cmFwcGVyID0gZXZlbnQudGFyZ2V0LmNsb3Nlc3QoJy5vY2N1cnJlbmNlJyk7XG4gICAgICAgIGlmICh3cmFwcGVyKSB7XG4gICAgICAgICAgICB2YXIgc3RhcnREYXRlID0gd3JhcHBlci5xdWVyeVNlbGVjdG9yKCdpbnB1dFtuYW1lPVwic3RhcnRfZGF0ZVwiXScpLnZhbHVlLFxuICAgICAgICAgICAgICAgIGVuZERhdGUgPSB3cmFwcGVyLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWU9XCJlbmRfZGF0ZVwiXScpLnZhbHVlLFxuICAgICAgICAgICAgICAgIHN0YXJ0VGltZUggPSB3cmFwcGVyLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWU9XCJzdGFydF90aW1lX2hcIl0nKS52YWx1ZTtcblxuICAgICAgICAgICAgaWYgKHN0YXJ0RGF0ZSA+PSBlbmREYXRlKSB7XG4gICAgICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnNldEF0dHJpYnV0ZSgnbWluJywgc3RhcnRUaW1lSCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGV2ZW50LnRhcmdldC5zZXRBdHRyaWJ1dGUoJ21pbicsIDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIEZvcm0ucHJvdG90eXBlLmVuZE1pbnV0ZUNoYW5nZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIHZhciB3cmFwcGVyID0gZXZlbnQudGFyZ2V0LmNsb3Nlc3QoJy5vY2N1cnJlbmNlJyk7XG4gICAgICAgIGlmICh3cmFwcGVyKSB7XG4gICAgICAgICAgICB2YXIgc3RhcnREYXRlID0gd3JhcHBlci5xdWVyeVNlbGVjdG9yKCdpbnB1dFtuYW1lPVwic3RhcnRfZGF0ZVwiXScpLnZhbHVlLFxuICAgICAgICAgICAgICAgIGVuZERhdGUgPSB3cmFwcGVyLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWU9XCJlbmRfZGF0ZVwiXScpLnZhbHVlLFxuICAgICAgICAgICAgICAgIHN0YXJ0VGltZUggPSB3cmFwcGVyLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWU9XCJzdGFydF90aW1lX2hcIl0nKS52YWx1ZSxcbiAgICAgICAgICAgICAgICBlbmRUaW1lSCA9IHdyYXBwZXIucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cImVuZF90aW1lX2hcIl0nKS52YWx1ZSxcbiAgICAgICAgICAgICAgICBzdGFydFRpbWVNID0gd3JhcHBlci5xdWVyeVNlbGVjdG9yKCdpbnB1dFtuYW1lPVwic3RhcnRfdGltZV9tXCJdJykudmFsdWU7XG5cbiAgICAgICAgICAgIGlmIChzdGFydERhdGUgPj0gZW5kRGF0ZSAmJiBzdGFydFRpbWVIID49IGVuZFRpbWVIKSB7XG4gICAgICAgICAgICAgICAgc3RhcnRUaW1lTSA9IHBhcnNlSW50KHN0YXJ0VGltZU0pICsgMTA7XG4gICAgICAgICAgICAgICAgaWYgKHN0YXJ0VGltZU0gPj0gNjApIHtcbiAgICAgICAgICAgICAgICAgICAgd3JhcHBlclxuICAgICAgICAgICAgICAgICAgICAgICAgLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWU9XCJlbmRfdGltZV9oXCJdJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zZXRBdHRyaWJ1dGUoJ21pbicsIHBhcnNlSW50KHN0YXJ0VGltZUgpICsgMSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnNldEF0dHJpYnV0ZSgnbWluJywgc3RhcnRUaW1lTSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBldmVudC50YXJnZXQuc2V0QXR0cmlidXRlKCdtaW4nLCAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBGb3JtLnByb3RvdHlwZS5pbml0UGlja2VyRXZlbnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbbmFtZT1cInN0YXJ0X2RhdGVcIl0nKTtcbiAgICAgICAgQXJyYXkuZnJvbShlbGVtZW50cykuZm9yRWFjaChcbiAgICAgICAgICAgIGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50Lm9uY2hhbmdlID0gZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZS50YXJnZXQudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB3cmFwcGVyID0gZS50YXJnZXQuY2xvc2VzdCgnLm9jY3VycmVuY2UnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQod3JhcHBlcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmluZCgnaW5wdXRbbmFtZT1cImVuZF9kYXRlXCJdJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZGF0ZXBpY2tlcignb3B0aW9uJywgJ21pbkRhdGUnLCBuZXcgRGF0ZShlLnRhcmdldC52YWx1ZSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpXG4gICAgICAgICk7XG4gICAgfTtcblxuICAgIEZvcm0ucHJvdG90eXBlLmluaXRFbmRIb3VyRXZlbnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbbmFtZT1cImVuZF90aW1lX2hcIl0nKTtcbiAgICAgICAgQXJyYXkuZnJvbShlbGVtZW50cykuZm9yRWFjaChcbiAgICAgICAgICAgIGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50Lm9uY2hhbmdlID0gdGhpcy5lbmRIb3VyQ2hhbmdlO1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpXG4gICAgICAgICk7XG4gICAgfTtcblxuICAgIEZvcm0ucHJvdG90eXBlLmluaXRFbmRNaW51dGVFdmVudCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFtuYW1lPVwiZW5kX3RpbWVfbVwiXScpO1xuICAgICAgICBBcnJheS5mcm9tKGVsZW1lbnRzKS5mb3JFYWNoKFxuICAgICAgICAgICAgZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQub25jaGFuZ2UgPSB0aGlzLmVuZE1pbnV0ZUNoYW5nZTtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKVxuICAgICAgICApO1xuICAgIH07XG5cbiAgICBGb3JtLnByb3RvdHlwZS5pbml0UmVjdXJyaW5nRW5kSG91ckV2ZW50ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBlbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W25hbWU9XCJyZWN1cnJpbmdfZW5kX2hcIl0nKTtcbiAgICAgICAgQXJyYXkuZnJvbShlbGVtZW50cykuZm9yRWFjaChcbiAgICAgICAgICAgIGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50Lm9uY2hhbmdlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHdyYXBwZXIgPSBldmVudC50YXJnZXQuY2xvc2VzdCgnLm9jY3VycmVuY2UnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHdyYXBwZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdGFydFRpbWVIID0gd3JhcHBlci5xdWVyeVNlbGVjdG9yKCdpbnB1dFtuYW1lPVwicmVjdXJyaW5nX3N0YXJ0X2hcIl0nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnRhcmdldC5zZXRBdHRyaWJ1dGUoJ21pbicsIHN0YXJ0VGltZUgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKVxuICAgICAgICApO1xuICAgIH07XG5cbiAgICBGb3JtLnByb3RvdHlwZS5pbml0UmVjdXJyaW5nRW5kTWludXRlRXZlbnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbbmFtZT1cInJlY3VycmluZ19lbmRfbVwiXScpO1xuICAgICAgICBBcnJheS5mcm9tKGVsZW1lbnRzKS5mb3JFYWNoKFxuICAgICAgICAgICAgZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQub25jaGFuZ2UgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgd3JhcHBlciA9IGV2ZW50LnRhcmdldC5jbG9zZXN0KCcub2NjdXJyZW5jZScpO1xuICAgICAgICAgICAgICAgICAgICBpZiAod3JhcHBlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN0YXJ0VGltZUggPSB3cmFwcGVyLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWU9XCJyZWN1cnJpbmdfc3RhcnRfaFwiXScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVuZFRpbWVIID0gd3JhcHBlci5xdWVyeVNlbGVjdG9yKCdpbnB1dFtuYW1lPVwicmVjdXJyaW5nX2VuZF9oXCJdJykudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3RhcnRUaW1lTSA9IHdyYXBwZXIucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cInJlY3VycmluZ19zdGFydF9tXCJdJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudmFsdWU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGFydFRpbWVIID49IGVuZFRpbWVIKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRUaW1lTSA9IHBhcnNlSW50KHN0YXJ0VGltZU0pICsgMTA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXJ0VGltZU0gPj0gNjApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd3JhcHBlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWU9XCJyZWN1cnJpbmdfZW5kX2hcIl0nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNldEF0dHJpYnV0ZSgnbWluJywgcGFyc2VJbnQoc3RhcnRUaW1lSCkgKyAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC50YXJnZXQuc2V0QXR0cmlidXRlKCdtaW4nLCBzdGFydFRpbWVNKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnRhcmdldC5zZXRBdHRyaWJ1dGUoJ21pbicsIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKVxuICAgICAgICApO1xuICAgIH07XG5cbiAgICBGb3JtLnByb3RvdHlwZS5pbml0RGF0ZUV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBTaW5nbGUgb2NjYXNpb25zIGV2ZW50c1xuICAgICAgICB0aGlzLmluaXRQaWNrZXJFdmVudCgpO1xuICAgICAgICB0aGlzLmluaXRFbmRIb3VyRXZlbnQoKTtcbiAgICAgICAgdGhpcy5pbml0RW5kTWludXRlRXZlbnQoKTtcblxuICAgICAgICAvLyBSZWN1cnJpbmcgZGF0ZSBldmVudHNcbiAgICAgICAgdGhpcy5pbml0UmVjdXJyaW5nRW5kSG91ckV2ZW50KCk7XG4gICAgICAgIHRoaXMuaW5pdFJlY3VycmluZ0VuZE1pbnV0ZUV2ZW50KCk7XG4gICAgfTtcblxuICAgIEZvcm0ucHJvdG90eXBlLmRhdGVQaWNrZXJTZXR0aW5ncyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAkLmRhdGVwaWNrZXIuc2V0RGVmYXVsdHMoe1xuICAgICAgICAgICAgbWluRGF0ZTogJ25vdycsXG4gICAgICAgICAgICBtYXhEYXRlOiBuZXcgRGF0ZSgpLmdldERhdGUoKSArIDM2NSxcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIEZvcm0ucHJvdG90eXBlLmhhbmRsZUV2ZW50cyA9IGZ1bmN0aW9uKGV2ZW50Rm9ybSwgYXBpVXJsKSB7XG4gICAgICAgIHRoaXMuaW5pdERhdGVFdmVudHMoKTtcblxuICAgICAgICAkKGV2ZW50Rm9ybSkub24oXG4gICAgICAgICAgICAnc3VibWl0JyxcbiAgICAgICAgICAgIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICB2YXIgZmlsZUlucHV0ID0gZXZlbnRGb3JtLmZpbmQoJyNpbWFnZV9pbnB1dCcpLFxuICAgICAgICAgICAgICAgICAgICBmb3JtRGF0YSA9IHRoaXMuanNvbkRhdGEoZXZlbnRGb3JtKSxcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VEYXRhID0gbmV3IEZvcm1EYXRhKCk7XG5cbiAgICAgICAgICAgICAgICAkKCcuc3VibWl0LWVycm9yJywgZXZlbnRGb3JtKS5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgJCgnLnN1Ym1pdC1zdWNjZXNzJywgZXZlbnRGb3JtKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgJCgnLnN1Ym1pdC1zdWNjZXNzIC5zdWNjZXNzJywgZXZlbnRGb3JtKVxuICAgICAgICAgICAgICAgICAgICAuZW1wdHkoKVxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKCc8aSBjbGFzcz1cImZhIGZhLXNlbmRcIj48L2k+U2tpY2thci4uLjwvbGk+Jyk7XG5cbiAgICAgICAgICAgICAgICAvLyBVcGxvYWQgbWVkaWEgZmlyc3QgYW5kIGFwcGVuZCBpdCB0byB0aGUgcG9zdC5cbiAgICAgICAgICAgICAgICBpZiAoZmlsZUlucHV0LnZhbCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGltYWdlRGF0YS5hcHBlbmQoJ2ZpbGUnLCBmaWxlSW5wdXRbMF0uZmlsZXNbMF0pO1xuICAgICAgICAgICAgICAgICAgICAkLndoZW4odGhpcy5zdWJtaXRJbWFnZUFqYXgoZXZlbnRGb3JtLCBpbWFnZURhdGEpKS50aGVuKGZ1bmN0aW9uKFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0U3RhdHVzXG4gICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtRGF0YVsnZmVhdHVyZWRfbWVkaWEnXSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgRm9ybS5wcm90b3R5cGUuc3VibWl0RXZlbnRBamF4KGV2ZW50Rm9ybSwgZm9ybURhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcuc3VibWl0LXN1Y2Nlc3MnLCBldmVudEZvcm0pLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcuc3VibWl0LWVycm9yJywgZXZlbnRGb3JtKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnLnN1Ym1pdC1lcnJvciAud2FybmluZycsIGV2ZW50Rm9ybSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmVtcHR5KClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFwcGVuZChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8aSBjbGFzcz1cImZhIGZhLXdhcm5pbmdcIj48L2k+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRJbnRlZ3JhdGlvbkZyb250LnNvbWV0aGluZ193ZW50X3dyb25nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9saT4nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAvLyBTdWJtaXQgcG9zdCBpZiBtZWRpYSBpcyBub3Qgc2V0XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdWJtaXRFdmVudEFqYXgoZXZlbnRGb3JtLCBmb3JtRGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpXG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gU2hvdyBpbWFnZSBhcHByb3ZhbCB0ZXJtc1xuICAgICAgICAkKCcuaW1nLWJ1dHRvbicsIGV2ZW50Rm9ybSkuY2xpY2soZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgJCgnLmltYWdlLWJveCcsIGV2ZW50Rm9ybSkuaGlkZSgpO1xuICAgICAgICAgICAgJCgnLmltYWdlLWFwcHJvdmUnLCBldmVudEZvcm0pLmZhZGVJbigpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBTaG93IHVwbG9hZGVyIGlmIHRlcm1zIGlzIGFwcHJvdmVkXG4gICAgICAgICQoJ2lucHV0W25hbWU9YXBwcm92ZV0nLCBldmVudEZvcm0pLmNoYW5nZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBmaXJzdENoZWNrID0gJCgnaW5wdXQ6Y2hlY2tib3hbaWQ9Zmlyc3QtYXBwcm92ZV06Y2hlY2tlZCcsIGV2ZW50Rm9ybSkubGVuZ3RoID4gMCxcbiAgICAgICAgICAgICAgICBzZWNvbmRDaGVjayA9ICQoJ2lucHV0OmNoZWNrYm94W2lkPXNlY29uZC1hcHByb3ZlXTpjaGVja2VkJywgZXZlbnRGb3JtKS5sZW5ndGggPiAwO1xuICAgICAgICAgICAgaWYgKGZpcnN0Q2hlY2sgJiYgc2Vjb25kQ2hlY2spIHtcbiAgICAgICAgICAgICAgICAkKCcuaW1hZ2UtYXBwcm92ZScsIGV2ZW50Rm9ybSkuaGlkZSgpO1xuICAgICAgICAgICAgICAgICQoJy5pbWFnZS11cGxvYWQnLCBldmVudEZvcm0pLmZhZGVJbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBTaG93L2hpZGUgb2NjYXNpb24gYW5kIHJlY2N1cmluZyBvY2Nhc2lvbiBydWxlcy4gQW5kIGFkZCByZXF1aXJlZCBmaWVsZHMuXG4gICAgICAgICQoJ2lucHV0OnJhZGlvW25hbWU9b2NjdXJhbmNlLXR5cGVdJywgZXZlbnRGb3JtKS5jaGFuZ2UoZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBpZCA9ICQodGhpcykuZGF0YSgnaWQnKTtcbiAgICAgICAgICAgICQoJyMnICsgaWQpXG4gICAgICAgICAgICAgICAgLmNoaWxkcmVuKCcuZm9ybS1ncm91cCAuYm94JylcbiAgICAgICAgICAgICAgICAuc2hvdygpXG4gICAgICAgICAgICAgICAgLmZpbmQoJ2lucHV0JylcbiAgICAgICAgICAgICAgICAucHJvcCgncmVxdWlyZWQnLCB0cnVlKTtcbiAgICAgICAgICAgICQoJyMnICsgaWQpXG4gICAgICAgICAgICAgICAgLnNpYmxpbmdzKCcuZXZlbnQtb2NjYXNpb24nKVxuICAgICAgICAgICAgICAgIC5jaGlsZHJlbignLmJveCcpXG4gICAgICAgICAgICAgICAgLmhpZGUoKVxuICAgICAgICAgICAgICAgIC5maW5kKCdpbnB1dCcpXG4gICAgICAgICAgICAgICAgLnByb3AoJ3JlcXVpcmVkJywgZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBBZGQgbmV3IG9jY3VyYW5jZVxuICAgICAgICAkKCcuYWRkLW9jY3VyYW5jZScsIGV2ZW50Rm9ybSkuY2xpY2soXG4gICAgICAgICAgICBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgdmFyICRvY2N1cmFuY2VHcm91cCA9ICQoZXZlbnQudGFyZ2V0KVxuICAgICAgICAgICAgICAgICAgICAgICAgLnBhcmVudCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAucHJldignW2NsYXNzKj1vY2N1cmFuY2UtZ3JvdXBdJyksXG4gICAgICAgICAgICAgICAgICAgICRkdXBsaWNhdGUgPSAkb2NjdXJhbmNlR3JvdXBcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jbG9uZSgpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmluZCgnaW5wdXQnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnZhbCgnJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnaGFzRGF0ZXBpY2tlcicpXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQXR0cignaWQnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmVuZCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAuaW5zZXJ0QWZ0ZXIoJG9jY3VyYW5jZUdyb3VwKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbmQoJy5kYXRlcGlja2VyJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5kYXRlcGlja2VyKClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5lbmQoKTtcblxuICAgICAgICAgICAgICAgIC8vIFJlIGluaXQgZGF0ZSBldmVudHNcbiAgICAgICAgICAgICAgICB0aGlzLmluaXREYXRlRXZlbnRzKCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoJCgnLnJlbW92ZS1vY2N1cmFuY2UnLCAkZHVwbGljYXRlKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyICRyZW1vdmVCdXR0b24gPSAkKFxuICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+PGJ1dHRvbiBjbGFzcz1cImJ0biBidG4gYnRuLXNtIHJlbW92ZS1vY2N1cmFuY2VcIj48aSBjbGFzcz1cInByaWNvbiBwcmljb24tbWludXMtb1wiPjwvaT4gVGEgYm9ydDwvYnV0dG9uPjwvZGl2PidcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgJGR1cGxpY2F0ZS5hcHBlbmQoJHJlbW92ZUJ1dHRvbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpXG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gUmVtb3ZlIG9jY3VyYW5jZVxuICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLnJlbW92ZS1vY2N1cmFuY2UnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAkKHRoaXMpXG4gICAgICAgICAgICAgICAgLmNsb3Nlc3QoJ1tjbGFzcyo9b2NjdXJhbmNlLWdyb3VwXScpXG4gICAgICAgICAgICAgICAgLnJlbW92ZSgpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy8gQ2xlYW4gdXAgZm9ybVxuICAgIEZvcm0ucHJvdG90eXBlLmNsZWFuRm9ybSA9IGZ1bmN0aW9uKGV2ZW50Rm9ybSkge1xuICAgICAgICAkKCc6aW5wdXQnLCBldmVudEZvcm0pXG4gICAgICAgICAgICAubm90KCc6YnV0dG9uLCA6c3VibWl0LCA6cmVzZXQsIDpoaWRkZW4sIHNlbGVjdCcpXG4gICAgICAgICAgICAudmFsKCcnKVxuICAgICAgICAgICAgLnJlbW92ZUF0dHIoJ3NlbGVjdGVkJyk7XG4gICAgfTtcblxuICAgIC8vIEZvcm1hdCBkYXRlIGFuZCB0aW1lXG4gICAgRm9ybS5wcm90b3R5cGUuZm9ybWF0RGF0ZSA9IGZ1bmN0aW9uKGRhdGUsIGhoLCBtbSkge1xuICAgICAgICB2YXIgZGF0ZVRpbWUgPSAnJztcbiAgICAgICAgaWYgKHRoaXMuaXNWYWxpZERhdGUoZGF0ZSkgJiYgaGggJiYgbW0pIHtcbiAgICAgICAgICAgIGRhdGVUaW1lID0gZGF0ZSArICcgJyArIHRoaXMuYWRkWmVybyhoaCkgKyAnOicgKyB0aGlzLmFkZFplcm8obW0pICsgJzowMCc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRhdGVUaW1lO1xuICAgIH07XG5cbiAgICAvLyBDaGVjayB2YWxpZCBkYXRlIGZvcm1hdFxuICAgIEZvcm0ucHJvdG90eXBlLmlzVmFsaWREYXRlID0gZnVuY3Rpb24oZGF0ZVN0cmluZykge1xuICAgICAgICB2YXIgcmVnRXggPSAvXlxcZHs0fS1cXGR7Mn0tXFxkezJ9JC87XG4gICAgICAgIHJldHVybiBkYXRlU3RyaW5nLm1hdGNoKHJlZ0V4KSAhPSBudWxsO1xuICAgIH07XG5cbiAgICAvLyBQcmVmaXggd2l0aCB6ZXJvXG4gICAgRm9ybS5wcm90b3R5cGUuYWRkWmVybyA9IGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgaWYgKGkudG9TdHJpbmcoKS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIGkgPSAnMCcgKyBpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpO1xuICAgIH07XG5cbiAgICByZXR1cm4gbmV3IEZvcm0oKTtcbn0pKGpRdWVyeSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLy9Jbml0IGV2ZW50IHdpZGdldFxuRXZlbnRNYW5hZ2VySW50ZWdyYXRpb24gPSBFdmVudE1hbmFnZXJJbnRlZ3JhdGlvbiB8fCB7fTtcbkV2ZW50TWFuYWdlckludGVncmF0aW9uLldpZGdldCA9IEV2ZW50TWFuYWdlckludGVncmF0aW9uLldpZGdldCB8fCB7fTtcblxuLy9Db21wb25lbnRcbkV2ZW50TWFuYWdlckludGVncmF0aW9uLldpZGdldC5UZW1wbGF0ZVBhcnNlciA9IChmdW5jdGlvbiAoJCkge1xuICAgIHZhciBkYXRlICAgICAgICAgICAgICAgID0gbmV3IERhdGUoKTtcbiAgICB2YXIgZGQgICAgICAgICAgICAgICAgICA9IGRhdGUuZ2V0RGF0ZSgpO1xuICAgIHZhciBtbSAgICAgICAgICAgICAgICAgID0gZGF0ZS5nZXRNb250aCgpKzE7XG4gICAgdmFyIHllYXIgICAgICAgICAgICAgICAgPSBkYXRlLmdldEZ1bGxZZWFyKCk7XG4gICAgdmFyIG1vbnRocyAgICAgICAgICAgICAgPSBbXCJqYW5cIiwgXCJmZWJcIiwgXCJtYXJcIiwgXCJhcHJcIiwgXCJtYWpcIiwgXCJqdW5cIiwgXCJqdWxcIiwgXCJhdWdcIiwgXCJzZXBcIiwgXCJva3RcIiwgXCJub3ZcIiwgXCJkZWNcIl07XG5cbiAgICB2YXIgdGVtcGxhdGUgICAgICAgICAgICA9IHt9O1xuICAgIHZhciBlcnJvclRlbXBsYXRlICAgICAgID0ge307XG5cbiAgICBmdW5jdGlvbiBUZW1wbGF0ZVBhcnNlcigpIHtcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfVxuXG4gICAgVGVtcGxhdGVQYXJzZXIucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICQoXCIuZXZlbnQtYXBpXCIpLmVhY2goZnVuY3Rpb24oaW5kZXgsbW9kdWxlKXtcbiAgICAgICAgICAgIHZhciBkYXRhQXBpdXJsICAgICAgICAgID0gKCQobW9kdWxlKS5hdHRyKCdkYXRhLWFwaXVybCcpKTtcbiAgICAgICAgICAgICAgICBkYXRhQXBpdXJsICAgICAgICAgID0gZGF0YUFwaXVybC5yZXBsYWNlKC9cXC8kLywgXCJcIik7XG4gICAgICAgICAgICAgICAgZGF0YUFwaXVybCAgICAgICAgICA9IGRhdGFBcGl1cmwgKyAnL2V2ZW50L3RpbWU/c3RhcnQ9JyArIHllYXIgKyAnLScgKyBtbSArICctJyArIGRkICsgJyZlbmQ9JyArICh5ZWFyKzEpICsgJy0nICsgbW0gKyAnLScgKyBkZDtcbiAgICAgICAgICAgIHZhciBkYXRhTGltaXQgICAgICAgICAgID0gKCQobW9kdWxlKS5hdHRyKCdwb3N0LWxpbWl0JykpO1xuICAgICAgICAgICAgdmFyIGRhdGFHcm91cElkICAgICAgICAgPSAoJChtb2R1bGUpLmF0dHIoJ2dyb3VwLWlkJykpO1xuICAgICAgICAgICAgdmFyIGRhdGFDYXRlZ29yeUlkICAgICAgPSAoJChtb2R1bGUpLmF0dHIoJ2NhdGVnb3J5LWlkJykpO1xuICAgICAgICAgICAgdmFyIGxhdGxuZyAgICAgICAgICAgICAgPSAoJChtb2R1bGUpLmF0dHIoJ2xhdGxuZycpKTtcbiAgICAgICAgICAgIHZhciBkaXN0YW5jZSAgICAgICAgICAgID0gKCQobW9kdWxlKS5hdHRyKCdkaXN0YW5jZScpKTtcblxuICAgICAgICAgICAgdmFyIGFwaVVybCA9ICh0eXBlb2YgZGF0YUxpbWl0ICE9ICd1bmRlZmluZWQnICYmICQuaXNOdW1lcmljKGRhdGFMaW1pdCkpID8gZGF0YUFwaXVybCArICcmcG9zdC1saW1pdD0nICsgZGF0YUxpbWl0IDogZGF0YUFwaXVybCArICcmcG9zdC1saW1pdD0nICsgMTA7XG4gICAgICAgICAgICAgICAgYXBpVXJsICs9ICh0eXBlb2YgZGF0YUdyb3VwSWQgIT0gJ3VuZGVmaW5lZCcgJibCoGRhdGFHcm91cElkKSA/ICcmZ3JvdXAtaWQ9JyArIGRhdGFHcm91cElkIDogJyc7XG4gICAgICAgICAgICAgICAgYXBpVXJsICs9ICh0eXBlb2YgZGF0YUNhdGVnb3J5SWQgIT0gJ3VuZGVmaW5lZCcgJiYgZGF0YUNhdGVnb3J5SWQpID8gJyZjYXRlZ29yeS1pZD0nICsgZGF0YUNhdGVnb3J5SWQgOiAnJztcbiAgICAgICAgICAgICAgICBhcGlVcmwgKz0gKHR5cGVvZiBsYXRsbmcgIT0gJ3VuZGVmaW5lZCcgJiYgbGF0bG5nKSA/ICcmbGF0bG5nPScgKyBsYXRsbmcgOiAnJztcbiAgICAgICAgICAgICAgICBhcGlVcmwgKz0gKHR5cGVvZiBkaXN0YW5jZSAhPSAndW5kZWZpbmVkJyAmJiBkaXN0YW5jZSkgPyAnJmRpc3RhbmNlPScgKyBkaXN0YW5jZSA6ICcnO1xuICAgICAgICAgICAgICAgIGFwaVVybCArPSAnJl9qc29ucD1nZXRldmVudHMnO1xuICAgICAgICAgICAgdGhpcy5zdG9yZUVycm9yVGVtcGxhdGUoJChtb2R1bGUpKTtcbiAgICAgICAgICAgIHRoaXMuc3RvcmVUZW1wbGF0ZSgkKG1vZHVsZSkpO1xuICAgICAgICAgICAgdGhpcy5zdG9yZU1vZGFsVGVtcGxhdGUoJChtb2R1bGUpKTtcbiAgICAgICAgICAgIHRoaXMubG9hZEV2ZW50KCQobW9kdWxlKSxhcGlVcmwpO1xuICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgIH07XG5cbiAgICBUZW1wbGF0ZVBhcnNlci5wcm90b3R5cGUuc3RvcmVUZW1wbGF0ZSA9IGZ1bmN0aW9uIChtb2R1bGUpIHtcbiAgICAgICAgbW9kdWxlLmRhdGEoJ3RlbXBsYXRlJywkKCcudGVtcGxhdGUnLG1vZHVsZSkuaHRtbCgpKTtcbiAgICAgICAgbW9kdWxlLmZpbmQoJy50ZW1wbGF0ZScpLnJlbW92ZSgpO1xuICAgIH07XG5cbiAgICBUZW1wbGF0ZVBhcnNlci5wcm90b3R5cGUuc3RvcmVFcnJvclRlbXBsYXRlID0gZnVuY3Rpb24gKG1vZHVsZSkge1xuICAgICAgICBtb2R1bGUuZGF0YSgnZXJyb3ItdGVtcGxhdGUnLCQoJy5lcnJvci10ZW1wbGF0ZScsbW9kdWxlKS5odG1sKCkpO1xuICAgICAgICBtb2R1bGUuZmluZCgnLmVycm9yLXRlbXBsYXRlJykucmVtb3ZlKCk7XG4gICAgfTtcblxuICAgIFRlbXBsYXRlUGFyc2VyLnByb3RvdHlwZS5zdG9yZU1vZGFsVGVtcGxhdGUgPSBmdW5jdGlvbiAobW9kdWxlKSB7XG4gICAgICAgIG1vZHVsZS5kYXRhKCdtb2RhbC10ZW1wbGF0ZScsJCgnLm1vZGFsLXRlbXBsYXRlJyxtb2R1bGUpLmh0bWwoKSk7XG4gICAgICAgIG1vZHVsZS5maW5kKCcubW9kYWwtdGVtcGxhdGUnKS5yZW1vdmUoKTtcbiAgICB9O1xuXG4gICAgVGVtcGxhdGVQYXJzZXIucHJvdG90eXBlLmxvYWRFdmVudCA9IGZ1bmN0aW9uKG1vZHVsZSwgcmVzb3VyY2UpIHtcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHR5cGU6IFwiR0VUXCIsXG4gICAgICAgICAgICB1cmw6IHJlc291cmNlLFxuICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgICAgICAgZGF0YVR5cGU6IFwianNvbnBcIixcbiAgICAgICAgICAgIGpzb25wQ2FsbGJhY2s6ICdnZXRldmVudHMnLFxuICAgICAgICAgICAgY3Jvc3NEb21haW46IHRydWUsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiggcmVzcG9uc2UgKSB7XG4gICAgICAgICAgICAgICAgLy9TdG9yZSByZXNwb25zZSBvbiBtb2R1bGVcbiAgICAgICAgICAgICAgICBtb2R1bGUuZGF0YSgnanNvbi1yZXNwb25zZScsIHJlc3BvbnNlKTtcblxuICAgICAgICAgICAgICAgIC8vQ2xlYXIgdGFyZ2V0IGRpdlxuICAgICAgICAgICAgICAgIFRlbXBsYXRlUGFyc2VyLnByb3RvdHlwZS5jbGVhcihtb2R1bGUpO1xuXG4gICAgICAgICAgICAgICAgJChyZXNwb25zZSkuZWFjaChmdW5jdGlvbihpbmRleCxldmVudCl7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gR2V0IHRoZSBjb3JyZWN0IG9jY2FzaW9uXG4gICAgICAgICAgICAgICAgICAgIHZhciBldmVudE9jY2FzaW9uID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgJC5lYWNoKGV2ZW50Lm9jY2FzaW9ucywgZnVuY3Rpb24ob2NjYXRpb25pbmRleCxvY2NhdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvY2NhdGlvbi5jdXJyZW50X29jY2FzaW9uICE9ICd1bmRlZmluZWQnICYmIG9jY2F0aW9uLmN1cnJlbnRfb2NjYXNpb24gPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50T2NjYXNpb24gPSBvY2NhdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBvY2Nhc2lvbkRhdGUgICAgPSBuZXcgRGF0ZShldmVudE9jY2FzaW9uLnN0YXJ0X2RhdGUpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vTG9hZCB0ZW1wbGF0ZSBkYXRhXG4gICAgICAgICAgICAgICAgICAgIHZhciBtb2R1bGVUZW1wbGF0ZSAgPSBtb2R1bGUuZGF0YSgndGVtcGxhdGUnKTtcblxuICAgICAgICAgICAgICAgICAgICAvL1JlcGxhY2Ugd2l0aCB2YWx1ZXNcbiAgICAgICAgICAgICAgICAgICAgbW9kdWxlVGVtcGxhdGUgICAgICA9IG1vZHVsZVRlbXBsYXRlLnJlcGxhY2UoJ3tldmVudC1pZH0nLCBldmVudC5pZCk7XG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZVRlbXBsYXRlICAgICAgPSBtb2R1bGVUZW1wbGF0ZS5yZXBsYWNlKCd7ZXZlbnQtb2NjYXNpb259Jywgb2NjYXNpb25EYXRlLmdldERhdGUoKSArICc8ZGl2IGNsYXNzPVwiY2xlYXJmaXhcIj48L2Rpdj4nICsgbW9udGhzW29jY2FzaW9uRGF0ZS5nZXRNb250aCgpXSk7XG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZVRlbXBsYXRlICAgICAgPSBtb2R1bGVUZW1wbGF0ZS5yZXBsYWNlKCd7ZXZlbnQtdGl0bGV9JywgJzxwIGNsYXNzPVwibGluay1pdGVtXCI+JyArIGV2ZW50LnRpdGxlLnJlbmRlcmVkICsgJzwvcD4nKTtcblxuICAgICAgICAgICAgICAgICAgICAvL0FwcGVuZFxuICAgICAgICAgICAgICAgICAgICBtb2R1bGUuYXBwZW5kKG1vZHVsZVRlbXBsYXRlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAvL2JpbmQgY2xpY2tcbiAgICAgICAgICAgICAgICBUZW1wbGF0ZVBhcnNlci5wcm90b3R5cGUuY2xpY2sobW9kdWxlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oIHJlc3BvbnNlICkge1xuICAgICAgICAgICAgICAgIFRlbXBsYXRlUGFyc2VyLnByb3RvdHlwZS5jbGVhcihtb2R1bGUpO1xuICAgICAgICAgICAgICAgIG1vZHVsZS5odG1sKG1vZHVsZS5kYXRhKCdlcnJvci10ZW1wbGF0ZScpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cblxuICAgIH07XG5cbiAgICBUZW1wbGF0ZVBhcnNlci5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbihtb2R1bGUpe1xuICAgICAgICBqUXVlcnkobW9kdWxlKS5odG1sKCcnKTtcbiAgICB9O1xuXG4gICAgVGVtcGxhdGVQYXJzZXIucHJvdG90eXBlLmFkZFplcm8gPSBmdW5jdGlvbiAoaSkge1xuICAgICAgICBpZiAoaSA8IDEwKSB7XG4gICAgICAgICAgICBpID0gXCIwXCIgKyBpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpO1xuICAgIH07XG5cbiAgICBUZW1wbGF0ZVBhcnNlci5wcm90b3R5cGUuY2xpY2sgPSBmdW5jdGlvbihtb2R1bGUpe1xuXG4gICAgICAgIGpRdWVyeShcImxpIGFcIixtb2R1bGUpLm9uKCdjbGljaycse30sZnVuY3Rpb24oZSl7XG5cbiAgICAgICAgICAgIHZhciBldmVudElkID0galF1ZXJ5KGUudGFyZ2V0KS5jbG9zZXN0KFwiYS5tb2RhbC1ldmVudFwiKS5kYXRhKCdldmVudC1pZCcpO1xuXG4gICAgICAgICAgICAkLmVhY2gobW9kdWxlLmRhdGEoJ2pzb24tcmVzcG9uc2UnKSwgZnVuY3Rpb24oaW5kZXgsb2JqZWN0KSB7XG5cbiAgICAgICAgICAgICAgICBpZihvYmplY3QuaWQgPT0gZXZlbnRJZCkge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIE1haW4gbW9kYWxcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1vZGFsVGVtcGxhdGUgPSBtb2R1bGUuZGF0YSgnbW9kYWwtdGVtcGxhdGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGFsVGVtcGxhdGUgPSBtb2RhbFRlbXBsYXRlLnJlcGxhY2UoJ3tldmVudC1tb2RhbC10aXRsZX0nLCBvYmplY3QudGl0bGUucmVuZGVyZWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9kYWxUZW1wbGF0ZSA9IG1vZGFsVGVtcGxhdGUucmVwbGFjZSgne2V2ZW50LW1vZGFsLWNvbnRlbnR9JywgKG9iamVjdC5jb250ZW50LnJlbmRlcmVkICE9IG51bGwpID8gb2JqZWN0LmNvbnRlbnQucmVuZGVyZWQgOiAnJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RhbFRlbXBsYXRlID0gbW9kYWxUZW1wbGF0ZS5yZXBsYWNlKCd7ZXZlbnQtbW9kYWwtbGlua30nLCAob2JqZWN0LmV2ZW50X2xpbmsgIT0gbnVsbCkgPyAnPHA+PGEgaHJlZj1cIicgKyBvYmplY3QuZXZlbnRfbGluayArICdcIiB0YXJnZXQ9XCJfYmxhbmtcIj4nICsgb2JqZWN0LmV2ZW50X2xpbmsgKyAnPC9hPjwvcD4nIDogJycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9kYWxUZW1wbGF0ZSA9IG1vZGFsVGVtcGxhdGUucmVwbGFjZSgne2V2ZW50LW1vZGFsLWltYWdlfScsIChvYmplY3QuZmVhdHVyZWRfbWVkaWEgIT0gbnVsbCkgPyAnPGltZyBzcmM9JyArIG9iamVjdC5mZWF0dXJlZF9tZWRpYS5zb3VyY2VfdXJsICsgJyBhbHQ9XCInICsgb2JqZWN0LnRpdGxlLnJlbmRlcmVkICsgJ1wiIHN0eWxlPVwiZGlzcGxheTpibG9jazsgd2lkdGg6MTAwJTtcIj4nIDogJycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gT2NjYXRpb25zIGFjY29yZGlvbiBzZWN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbW9kYWxPY2NhdGlvblJlc3VsdCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAkLmVhY2gob2JqZWN0Lm9jY2FzaW9ucywgZnVuY3Rpb24ob2NjYXRpb25pbmRleCxvY2NhdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZvcm1hdCBzdGFydCBhbmQgZW5kIGRhdGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZCA9IG5ldyBEYXRlKG9jY2F0aW9uLnN0YXJ0X2RhdGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdGFydCA9IHRoaXMuYWRkWmVybyhkLmdldERhdGUoKSkgKyAnICcgKyBtb250aHNbZC5nZXRNb250aCgpXSArICcgJyArIGQuZ2V0RnVsbFllYXIoKSArICcga2wuICcgKyB0aGlzLmFkZFplcm8oZC5nZXRIb3VycygpKSArICc6JyArIHRoaXMuYWRkWmVybyhkLmdldE1pbnV0ZXMoKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZSA9IG5ldyBEYXRlKG9jY2F0aW9uLmVuZF9kYXRlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZW5kID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZS5nZXREYXRlKCkgPT09IGQuZ2V0RGF0ZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZCA9ICdrbC4gJyArIHRoaXMuYWRkWmVybyhlLmdldEhvdXJzKCkpICsgJzonICsgdGhpcy5hZGRaZXJvKGUuZ2V0TWludXRlcygpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmQgPSBlLmdldERhdGUoKSArICcgJyArIG1vbnRoc1tlLmdldE1vbnRoKCldICsgJyAnICsgZS5nZXRGdWxsWWVhcigpICsgJyBrbC4gJyArIHRoaXMuYWRkWmVybyhlLmdldEhvdXJzKCkpICsgJzonICsgdGhpcy5hZGRaZXJvKGUuZ2V0TWludXRlcygpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kYWxPY2NhdGlvblJlc3VsdCA9IG1vZGFsT2NjYXRpb25SZXN1bHQgKyAnPGxpIGNsYXNzPVwidGV4dC1zbSBndXR0ZXItc20gZ3V0dGVyLXZlcnRpY2FsXCI+JyArIHN0YXJ0ICsgJyAtICcgKyBlbmQgKyAnPC9saT4nO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9kYWxUZW1wbGF0ZSA9IG1vZGFsVGVtcGxhdGUucmVwbGFjZSgne2V2ZW50LW1vZGFsLW9jY2F0aW9uc30nLCc8c2VjdGlvbiBjbGFzcz1cImFjY29yZGlvbi1zZWN0aW9uXCI+PGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJhY3RpdmUtc2VjdGlvblwiIGlkPVwiYWNjb3JkaW9uLXNlY3Rpb24tMVwiPjxsYWJlbCBjbGFzcz1cImFjY29yZGlvbi10b2dnbGVcIiBmb3I9XCJhY2NvcmRpb24tc2VjdGlvbi0xXCI+PGgyPkV2ZW5lbWFuZ2V0IGludHLDpGZmYXI8L2gyPjwvbGFiZWw+PGRpdiBjbGFzcz1cImFjY29yZGlvbi1jb250ZW50XCI+PHVsIGlkPVwibW9kYWwtb2NjYXRpb25zXCI+JyArIG1vZGFsT2NjYXRpb25SZXN1bHQgKyAnPC91bD48L2Rpdj48L3NlY3Rpb24+Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBMb2NhdGlvbiBhY2NvcmRpb24gc2VjdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxvY2F0aW9uRGF0YSA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYXRpb25EYXRhICs9IChvYmplY3QubG9jYXRpb24gIT0gbnVsbCAmJiBvYmplY3QubG9jYXRpb24udGl0bGUgIT0gbnVsbCkgPyAnPGxpPjxzdHJvbmc+JyArIG9iamVjdC5sb2NhdGlvbi50aXRsZSArICc8L3N0cm9uZz48L2xpPicgOiAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbkRhdGEgKz0gKG9iamVjdC5sb2NhdGlvbiAhPSBudWxsICYmIG9iamVjdC5sb2NhdGlvbi5zdHJlZXRfYWRkcmVzcyAhPSBudWxsKSA/ICc8bGk+JyArIG9iamVjdC5sb2NhdGlvbi5zdHJlZXRfYWRkcmVzcyArICc8L2xpPicgOiAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbkRhdGEgKz0gKG9iamVjdC5sb2NhdGlvbiAhPSBudWxsICYmIG9iamVjdC5sb2NhdGlvbi5wb3N0YWxfY29kZSAhPSBudWxsKSA/ICc8bGk+JyArIG9iamVjdC5sb2NhdGlvbi5wb3N0YWxfY29kZSArICc8L2xpPicgOiAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbkRhdGEgKz0gKG9iamVjdC5sb2NhdGlvbiAhPSBudWxsICYmIG9iamVjdC5sb2NhdGlvbi5jaXR5ICE9IG51bGwpID8gJzxpbD4nICsgb2JqZWN0LmxvY2F0aW9uLmNpdHkgKyAnPC9saT4nIDogJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbG9jYXRpb24gPSAobG9jYXRpb25EYXRhKSA/ICc8c2VjdGlvbiBjbGFzcz1cImFjY29yZGlvbi1zZWN0aW9uXCI+PGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJhY3RpdmUtc2VjdGlvblwiIGlkPVwiYWNjb3JkaW9uLXNlY3Rpb24tMlwiPjxsYWJlbCBjbGFzcz1cImFjY29yZGlvbi10b2dnbGVcIiBmb3I9XCJhY2NvcmRpb24tc2VjdGlvbi0yXCI+PGgyPlBsYXRzPC9oMj48L2xhYmVsPjxkaXYgY2xhc3M9XCJhY2NvcmRpb24tY29udGVudFwiPjx1bD4nICsgbG9jYXRpb25EYXRhICsgJzwvdWw+PC9kaXY+PC9zZWN0aW9uPicgOiAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGFsVGVtcGxhdGUgPSBtb2RhbFRlbXBsYXRlLnJlcGxhY2UoJ3tldmVudC1tb2RhbC1sb2NhdGlvbn0nLCBsb2NhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBCb29va2luZyBhY2NvcmRpb24gc2VjdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGJvb2tpbmdEYXRhID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib29raW5nRGF0YSArPSAob2JqZWN0LmJvb2tpbmdfcGhvbmUgIT0gbnVsbCkgPyAnPGxpPlRlbGVmb246ICcgKyBvYmplY3QuYm9va2luZ19waG9uZSArICc8L2xpPicgOiAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib29raW5nRGF0YSArPSAob2JqZWN0LnByaWNlX2FkdWx0ICE9IG51bGwpID8gJzxsaT5QcmlzOiAnICsgb2JqZWN0LnByaWNlX2FkdWx0ICsgJyBrcjwvbGk+JyA6ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvb2tpbmdEYXRhICs9IChvYmplY3QucHJpY2VfY2hpbGRyZW4gIT0gbnVsbCkgPyAnPGxpPkJhcm5wcmlzOiAnICsgb2JqZWN0LnByaWNlX2NoaWxkcmVuICsgJyBrcjwvbGk+JyA6ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvb2tpbmdEYXRhICs9IChvYmplY3QucHJpY2Vfc2VuaW9yICE9IG51bGwpID8gJzxsaT5QZW5zaW9uw6Ryc3ByaXM6ICcgKyBvYmplY3QucHJpY2Vfc2VuaW9yICsgJyBrcjwvbGk+JyA6ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvb2tpbmdEYXRhICs9IChvYmplY3QucHJpY2Vfc3R1ZGVudCAhPSBudWxsKSA/ICc8bGk+U3R1ZGVudHByaXM6ICcgKyBvYmplY3QucHJpY2Vfc3R1ZGVudCArICcga3I8L2xpPicgOiAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib29raW5nRGF0YSArPSAob2JqZWN0LmFnZV9yZXN0cmljdGlvbiAhPSBudWxsKSA/ICc8bGk+w4VsZGVyc2dyw6RuczogJyArIG9iamVjdC5hZ2VfcmVzdHJpY3Rpb24gKyAnIGtyPC9saT4nIDogJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWVtYmVyc2hpcENhcmRzID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICQuZWFjaChvYmplY3QubWVtYmVyc2hpcF9jYXJkcywgZnVuY3Rpb24oY2FyZGluZGV4LGNhcmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZW1iZXJzaGlwQ2FyZHMgPSBtZW1iZXJzaGlwQ2FyZHMgKyAnPGxpPicgKyBjYXJkLnBvc3RfdGl0bGUgKyAnPC9saT4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib29raW5nRGF0YSArPSAobWVtYmVyc2hpcENhcmRzKSA/ICc8bGk+Jm5ic3A7PC9saT48bGk+PHN0cm9uZz5JbmfDpXIgaSBtZWRsZW1za29ydDwvc3Ryb25nPjwvbGk+JyArIG1lbWJlcnNoaXBDYXJkcyA6ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvb2tpbmdEYXRhICs9IChvYmplY3QuYm9va2luZ19saW5rICE9IG51bGwpID8gJzxsaT4mbmJzcDs8L2xpPjxsaT48YSBocmVmPVwiJyArIG9iamVjdC5ib29raW5nX2xpbmsgKyAnXCIgY2xhc3M9XCJsaW5rLWl0ZW1cIiB0YXJnZXQ9XCJfYmxhbmtcIj5Cb2thIGJsamV0dGVyIGjDpHI8L2E+PC9saT4nIDogJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYm9va2luZyA9IChib29raW5nRGF0YSkgPyAnPHNlY3Rpb24gY2xhc3M9XCJhY2NvcmRpb24tc2VjdGlvblwiPjxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwiYWN0aXZlLXNlY3Rpb25cIiBpZD1cImFjY29yZGlvbi1zZWN0aW9uLTNcIj48bGFiZWwgY2xhc3M9XCJhY2NvcmRpb24tdG9nZ2xlXCIgZm9yPVwiYWNjb3JkaW9uLXNlY3Rpb24tM1wiPjxoMj5Cb2tuaW5nPC9oMj48L2xhYmVsPjxkaXYgY2xhc3M9XCJhY2NvcmRpb24tY29udGVudFwiPjx1bD4nICsgYm9va2luZ0RhdGEgKyAnPC91bD48L2Rpdj48L3NlY3Rpb24+JyA6ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9kYWxUZW1wbGF0ZSA9IG1vZGFsVGVtcGxhdGUucmVwbGFjZSgne2V2ZW50LW1vZGFsLWJvb2tpbmd9JywgYm9va2luZyk7XG5cbiAgICAgICAgICAgICAgICAgICAgJCgnI21vZGFsLWV2ZW50JykucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgICQoJ2JvZHknKS5hcHBlbmQobW9kYWxUZW1wbGF0ZSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICB9O1xuXG4gICAgcmV0dXJuIG5ldyBUZW1wbGF0ZVBhcnNlcigpO1xuXG59KShqUXVlcnkpO1xuIl19
