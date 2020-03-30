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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImV2ZW50LW1hcC5qcyIsImV2ZW50LXBhZ2luYXRpb24uanMiLCJldmVudC1zdWJtaXQuanMiLCJldmVudC13aWRnZXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3cUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJldmVudC1pbnRlZ3JhdGlvbi1mcm9udC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuRXZlbnRNYW5hZ2VySW50ZWdyYXRpb24gPSBFdmVudE1hbmFnZXJJbnRlZ3JhdGlvbiB8fCB7fTtcbkV2ZW50TWFuYWdlckludGVncmF0aW9uLkV2ZW50ID0gRXZlbnRNYW5hZ2VySW50ZWdyYXRpb24uRXZlbnQgfHwge307XG5cbkV2ZW50TWFuYWdlckludGVncmF0aW9uLkV2ZW50Lk1hcCA9IChmdW5jdGlvbigpIHtcblxuICAgIGZ1bmN0aW9uIE1hcCgpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBnb29nbGUgPT09ICdvYmplY3QnICYmIHR5cGVvZiBnb29nbGUubWFwcyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgTWFwLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtYXBFbGVtZW50LFxuICAgICAgICAgICAgcG9zaXRpb24sXG4gICAgICAgICAgICBtYXBPcHRpb25zLFxuICAgICAgICAgICAgbWFwLFxuICAgICAgICAgICAgbWFya2VyLFxuICAgICAgICAgICAgaW5mb3dpbmRvdyxcbiAgICAgICAgICAgIGxvY2F0aW9uVGl0bGU7XG5cbiAgICAgICAgbWFwRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdldmVudC1tYXAnKTtcblxuICAgICAgICBpZiAoIW1hcEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHBvc2l0aW9uID0ge1xuICAgICAgICAgICAgbGF0OiBwYXJzZUZsb2F0KG1hcEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWxhdCcpKSxcbiAgICAgICAgICAgIGxuZzogcGFyc2VGbG9hdChtYXBFbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1sbmcnKSlcbiAgICAgICAgfTtcblxuICAgICAgICBtYXBPcHRpb25zID0ge1xuICAgICAgICAgICAgem9vbTogMTUsXG4gICAgICAgICAgICBjZW50ZXI6IHBvc2l0aW9uLFxuICAgICAgICAgICAgZGlzYWJsZURlZmF1bHRVSTogZmFsc2VcbiAgICAgICAgfTtcblxuICAgICAgICBtYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKG1hcEVsZW1lbnQsIG1hcE9wdGlvbnMpO1xuICAgICAgICBsb2NhdGlvblRpdGxlID0gbWFwRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGl0bGUnKSA/IG1hcEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXRpdGxlJykgOiAnJztcblxuICAgICAgICBpbmZvd2luZG93ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coe1xuICAgICAgICAgICAgY29udGVudDogJzxiPicgKyBsb2NhdGlvblRpdGxlICsgJzwvYj4nXG4gICAgICAgIH0pO1xuXG4gICAgICAgIG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xuICAgICAgICAgICAgcG9zaXRpb246IHBvc2l0aW9uLFxuICAgICAgICAgICAgbWFwOiBtYXBcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGxvY2F0aW9uVGl0bGUpIHtcbiAgICAgICAgICAgIG1hcmtlci5hZGRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpbmZvd2luZG93Lm9wZW4obWFwLCBtYXJrZXIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIG5ldyBNYXAoKTtcbn0pKCk7XG4iLCIvLyBJbml0XG52YXIgRXZlbnRNYW5hZ2VySW50ZWdyYXRpb24gPSB7fTtcblxuLy8gSW5pdCBldmVudCBwYWdpbmF0aW9uXG5FdmVudE1hbmFnZXJJbnRlZ3JhdGlvbiA9IEV2ZW50TWFuYWdlckludGVncmF0aW9uIHx8IHt9O1xuRXZlbnRNYW5hZ2VySW50ZWdyYXRpb24uRXZlbnQgPSBFdmVudE1hbmFnZXJJbnRlZ3JhdGlvbi5FdmVudCB8fCB7fTtcblxuRXZlbnRNYW5hZ2VySW50ZWdyYXRpb24uRXZlbnQuTW9kdWxlID0gKGZ1bmN0aW9uICgkKSB7XG5cbiAgICBmdW5jdGlvbiBNb2R1bGUoKSB7XG4gICAgICAgICQoZnVuY3Rpb24oKSB7XG4gICAgICAgIFx0dGhpcy5pbml0RXZlbnRQYWdpbmF0aW9uKCk7XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgLy8gTG9hZCBwYWdpbmF0aW9uIGJhciB0byBldmVudCBtb2R1bGVzXG4gICAgTW9kdWxlLnByb3RvdHlwZS5pbml0RXZlbnRQYWdpbmF0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIFx0JChcIi5tb2R1bGFyaXR5LW1vZC1ldmVudFwiKS5lYWNoKGZ1bmN0aW9uKCBrZXksIHZhbHVlICkge1xuICAgIFx0XHR2YXIgbW9kdWxlSWQgXHQ9ICQodGhpcykuZmluZCgnW2RhdGEtbW9kdWxlLWlkXScpLmF0dHIoJ2RhdGEtbW9kdWxlLWlkJyk7XG4gICAgXHRcdHZhciBwYWdlcyBcdCBcdD0gJCh0aGlzKS5maW5kKCcubW9kdWxlLXBhZ2luYXRpb24nKS5hdHRyKCdkYXRhLXBhZ2VzJyk7XG4gICAgXHRcdHZhciBzaG93QXJyb3dzIFx0PSAkKHRoaXMpLmZpbmQoJy5tb2R1bGUtcGFnaW5hdGlvbicpLmF0dHIoJ2RhdGEtc2hvdy1hcnJvd3MnKTtcbiAgICBcdFx0dmFyIG1vZHVsZSAgIFx0PSAkKHRoaXMpO1xuXG5cdFx0ICAgICQodGhpcykuZmluZCgnLm1vZHVsZS1wYWdpbmF0aW9uJykucGFnaW5hdGlvbih7XG5cdFx0ICAgIFx0cGFnZXM6IHBhZ2VzLFxuXHRcdCAgICBcdGRpc3BsYXllZFBhZ2VzOiA0LFxuXHRcdCAgICAgICAgZWRnZXM6IDAsXG5cdFx0ICAgICAgICBjc3NTdHlsZTogJycsXG5cdFx0ICAgICAgICBlbGxpcHNlUGFnZVNldDogZmFsc2UsXG5cdFx0ICAgICAgICBwcmV2VGV4dDogKHNob3dBcnJvd3MpID8gJyZsYXF1bzsnIDogJycsXG5cdFx0ICAgICAgICBuZXh0VGV4dDogKHNob3dBcnJvd3MpID8gJyZyYXF1bzsnIDogJycsXG5cdFx0ICAgICAgIFx0Y3VycmVudFBhZ2U6IDEsXG5cdFx0ICAgICAgIFx0c2VsZWN0T25DbGljazogZmFsc2UsXG5cdFx0ICAgICAgICBvblBhZ2VDbGljazogZnVuY3Rpb24ocGFnZSwgZXZlbnQpIHtcblx0XHQgICAgICAgIFx0TW9kdWxlLnByb3RvdHlwZS5sb2FkRXZlbnRzKHBhZ2UsIG1vZHVsZUlkLCBtb2R1bGUpO1xuXHRcdCAgICAgICAgXHQkKG1vZHVsZSkuZmluZCgnLm1vZHVsZS1wYWdpbmF0aW9uJykucGFnaW5hdGlvbigncmVkcmF3Jyk7XG5cdFx0ICAgICAgICBcdCQobW9kdWxlKS5maW5kKCcucGFnaW5hdGlvbiBhOm5vdCguY3VycmVudCknKS5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0JCh0aGlzKS5wYXJlbnQoKS5hZGRDbGFzcygnZGlzYWJsZWQgdGVtcG9yYXJ5Jyk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0ICAgICAgICB9LFxuXHRcdCAgICB9KTtcblx0XHR9KTtcbiAgICB9O1xuXG4gICAgLy8gR2V0IGV2ZW50IGxpc3Qgd2l0aCBBamF4IG9uIHBhZ2luYXRpb24gY2xpY2tcbiAgICBNb2R1bGUucHJvdG90eXBlLmxvYWRFdmVudHMgPSBmdW5jdGlvbiAocGFnZSwgbW9kdWxlSWQsIG1vZHVsZSkge1xuXHRcdHZhciBoZWlnaHQgXHQgID0gJChtb2R1bGUpLmZpbmQoJy5ldmVudC1tb2R1bGUtY29udGVudCcpLmhlaWdodCgpO1xuXHQgICAgdmFyIHdpbmRvd1RvcCA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcblx0ICAgIHZhciBtb2R1bGVUb3AgPSAkKG1vZHVsZSkub2Zmc2V0KCkudG9wO1xuXG5cdFx0JC5hamF4KHtcblx0XHRcdHVybDogZXZlbnRpbnRlZ3JhdGlvbi5hamF4dXJsLFxuXHRcdFx0dHlwZTogJ3Bvc3QnLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRhY3Rpb246ICdhamF4X3BhZ2luYXRpb24nLFxuXHRcdFx0XHRwYWdlOiBwYWdlLFxuXHRcdFx0XHRpZDogbW9kdWxlSWRcblx0XHRcdH0sXG5cdFx0XHRiZWZvcmVTZW5kOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0JChtb2R1bGUpLmZpbmQoJy5ldmVudC1tb2R1bGUtbGlzdCcpLnJlbW92ZSgpO1xuXHRcdFx0XHQkKG1vZHVsZSkuZmluZCgnLmV2ZW50LW1vZHVsZS1jb250ZW50JykuYXBwZW5kKCc8ZGl2IGNsYXNzPVwiZXZlbnQtbG9hZGVyXCI+PGRpdiBjbGFzcz1cImxvYWRpbmctd3JhcHBlclwiPjxkaXYgY2xhc3M9XCJsb2FkaW5nXCI+PGRpdj48L2Rpdj48ZGl2PjwvZGl2PjxkaXY+PC9kaXY+PGRpdj48L2Rpdj48L2Rpdj48L2Rpdj48L2Rpdj4nKTtcblx0XHRcdFx0JChtb2R1bGUpLmZpbmQoJy5ldmVudC1sb2FkZXInKS5oZWlnaHQoaGVpZ2h0KTtcblx0XHRcdCAgICBpZiAobW9kdWxlVG9wIDwgd2luZG93VG9wKSB7XG5cdFx0XHRcdFx0JCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe1xuXHRcdFx0ICAgICAgICBzY3JvbGxUb3A6IG1vZHVsZVRvcFxuXHRcdFx0ICAgIFx0fSwgMTAwKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uKGh0bWwpIHtcblx0XHRcdFx0JChtb2R1bGUpLmZpbmQoJy5ldmVudC1tb2R1bGUtY29udGVudCcpLmFwcGVuZChodG1sKS5oaWRlKCkuZmFkZUluKDgwKS5oZWlnaHQoJ2F1dG8nKTtcblx0XHRcdH0sXG5cdFx0XHRlcnJvcjogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCQobW9kdWxlKS5maW5kKCcuZXZlbnQtbW9kdWxlLWNvbnRlbnQnKS5hcHBlbmQoJzx1bCBjbGFzcz1cImV2ZW50LW1vZHVsZS1saXN0XCI+PGxpPjxwPicgKyBldmVudEludGVncmF0aW9uRnJvbnQuZXZlbnRfcGFnaW5hdGlvbl9lcnJvciArICc8L3A+PC9saT48L3VsPicpLmhpZGUoKS5mYWRlSW4oODApLmhlaWdodCgnYXV0bycpO1xuXHRcdFx0fSxcblx0XHRcdGNvbXBsZXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0JChtb2R1bGUpLmZpbmQoJy5ldmVudC1sb2FkZXInKS5yZW1vdmUoKTtcblx0XHRcdFx0JChtb2R1bGUpLmZpbmQoJy5wYWdpbmF0aW9uIC50ZW1wb3JhcnknKS5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCQodGhpcykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkIHRlbXBvcmFyeScpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0sXG5cblx0XHR9KVxuXHR9O1xuXG5cdHJldHVybiBuZXcgTW9kdWxlKCk7XG59KShqUXVlcnkpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyBJbml0IHN1Ym1pdCBldmVudCBmb3JtXG5FdmVudE1hbmFnZXJJbnRlZ3JhdGlvbiA9IEV2ZW50TWFuYWdlckludGVncmF0aW9uIHx8IHt9O1xuRXZlbnRNYW5hZ2VySW50ZWdyYXRpb24uRXZlbnQgPSBFdmVudE1hbmFnZXJJbnRlZ3JhdGlvbi5FdmVudCB8fCB7fTtcblxuRXZlbnRNYW5hZ2VySW50ZWdyYXRpb24uRXZlbnQuRm9ybSA9IChmdW5jdGlvbigkKSB7XG4gICAgZnVuY3Rpb24gRm9ybSgpIHtcbiAgICAgICAgJCgnLnN1Ym1pdC1ldmVudCcpLmVhY2goXG4gICAgICAgICAgICBmdW5jdGlvbihpbmRleCwgZXZlbnRGb3JtKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFwaVVybCA9IGV2ZW50aW50ZWdyYXRpb24uYXBpdXJsO1xuICAgICAgICAgICAgICAgIGFwaVVybCA9IGFwaVVybC5yZXBsYWNlKC9cXC8kLywgJycpO1xuXG4gICAgICAgICAgICAgICAgJCgnI3JlY3VycmluZy1ldmVudCcsIGV2ZW50Rm9ybSlcbiAgICAgICAgICAgICAgICAgICAgLmNoaWxkcmVuKCcuYm94JylcbiAgICAgICAgICAgICAgICAgICAgLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZUV2ZW50cygkKGV2ZW50Rm9ybSksIGFwaVVybCk7XG4gICAgICAgICAgICAgICAgdGhpcy5oeXBlcmZvcm1FeHRlbnNpb25zKGV2ZW50Rm9ybSk7XG4gICAgICAgICAgICAgICAgdGhpcy5kYXRlUGlja2VyU2V0dGluZ3MoKTtcblxuICAgICAgICAgICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9jYXRpb24nKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRQb3N0VHlwZSgkKGV2ZW50Rm9ybSksIGFwaVVybCwgJ2xvY2F0aW9uJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnb3JnYW5pemVyJykgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkUG9zdFR5cGUoJChldmVudEZvcm0pLCBhcGlVcmwsICdvcmdhbml6ZXInKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1c2VyX2dyb3VwcycpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZFRheG9ub215KCQoZXZlbnRGb3JtKSwgYXBpVXJsLCAndXNlcl9ncm91cHMnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdldmVudF9jYXRlZ29yaWVzJykgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkVGF4b25vbXkoJChldmVudEZvcm0pLCBhcGlVcmwsICdldmVudF9jYXRlZ29yaWVzJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZXZlbnRfdGFncycpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZFRheG9ub215KCQoZXZlbnRGb3JtKSwgYXBpVXJsLCAnZXZlbnRfdGFncycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0uYmluZCh0aGlzKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBjdXN0b20gdmFsaWRhdGlvbnMgd2l0aCBIeXBlcmZvcm1cbiAgICAgKi9cbiAgICBGb3JtLnByb3RvdHlwZS5oeXBlcmZvcm1FeHRlbnNpb25zID0gZnVuY3Rpb24oZXZlbnRGb3JtKSB7XG4gICAgICAgIC8vIE1hdGNoIGVtYWlsIGFkZHJlc3Nlc1xuXG4gICAgICAgIGlmICgnc3VibWl0dGVyX3JlcGVhdF9lbWFpbCcgaW4gZXZlbnRGb3JtKSB7XG4gICAgICAgICAgICBoeXBlcmZvcm0uYWRkVmFsaWRhdG9yKGV2ZW50Rm9ybS5zdWJtaXR0ZXJfcmVwZWF0X2VtYWlsLCBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgdmFyIHZhbGlkID0gZWxlbWVudC52YWx1ZSA9PT0gZXZlbnRGb3JtLnN1Ym1pdHRlcl9lbWFpbC52YWx1ZTtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnNldEN1c3RvbVZhbGlkaXR5KHZhbGlkID8gJycgOiBldmVudEludGVncmF0aW9uRnJvbnQuZW1haWxfbm90X21hdGNoaW5nKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB2YWxpZDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCdpbWFnZV9pbnB1dCcgaW4gZXZlbnRGb3JtKSB7XG4gICAgICAgICAgICBoeXBlcmZvcm0uYWRkVmFsaWRhdG9yKGV2ZW50Rm9ybS5pbWFnZV9pbnB1dCwgZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICAgICAgICAgIGlmICghJCgnI2ltYWdlX2lucHV0JykucHJvcCgncmVxdWlyZWQnKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgdmFsaWQgPSBlbGVtZW50LmZpbGVzLmxlbmd0aCA+IDAsXG4gICAgICAgICAgICAgICAgICAgIG5vdGljZSA9IGV2ZW50Rm9ybS5xdWVyeVNlbGVjdG9yKCcuaW1hZ2Utbm90aWNlJyksXG4gICAgICAgICAgICAgICAgICAgIG5vdGljZUh0bWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIXZhbGlkICYmICFub3RpY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgbm90aWNlSHRtbC5pbm5lckhUTUwgPSBldmVudEludGVncmF0aW9uRnJvbnQubXVzdF91cGxvYWRfaW1hZ2U7XG4gICAgICAgICAgICAgICAgICAgIG5vdGljZUh0bWwuY2xhc3NOYW1lID0gJ3RleHQtZGFuZ2VyIGltYWdlLW5vdGljZSc7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50Rm9ybS5xdWVyeVNlbGVjdG9yKCcuaW1hZ2UtYm94JykuYXBwZW5kQ2hpbGQobm90aWNlSHRtbCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZWxlbWVudC5zZXRDdXN0b21WYWxpZGl0eSh2YWxpZCA/ICcnIDogZXZlbnRJbnRlZ3JhdGlvbkZyb250Lm11c3RfdXBsb2FkX2ltYWdlKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB2YWxpZDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIEdldCB0YXhvbm9taWVzIGZyb20gQVBJIGFuZCBhZGQgdG8gc2VsZWN0IGJveFxuICAgIEZvcm0ucHJvdG90eXBlLmxvYWRUYXhvbm9teSA9IGZ1bmN0aW9uKGV2ZW50Rm9ybSwgcmVzb3VyY2UsIHRheG9ub215KSB7XG4gICAgICAgIHJlc291cmNlICs9ICcvJyArIHRheG9ub215ICsgJz9fanNvbnA9JyArIHRheG9ub215ICsgJyZwZXJfcGFnZT0xMDAnO1xuICAgICAgICB2YXIgc2VsZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGF4b25vbXkpO1xuXG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB0eXBlOiAnR0VUJyxcbiAgICAgICAgICAgIHVybDogcmVzb3VyY2UsXG4gICAgICAgICAgICBjYWNoZTogZmFsc2UsXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb25wJyxcbiAgICAgICAgICAgIGpzb25wQ2FsbGJhY2s6IHRheG9ub215LFxuICAgICAgICAgICAgY3Jvc3NEb21haW46IHRydWUsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIC8vIENsZWFyIHNlbGVjdFxuICAgICAgICAgICAgICAgICQoc2VsZWN0KS5odG1sKCcnKTtcblxuICAgICAgICAgICAgICAgIC8vIE1hcCB1cCBhbmQgcG9wdWxhdGUgaGllcmFyY2hpY2FsIHRheG9ub21pZXNcbiAgICAgICAgICAgICAgICBpZiAodGF4b25vbXkgPT09ICd1c2VyX2dyb3VwcycgfHwgdGF4b25vbXkgPT09ICdldmVudF9jYXRlZ29yaWVzJykge1xuXG4gICAgICAgICAgICAgICAgICB2YXIgdGF4b25vbWllcyA9IEZvcm0ucHJvdG90eXBlLmhpZXJhcmNoaWNhbFRheChyZXNwb25zZSk7XG5cbiAgICAgICAgICAgICAgICAgIC8vIEFkZCBzZWxlY3Qgb3B0aW9uIGFuZCBpdCdzIGNoaWxkcmVuIHRheG9ub21pZXNcbiAgICAgICAgICAgICAgICAgICQodGF4b25vbWllcy5jaGlsZHJlbikuZWFjaChmdW5jdGlvbiAoaW5kZXgsIHRheCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBQYXJlbnQgb3B0aW9uXG4gICAgICAgICAgICAgICAgICAgIEZvcm0ucHJvdG90eXBlLmFkZE9wdGlvbih0YXgsIHNlbGVjdCwgJycpO1xuICAgICAgICAgICAgICAgICAgICAkKHRheC5jaGlsZHJlbikuZWFjaChmdW5jdGlvbiAoaW5kZXgsIHRheCkge1xuICAgICAgICAgICAgICAgICAgICAgIC8vIENoaWxkcmVuIG9wdGlvblxuICAgICAgICAgICAgICAgICAgICAgIEZvcm0ucHJvdG90eXBlLmFkZE9wdGlvbih0YXgsIHNlbGVjdCwgJyDigJMgJyk7XG4gICAgICAgICAgICAgICAgICAgICAgJCh0YXguY2hpbGRyZW4pLmVhY2goZnVuY3Rpb24gKGluZGV4LCB0YXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdyYW5kIGNoaWxkcmVuIG9wdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgICAgIEZvcm0ucHJvdG90eXBlLmFkZE9wdGlvbih0YXgsIHNlbGVjdCwgJyDigJMg4oCTICcpO1xuICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAvLyBQb3B1bGF0ZSBub24gaGllcmFyY2hpY2FsIHRheG9ub215IGxpc3RzXG4gICAgICAgICAgICAgICAgICB2YXIgdGF4b25vbWllcyA9IHJlc3BvbnNlO1xuICAgICAgICAgICAgICAgICAgJCh0YXhvbm9taWVzKS5lYWNoKGZ1bmN0aW9uIChpbmRleCwgdGVybSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgb3B0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICAgICAgICAgICAgICAgIG9wdC52YWx1ZSA9IHRlcm0uaWQ7XG4gICAgICAgICAgICAgICAgICAgIG9wdC5pbm5lckhUTUwgKz0gdGVybS5uYW1lO1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3QuYXBwZW5kQ2hpbGQob3B0KTtcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBGb3JtLnByb3RvdHlwZS5hZGRPcHRpb24gPSBmdW5jdGlvbih0YXhvbm9teSwgc2VsZWN0LCBkZXB0aCkge1xuICAgICAgICB2YXIgb3B0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICAgIG9wdC52YWx1ZSA9IHRheG9ub215LmRhdGEuaWQ7XG4gICAgICAgIG9wdC5pbm5lckhUTUwgKz0gZGVwdGg7XG4gICAgICAgIG9wdC5pbm5lckhUTUwgKz0gdGF4b25vbXkuZGF0YS5uYW1lO1xuICAgICAgICBzZWxlY3QuYXBwZW5kQ2hpbGQob3B0KTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gVHJlZU5vZGUoZGF0YSkge1xuICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgICAgICB0aGlzLnBhcmVudCA9IG51bGw7XG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcbiAgICB9XG5cbiAgICBUcmVlTm9kZS5jb21wYXJlciA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIGEuZGF0YS5uYW1lIDwgYi5kYXRhLm5hbWUgPyAwIDogMTtcbiAgICB9O1xuXG4gICAgVHJlZU5vZGUucHJvdG90eXBlLnNvcnRSZWN1cnNpdmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5zb3J0KEZvcm0ucHJvdG90eXBlLmNvbXBhcmVyKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbltpXS5zb3J0UmVjdXJzaXZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8vIExpc3QgdGF4b25vbXkgb2JqZWN0cyBoaWVyYXJjaGljYWxcbiAgICBGb3JtLnByb3RvdHlwZS5oaWVyYXJjaGljYWxUYXggPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIHZhciBub2RlQnlJZCA9IHt9LFxuICAgICAgICAgICAgaSA9IDAsXG4gICAgICAgICAgICBsID0gZGF0YS5sZW5ndGgsXG4gICAgICAgICAgICBub2RlO1xuXG4gICAgICAgIC8vIFJvb3Qgbm9kZVxuICAgICAgICBub2RlQnlJZFswXSA9IG5ldyBUcmVlTm9kZSgpO1xuXG4gICAgICAgIC8vIE1ha2UgVHJlZU5vZGUgb2JqZWN0cyBmb3IgZWFjaCBpdGVtXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIG5vZGVCeUlkW2RhdGFbaV0uaWRdID0gbmV3IFRyZWVOb2RlKGRhdGFbaV0pO1xuICAgICAgICB9XG4gICAgICAgIC8vIExpbmsgYWxsIFRyZWVOb2RlIG9iamVjdHNcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgbm9kZSA9IG5vZGVCeUlkW2RhdGFbaV0uaWRdO1xuICAgICAgICAgICAgbm9kZS5wYXJlbnQgPSBub2RlQnlJZFtub2RlLmRhdGEucGFyZW50XTtcbiAgICAgICAgICAgIG5vZGUucGFyZW50LmNoaWxkcmVuLnB1c2gobm9kZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbm9kZUJ5SWRbMF0uc29ydFJlY3Vyc2l2ZSgpO1xuICAgIH07XG5cbiAgICAvLyBHZXQgYSBwb3N0IHR5cGUgZnJvbSBBUEkgYW5kIGFkZCB0byBpbnB1dCBpbml0IGF1dG9jb21wbGV0ZVxuICAgIEZvcm0ucHJvdG90eXBlLmxvYWRQb3N0VHlwZSA9IGZ1bmN0aW9uKGV2ZW50Rm9ybSwgcmVzb3VyY2UsIHBvc3RUeXBlKSB7XG4gICAgICAgIHJlc291cmNlICs9ICcvJyArIHBvc3RUeXBlICsgJy9jb21wbGV0ZT9fanNvbnA9Z2V0JyArIHBvc3RUeXBlO1xuICAgICAgICBuZXcgYXV0b0NvbXBsZXRlKHtcbiAgICAgICAgICAgIHNlbGVjdG9yOiAnIycgKyBwb3N0VHlwZSArICctc2VsZWN0b3InLFxuICAgICAgICAgICAgbWluQ2hhcnM6IDEsXG4gICAgICAgICAgICBzb3VyY2U6IGZ1bmN0aW9uKHRlcm0sIHN1Z2dlc3QpIHtcbiAgICAgICAgICAgICAgICB0ZXJtID0gdGVybS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdHRVQnLFxuICAgICAgICAgICAgICAgICAgICB1cmw6IHJlc291cmNlLFxuICAgICAgICAgICAgICAgICAgICBjYWNoZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbnAnLFxuICAgICAgICAgICAgICAgICAgICBqc29ucENhbGxiYWNrOiAnZ2V0JyArIHBvc3RUeXBlLFxuICAgICAgICAgICAgICAgICAgICBjcm9zc0RvbWFpbjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdWdnZXN0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgJChyZXNwb25zZSkuZWFjaChmdW5jdGlvbihpbmRleCwgaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh+aXRlbS50aXRsZS50b0xvd2VyQ2FzZSgpLmluZGV4T2YodGVybSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Z2dlc3Rpb25zLnB1c2goW2l0ZW0udGl0bGUsIGl0ZW0uaWQsIHBvc3RUeXBlXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Z2dlc3Qoc3VnZ2VzdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlbmRlckl0ZW06IGZ1bmN0aW9uKGl0ZW0sIHNlYXJjaCkge1xuICAgICAgICAgICAgICAgIHNlYXJjaCA9IHNlYXJjaC5yZXBsYWNlKC9bLVxcL1xcXFxeJCorPy4oKXxbXFxde31dL2csICdcXFxcJCYnKTtcbiAgICAgICAgICAgICAgICB2YXIgcmUgPSBuZXcgUmVnRXhwKCcoJyArIHNlYXJjaC5zcGxpdCgnICcpLmpvaW4oJ3wnKSArICcpJywgJ2dpJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJhdXRvY29tcGxldGUtc3VnZ2VzdGlvblwiIGRhdGEtdHlwZT1cIicgK1xuICAgICAgICAgICAgICAgICAgICBpdGVtWzJdICtcbiAgICAgICAgICAgICAgICAgICAgJ1wiIGRhdGEtbGFuZ25hbWU9XCInICtcbiAgICAgICAgICAgICAgICAgICAgaXRlbVswXSArXG4gICAgICAgICAgICAgICAgICAgICdcIiBkYXRhLWxhbmc9XCInICtcbiAgICAgICAgICAgICAgICAgICAgaXRlbVsxXSArXG4gICAgICAgICAgICAgICAgICAgICdcIiBkYXRhLXZhbD1cIicgK1xuICAgICAgICAgICAgICAgICAgICBzZWFyY2ggK1xuICAgICAgICAgICAgICAgICAgICAnXCI+ICcgK1xuICAgICAgICAgICAgICAgICAgICBpdGVtWzBdLnJlcGxhY2UocmUsICc8Yj4kMTwvYj4nKSArXG4gICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvblNlbGVjdDogZnVuY3Rpb24oZSwgdGVybSwgaXRlbSkge1xuICAgICAgICAgICAgICAgICQoJyMnICsgaXRlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdHlwZScpICsgJy1zZWxlY3RvcicpLnZhbChcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtbGFuZ25hbWUnKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgJCgnIycgKyBpdGVtLmdldEF0dHJpYnV0ZSgnZGF0YS10eXBlJykpLnZhbChpdGVtLmdldEF0dHJpYnV0ZSgnZGF0YS1sYW5nJykpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8vIFNhdmUrZm9ybWF0IGlucHV0IGRhdGEgYW5kIHJldHVybiBhcyBvYmplY3RcbiAgICBGb3JtLnByb3RvdHlwZS5qc29uRGF0YSA9IGZ1bmN0aW9uKGZvcm0pIHtcbiAgICAgICAgdmFyIGFyckRhdGEgPSBmb3JtLnNlcmlhbGl6ZUFycmF5KCksXG4gICAgICAgICAgICBvYmpEYXRhID0ge30sXG4gICAgICAgICAgICBncm91cHMgPSBbXSxcbiAgICAgICAgICAgIGNhdGVnb3JpZXMgPSBbXSxcbiAgICAgICAgICAgIHRhZ3MgPSBbXTtcblxuICAgICAgICAkLmVhY2goYXJyRGF0YSwgZnVuY3Rpb24oaW5kZXgsIGVsZW0pIHtcbiAgICAgICAgICAgIHN3aXRjaCAoZWxlbS5uYW1lKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAndXNlcl9ncm91cHMnOlxuICAgICAgICAgICAgICAgICAgICBncm91cHMgPSAkLm1hcChlbGVtLnZhbHVlLnNwbGl0KCcsJyksIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQodmFsdWUsIDEwKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2V2ZW50X2NhdGVnb3JpZXMnOlxuICAgICAgICAgICAgICAgICAgICBjYXRlZ29yaWVzLnB1c2gocGFyc2VJbnQoZWxlbS52YWx1ZSkpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdldmVudF90YWdzJzpcbiAgICAgICAgICAgICAgICAgICAgdGFncy5wdXNoKHBhcnNlSW50KGVsZW0udmFsdWUpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgb2JqRGF0YVtlbGVtLm5hbWVdID0gZWxlbS52YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gT2NjYXNpb25cbiAgICAgICAgb2JqRGF0YVsnb2NjYXNpb25zJ10gPSBbXTtcbiAgICAgICAgJCgnLm9jY3VyYW5jZS1ncm91cC1zaW5nbGUnLCBmb3JtKS5lYWNoKGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgICAgICB2YXIgc3RhcnREYXRlID0gRm9ybS5wcm90b3R5cGUuZm9ybWF0RGF0ZShcbiAgICAgICAgICAgICAgICAkKCdbbmFtZT1cInN0YXJ0X2RhdGVcIl0nLCB0aGlzKS52YWwoKSxcbiAgICAgICAgICAgICAgICAkKCdbbmFtZT1cInN0YXJ0X3RpbWVfaFwiXScsIHRoaXMpLnZhbCgpLFxuICAgICAgICAgICAgICAgICQoJ1tuYW1lPVwic3RhcnRfdGltZV9tXCJdJywgdGhpcykudmFsKClcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB2YXIgZW5kRGF0ZSA9IEZvcm0ucHJvdG90eXBlLmZvcm1hdERhdGUoXG4gICAgICAgICAgICAgICAgJCgnW25hbWU9XCJlbmRfZGF0ZVwiXScsIHRoaXMpLnZhbCgpLFxuICAgICAgICAgICAgICAgICQoJ1tuYW1lPVwiZW5kX3RpbWVfaFwiXScsIHRoaXMpLnZhbCgpLFxuICAgICAgICAgICAgICAgICQoJ1tuYW1lPVwiZW5kX3RpbWVfbVwiXScsIHRoaXMpLnZhbCgpXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKHN0YXJ0RGF0ZSAmJiBlbmREYXRlKSB7XG4gICAgICAgICAgICAgICAgb2JqRGF0YVsnb2NjYXNpb25zJ10ucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0X2RhdGU6IHN0YXJ0RGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgZW5kX2RhdGU6IGVuZERhdGUsXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogJ3NjaGVkdWxlZCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRfbW9kZTogJ21hc3RlcicsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFJlY3VycmluZyBvY2Nhc2lvbnNcbiAgICAgICAgb2JqRGF0YVsncmNyX3J1bGVzJ10gPSBbXTtcbiAgICAgICAgJCgnLm9jY3VyYW5jZS1ncm91cC1yZWN1cnJpbmcnLCBmb3JtKS5lYWNoKGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgICAgICB2YXIgcmNyU3RhcnRIID0gJCgnW25hbWU9XCJyZWN1cnJpbmdfc3RhcnRfaFwiXScsIHRoaXMpLnZhbCgpLFxuICAgICAgICAgICAgICAgIHJjclN0YXJ0TSA9ICQoJ1tuYW1lPVwicmVjdXJyaW5nX3N0YXJ0X21cIl0nLCB0aGlzKS52YWwoKTtcbiAgICAgICAgICAgIHZhciByY3JTdGFydFRpbWUgPVxuICAgICAgICAgICAgICAgIHJjclN0YXJ0SCAmJiByY3JTdGFydE1cbiAgICAgICAgICAgICAgICAgICAgPyBGb3JtLnByb3RvdHlwZS5hZGRaZXJvKHJjclN0YXJ0SCkgK1xuICAgICAgICAgICAgICAgICAgICAgICc6JyArXG4gICAgICAgICAgICAgICAgICAgICAgRm9ybS5wcm90b3R5cGUuYWRkWmVybyhyY3JTdGFydE0pICtcbiAgICAgICAgICAgICAgICAgICAgICAnOicgK1xuICAgICAgICAgICAgICAgICAgICAgICcwMCdcbiAgICAgICAgICAgICAgICAgICAgOiBmYWxzZTtcbiAgICAgICAgICAgIHZhciByY3JFbmRIID0gJCgnW25hbWU9XCJyZWN1cnJpbmdfZW5kX2hcIl0nLCB0aGlzKS52YWwoKSxcbiAgICAgICAgICAgICAgICByY3JFbmRNID0gJCgnW25hbWU9XCJyZWN1cnJpbmdfZW5kX21cIl0nLCB0aGlzKS52YWwoKTtcbiAgICAgICAgICAgIHZhciByY3JFbmRUaW1lID1cbiAgICAgICAgICAgICAgICByY3JFbmRIICYmIHJjckVuZE1cbiAgICAgICAgICAgICAgICAgICAgPyBGb3JtLnByb3RvdHlwZS5hZGRaZXJvKHJjckVuZEgpICtcbiAgICAgICAgICAgICAgICAgICAgICAnOicgK1xuICAgICAgICAgICAgICAgICAgICAgIEZvcm0ucHJvdG90eXBlLmFkZFplcm8ocmNyRW5kTSkgK1xuICAgICAgICAgICAgICAgICAgICAgICc6JyArXG4gICAgICAgICAgICAgICAgICAgICAgJzAwJ1xuICAgICAgICAgICAgICAgICAgICA6IGZhbHNlO1xuICAgICAgICAgICAgdmFyIHJjclN0YXJ0RGF0ZSA9IEZvcm0ucHJvdG90eXBlLmlzVmFsaWREYXRlKFxuICAgICAgICAgICAgICAgICQoJ1tuYW1lPVwicmVjdXJyaW5nX3N0YXJ0X2RcIl0nLCB0aGlzKS52YWwoKVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgID8gJCgnW25hbWU9XCJyZWN1cnJpbmdfc3RhcnRfZFwiXScsIHRoaXMpLnZhbCgpXG4gICAgICAgICAgICAgICAgOiBmYWxzZTtcbiAgICAgICAgICAgIHZhciByY3JFbmREYXRlID0gRm9ybS5wcm90b3R5cGUuaXNWYWxpZERhdGUoJCgnW25hbWU9XCJyZWN1cnJpbmdfZW5kX2RcIl0nLCB0aGlzKS52YWwoKSlcbiAgICAgICAgICAgICAgICA/ICQoJ1tuYW1lPVwicmVjdXJyaW5nX2VuZF9kXCJdJywgdGhpcykudmFsKClcbiAgICAgICAgICAgICAgICA6IGZhbHNlO1xuXG4gICAgICAgICAgICBpZiAocmNyU3RhcnRUaW1lICYmIHJjckVuZFRpbWUgJiYgcmNyU3RhcnREYXRlICYmIHJjckVuZERhdGUpIHtcbiAgICAgICAgICAgICAgICBvYmpEYXRhWydyY3JfcnVsZXMnXS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgcmNyX3dlZWtfZGF5OiAkKCdbbmFtZT1cIndlZWtkYXlcIl0nLCB0aGlzKS52YWwoKSxcbiAgICAgICAgICAgICAgICAgICAgcmNyX3dlZWtseV9pbnRlcnZhbDogJCgnW25hbWU9XCJ3ZWVrbHlfaW50ZXJ2YWxcIl0nLCB0aGlzKS52YWwoKSxcbiAgICAgICAgICAgICAgICAgICAgcmNyX3N0YXJ0X3RpbWU6IHJjclN0YXJ0VGltZSxcbiAgICAgICAgICAgICAgICAgICAgcmNyX2VuZF90aW1lOiByY3JFbmRUaW1lLFxuICAgICAgICAgICAgICAgICAgICByY3Jfc3RhcnRfZGF0ZTogcmNyU3RhcnREYXRlLFxuICAgICAgICAgICAgICAgICAgICByY3JfZW5kX2RhdGU6IHJjckVuZERhdGUsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICgkKCcjb3JnYW5pemVyJywgZm9ybSkudmFsKCkpIHtcbiAgICAgICAgICAgIG9iakRhdGFbJ29yZ2FuaXplcnMnXSA9IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG9yZ2FuaXplcjogJChmb3JtKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbmQoJyNvcmdhbml6ZXInKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnZhbCgpLFxuICAgICAgICAgICAgICAgICAgICBtYWluX29yZ2FuaXplcjogdHJ1ZSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFkZCBhY2Nlc3NpYmlsaXR5IGl0ZW1zXG4gICAgICAgIG9iakRhdGFbJ2FjY2Vzc2liaWxpdHknXSA9IFtdO1xuICAgICAgICAkLmVhY2goJChcImlucHV0W25hbWU9J2FjY2Vzc2liaWxpdHknXTpjaGVja2VkXCIpLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIG9iakRhdGFbJ2FjY2Vzc2liaWxpdHknXS5wdXNoKCQodGhpcykudmFsKCkpO1xuICAgICAgICB9KTtcblxuICAgICAgICBvYmpEYXRhWyd1c2VyX2dyb3VwcyddID0gZ3JvdXBzO1xuICAgICAgICBvYmpEYXRhWydldmVudF9jYXRlZ29yaWVzJ10gPSBjYXRlZ29yaWVzO1xuICAgICAgICBvYmpEYXRhWydldmVudF90YWdzJ10gPSB0YWdzO1xuXG4gICAgICAgIHJldHVybiBvYmpEYXRhO1xuICAgIH07XG5cbiAgICAvLyBTZW5kIEFqYXggcmVxdWVzdCB3aXRoIG1lZGlhIGRhdGFcbiAgICBGb3JtLnByb3RvdHlwZS5zdWJtaXRJbWFnZUFqYXggPSBmdW5jdGlvbihldmVudEZvcm0sIGltYWdlRGF0YSkge1xuICAgICAgICBpbWFnZURhdGEuYXBwZW5kKCdhY3Rpb24nLCAnc3VibWl0X2ltYWdlJyk7XG4gICAgICAgIHJldHVybiAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiBldmVudGludGVncmF0aW9uLmFqYXh1cmwsXG4gICAgICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgICAgICBjYWNoZTogZmFsc2UsXG4gICAgICAgICAgICBjb250ZW50VHlwZTogZmFsc2UsXG4gICAgICAgICAgICBwcm9jZXNzRGF0YTogZmFsc2UsXG4gICAgICAgICAgICBkYXRhOiBpbWFnZURhdGEsXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oanFYSFIsIHRleHRTdGF0dXMpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0ZXh0U3RhdHVzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyBTZW5kIEFqYXggcmVxdWVzdCB3aXRoIHBvc3QgZGF0YVxuICAgIEZvcm0ucHJvdG90eXBlLnN1Ym1pdEV2ZW50QWpheCA9IGZ1bmN0aW9uKGV2ZW50Rm9ybSwgZm9ybURhdGEpIHtcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogZXZlbnRpbnRlZ3JhdGlvbi5hamF4dXJsLFxuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIGFjdGlvbjogJ3N1Ym1pdF9ldmVudCcsXG4gICAgICAgICAgICAgICAgZGF0YTogZm9ybURhdGEsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgICAkKCcuc3VibWl0LXN1Y2Nlc3MnLCBldmVudEZvcm0pLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnLnN1Ym1pdC1zdWNjZXNzIC5zdWNjZXNzJywgZXZlbnRGb3JtKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmVtcHR5KClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoJzxpIGNsYXNzPVwiZmEgZmEtc2VuZFwiPjwvaT5FdmVuZW1hbmdldCBoYXIgc2tpY2thdHMhPC9saT4nKTtcbiAgICAgICAgICAgICAgICAgICAgRm9ybS5wcm90b3R5cGUuY2xlYW5Gb3JtKGV2ZW50Rm9ybSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UuZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICQoJy5zdWJtaXQtc3VjY2VzcycsIGV2ZW50Rm9ybSkuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgICAgICAkKCcuc3VibWl0LWVycm9yJywgZXZlbnRGb3JtKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgICAgICQoJy5zdWJtaXQtZXJyb3IgLndhcm5pbmcnLCBldmVudEZvcm0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuZW1wdHkoKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmFwcGVuZCgnPGkgY2xhc3M9XCJmYSBmYS13YXJuaW5nXCI+PC9pPicgKyByZXNwb25zZS5kYXRhICsgJzwvbGk+Jyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbihqcVhIUiwgdGV4dFN0YXR1cykge1xuICAgICAgICAgICAgICAgICQoJy5zdWJtaXQtc3VjY2VzcycsIGV2ZW50Rm9ybSkuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgICQoJy5zdWJtaXQtZXJyb3InLCBldmVudEZvcm0pLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICAkKCcuc3VibWl0LWVycm9yIC53YXJuaW5nJywgZXZlbnRGb3JtKVxuICAgICAgICAgICAgICAgICAgICAuZW1wdHkoKVxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKCc8aSBjbGFzcz1cImZhIGZhLXdhcm5pbmdcIj48L2k+JyArIHRleHRTdGF0dXMgKyAnPC9saT4nKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBGb3JtLnByb3RvdHlwZS5lbmRIb3VyQ2hhbmdlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgdmFyIHdyYXBwZXIgPSBldmVudC50YXJnZXQuY2xvc2VzdCgnLm9jY3VycmVuY2UnKTtcbiAgICAgICAgaWYgKHdyYXBwZXIpIHtcbiAgICAgICAgICAgIHZhciBzdGFydERhdGUgPSB3cmFwcGVyLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWU9XCJzdGFydF9kYXRlXCJdJykudmFsdWUsXG4gICAgICAgICAgICAgICAgZW5kRGF0ZSA9IHdyYXBwZXIucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cImVuZF9kYXRlXCJdJykudmFsdWUsXG4gICAgICAgICAgICAgICAgc3RhcnRUaW1lSCA9IHdyYXBwZXIucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cInN0YXJ0X3RpbWVfaFwiXScpLnZhbHVlO1xuXG4gICAgICAgICAgICBpZiAoc3RhcnREYXRlID49IGVuZERhdGUpIHtcbiAgICAgICAgICAgICAgICBldmVudC50YXJnZXQuc2V0QXR0cmlidXRlKCdtaW4nLCBzdGFydFRpbWVIKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnNldEF0dHJpYnV0ZSgnbWluJywgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgRm9ybS5wcm90b3R5cGUuZW5kTWludXRlQ2hhbmdlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgdmFyIHdyYXBwZXIgPSBldmVudC50YXJnZXQuY2xvc2VzdCgnLm9jY3VycmVuY2UnKTtcbiAgICAgICAgaWYgKHdyYXBwZXIpIHtcbiAgICAgICAgICAgIHZhciBzdGFydERhdGUgPSB3cmFwcGVyLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWU9XCJzdGFydF9kYXRlXCJdJykudmFsdWUsXG4gICAgICAgICAgICAgICAgZW5kRGF0ZSA9IHdyYXBwZXIucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cImVuZF9kYXRlXCJdJykudmFsdWUsXG4gICAgICAgICAgICAgICAgc3RhcnRUaW1lSCA9IHdyYXBwZXIucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cInN0YXJ0X3RpbWVfaFwiXScpLnZhbHVlLFxuICAgICAgICAgICAgICAgIGVuZFRpbWVIID0gd3JhcHBlci5xdWVyeVNlbGVjdG9yKCdpbnB1dFtuYW1lPVwiZW5kX3RpbWVfaFwiXScpLnZhbHVlLFxuICAgICAgICAgICAgICAgIHN0YXJ0VGltZU0gPSB3cmFwcGVyLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWU9XCJzdGFydF90aW1lX21cIl0nKS52YWx1ZTtcblxuICAgICAgICAgICAgaWYgKHN0YXJ0RGF0ZSA+PSBlbmREYXRlICYmIHN0YXJ0VGltZUggPj0gZW5kVGltZUgpIHtcbiAgICAgICAgICAgICAgICBzdGFydFRpbWVNID0gcGFyc2VJbnQoc3RhcnRUaW1lTSkgKyAxMDtcbiAgICAgICAgICAgICAgICBpZiAoc3RhcnRUaW1lTSA+PSA2MCkge1xuICAgICAgICAgICAgICAgICAgICB3cmFwcGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cImVuZF90aW1lX2hcIl0nKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnNldEF0dHJpYnV0ZSgnbWluJywgcGFyc2VJbnQoc3RhcnRUaW1lSCkgKyAxKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBldmVudC50YXJnZXQuc2V0QXR0cmlidXRlKCdtaW4nLCBzdGFydFRpbWVNKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGV2ZW50LnRhcmdldC5zZXRBdHRyaWJ1dGUoJ21pbicsIDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIEZvcm0ucHJvdG90eXBlLmluaXRQaWNrZXJFdmVudCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFtuYW1lPVwic3RhcnRfZGF0ZVwiXScpO1xuICAgICAgICBBcnJheS5mcm9tKGVsZW1lbnRzKS5mb3JFYWNoKFxuICAgICAgICAgICAgZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQub25jaGFuZ2UgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlLnRhcmdldC52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHdyYXBwZXIgPSBlLnRhcmdldC5jbG9zZXN0KCcub2NjdXJyZW5jZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJCh3cmFwcGVyKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maW5kKCdpbnB1dFtuYW1lPVwiZW5kX2RhdGVcIl0nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kYXRlcGlja2VyKCdvcHRpb24nLCAnbWluRGF0ZScsIG5ldyBEYXRlKGUudGFyZ2V0LnZhbHVlKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LmJpbmQodGhpcyk7XG4gICAgICAgICAgICB9LmJpbmQodGhpcylcbiAgICAgICAgKTtcbiAgICB9O1xuXG4gICAgRm9ybS5wcm90b3R5cGUuaW5pdEVuZEhvdXJFdmVudCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFtuYW1lPVwiZW5kX3RpbWVfaFwiXScpO1xuICAgICAgICBBcnJheS5mcm9tKGVsZW1lbnRzKS5mb3JFYWNoKFxuICAgICAgICAgICAgZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQub25jaGFuZ2UgPSB0aGlzLmVuZEhvdXJDaGFuZ2U7XG4gICAgICAgICAgICB9LmJpbmQodGhpcylcbiAgICAgICAgKTtcbiAgICB9O1xuXG4gICAgRm9ybS5wcm90b3R5cGUuaW5pdEVuZE1pbnV0ZUV2ZW50ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBlbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W25hbWU9XCJlbmRfdGltZV9tXCJdJyk7XG4gICAgICAgIEFycmF5LmZyb20oZWxlbWVudHMpLmZvckVhY2goXG4gICAgICAgICAgICBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5vbmNoYW5nZSA9IHRoaXMuZW5kTWludXRlQ2hhbmdlO1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpXG4gICAgICAgICk7XG4gICAgfTtcblxuICAgIEZvcm0ucHJvdG90eXBlLmluaXRSZWN1cnJpbmdFbmRIb3VyRXZlbnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbbmFtZT1cInJlY3VycmluZ19lbmRfaFwiXScpO1xuICAgICAgICBBcnJheS5mcm9tKGVsZW1lbnRzKS5mb3JFYWNoKFxuICAgICAgICAgICAgZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQub25jaGFuZ2UgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgd3JhcHBlciA9IGV2ZW50LnRhcmdldC5jbG9zZXN0KCcub2NjdXJyZW5jZScpO1xuICAgICAgICAgICAgICAgICAgICBpZiAod3JhcHBlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN0YXJ0VGltZUggPSB3cmFwcGVyLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWU9XCJyZWN1cnJpbmdfc3RhcnRfaFwiXScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnNldEF0dHJpYnV0ZSgnbWluJywgc3RhcnRUaW1lSCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpXG4gICAgICAgICk7XG4gICAgfTtcblxuICAgIEZvcm0ucHJvdG90eXBlLmluaXRSZWN1cnJpbmdFbmRNaW51dGVFdmVudCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFtuYW1lPVwicmVjdXJyaW5nX2VuZF9tXCJdJyk7XG4gICAgICAgIEFycmF5LmZyb20oZWxlbWVudHMpLmZvckVhY2goXG4gICAgICAgICAgICBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5vbmNoYW5nZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB3cmFwcGVyID0gZXZlbnQudGFyZ2V0LmNsb3Nlc3QoJy5vY2N1cnJlbmNlJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh3cmFwcGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3RhcnRUaW1lSCA9IHdyYXBwZXIucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cInJlY3VycmluZ19zdGFydF9oXCJdJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZW5kVGltZUggPSB3cmFwcGVyLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWU9XCJyZWN1cnJpbmdfZW5kX2hcIl0nKS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdGFydFRpbWVNID0gd3JhcHBlci5xdWVyeVNlbGVjdG9yKCdpbnB1dFtuYW1lPVwicmVjdXJyaW5nX3N0YXJ0X21cIl0nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC52YWx1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXJ0VGltZUggPj0gZW5kVGltZUgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydFRpbWVNID0gcGFyc2VJbnQoc3RhcnRUaW1lTSkgKyAxMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhcnRUaW1lTSA+PSA2MCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3cmFwcGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cInJlY3VycmluZ19lbmRfaFwiXScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc2V0QXR0cmlidXRlKCdtaW4nLCBwYXJzZUludChzdGFydFRpbWVIKSArIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnRhcmdldC5zZXRBdHRyaWJ1dGUoJ21pbicsIHN0YXJ0VGltZU0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnNldEF0dHJpYnV0ZSgnbWluJywgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpXG4gICAgICAgICk7XG4gICAgfTtcblxuICAgIEZvcm0ucHJvdG90eXBlLmluaXREYXRlRXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIFNpbmdsZSBvY2Nhc2lvbnMgZXZlbnRzXG4gICAgICAgIHRoaXMuaW5pdFBpY2tlckV2ZW50KCk7XG4gICAgICAgIHRoaXMuaW5pdEVuZEhvdXJFdmVudCgpO1xuICAgICAgICB0aGlzLmluaXRFbmRNaW51dGVFdmVudCgpO1xuXG4gICAgICAgIC8vIFJlY3VycmluZyBkYXRlIGV2ZW50c1xuICAgICAgICB0aGlzLmluaXRSZWN1cnJpbmdFbmRIb3VyRXZlbnQoKTtcbiAgICAgICAgdGhpcy5pbml0UmVjdXJyaW5nRW5kTWludXRlRXZlbnQoKTtcbiAgICB9O1xuXG4gICAgRm9ybS5wcm90b3R5cGUuZGF0ZVBpY2tlclNldHRpbmdzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICQuZGF0ZXBpY2tlci5zZXREZWZhdWx0cyh7XG4gICAgICAgICAgICBtaW5EYXRlOiAnbm93JyxcbiAgICAgICAgICAgIG1heERhdGU6IG5ldyBEYXRlKCkuZ2V0RGF0ZSgpICsgMzY1LFxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgRm9ybS5wcm90b3R5cGUuaGFuZGxlRXZlbnRzID0gZnVuY3Rpb24oZXZlbnRGb3JtLCBhcGlVcmwpIHtcbiAgICAgICAgdGhpcy5pbml0RGF0ZUV2ZW50cygpO1xuXG4gICAgICAgICQoZXZlbnRGb3JtKS5vbihcbiAgICAgICAgICAgICdzdWJtaXQnLFxuICAgICAgICAgICAgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgICAgIHZhciBmaWxlSW5wdXQgPSBldmVudEZvcm0uZmluZCgnI2ltYWdlX2lucHV0JyksXG4gICAgICAgICAgICAgICAgICAgIGZvcm1EYXRhID0gdGhpcy5qc29uRGF0YShldmVudEZvcm0pLFxuICAgICAgICAgICAgICAgICAgICBpbWFnZURhdGEgPSBuZXcgRm9ybURhdGEoKTtcblxuICAgICAgICAgICAgICAgICQoJy5zdWJtaXQtZXJyb3InLCBldmVudEZvcm0pLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICAkKCcuc3VibWl0LXN1Y2Nlc3MnLCBldmVudEZvcm0pLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICAkKCcuc3VibWl0LXN1Y2Nlc3MgLnN1Y2Nlc3MnLCBldmVudEZvcm0pXG4gICAgICAgICAgICAgICAgICAgIC5lbXB0eSgpXG4gICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoJzxpIGNsYXNzPVwiZmEgZmEtc2VuZFwiPjwvaT5Ta2lja2FyLi4uPC9saT4nKTtcblxuICAgICAgICAgICAgICAgIC8vIFVwbG9hZCBtZWRpYSBmaXJzdCBhbmQgYXBwZW5kIGl0IHRvIHRoZSBwb3N0LlxuICAgICAgICAgICAgICAgIGlmIChmaWxlSW5wdXQudmFsKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VEYXRhLmFwcGVuZCgnZmlsZScsIGZpbGVJbnB1dFswXS5maWxlc1swXSk7XG4gICAgICAgICAgICAgICAgICAgICQud2hlbih0aGlzLnN1Ym1pdEltYWdlQWpheChldmVudEZvcm0sIGltYWdlRGF0YSkpLnRoZW4oZnVuY3Rpb24oXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHRTdGF0dXNcbiAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1EYXRhWydmZWF0dXJlZF9tZWRpYSddID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBGb3JtLnByb3RvdHlwZS5zdWJtaXRFdmVudEFqYXgoZXZlbnRGb3JtLCBmb3JtRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJy5zdWJtaXQtc3VjY2VzcycsIGV2ZW50Rm9ybSkuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJy5zdWJtaXQtZXJyb3InLCBldmVudEZvcm0pLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcuc3VibWl0LWVycm9yIC53YXJuaW5nJywgZXZlbnRGb3JtKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZW1wdHkoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxpIGNsYXNzPVwiZmEgZmEtd2FybmluZ1wiPjwvaT4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudEludGVncmF0aW9uRnJvbnQuc29tZXRoaW5nX3dlbnRfd3JvbmcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8L2xpPidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIFN1Ym1pdCBwb3N0IGlmIG1lZGlhIGlzIG5vdCBzZXRcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN1Ym1pdEV2ZW50QWpheChldmVudEZvcm0sIGZvcm1EYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LmJpbmQodGhpcylcbiAgICAgICAgKTtcblxuICAgICAgICAvLyBTaG93IGltYWdlIGFwcHJvdmFsIHRlcm1zXG4gICAgICAgICQoJy5pbWctYnV0dG9uJywgZXZlbnRGb3JtKS5jbGljayhmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAkKCcuaW1hZ2UtYm94JywgZXZlbnRGb3JtKS5oaWRlKCk7XG4gICAgICAgICAgICAkKCcuaW1hZ2UtYXBwcm92ZScsIGV2ZW50Rm9ybSkuZmFkZUluKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFNob3cgdXBsb2FkZXIgaWYgdGVybXMgaXMgYXBwcm92ZWRcbiAgICAgICAgJCgnaW5wdXRbbmFtZT1hcHByb3ZlXScsIGV2ZW50Rm9ybSkuY2hhbmdlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGZpcnN0Q2hlY2sgPSAkKCdpbnB1dDpjaGVja2JveFtpZD1maXJzdC1hcHByb3ZlXTpjaGVja2VkJywgZXZlbnRGb3JtKS5sZW5ndGggPiAwLFxuICAgICAgICAgICAgICAgIHNlY29uZENoZWNrID0gJCgnaW5wdXQ6Y2hlY2tib3hbaWQ9c2Vjb25kLWFwcHJvdmVdOmNoZWNrZWQnLCBldmVudEZvcm0pLmxlbmd0aCA+IDA7XG4gICAgICAgICAgICBpZiAoZmlyc3RDaGVjayAmJiBzZWNvbmRDaGVjaykge1xuICAgICAgICAgICAgICAgICQoJy5pbWFnZS1hcHByb3ZlJywgZXZlbnRGb3JtKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgJCgnLmltYWdlLXVwbG9hZCcsIGV2ZW50Rm9ybSkuZmFkZUluKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFNob3cvaGlkZSBvY2Nhc2lvbiBhbmQgcmVjY3VyaW5nIG9jY2FzaW9uIHJ1bGVzLiBBbmQgYWRkIHJlcXVpcmVkIGZpZWxkcy5cbiAgICAgICAgJCgnaW5wdXQ6cmFkaW9bbmFtZT1vY2N1cmFuY2UtdHlwZV0nLCBldmVudEZvcm0pLmNoYW5nZShmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgdmFyIGlkID0gJCh0aGlzKS5kYXRhKCdpZCcpO1xuICAgICAgICAgICAgJCgnIycgKyBpZClcbiAgICAgICAgICAgICAgICAuY2hpbGRyZW4oJy5mb3JtLWdyb3VwIC5ib3gnKVxuICAgICAgICAgICAgICAgIC5zaG93KClcbiAgICAgICAgICAgICAgICAuZmluZCgnaW5wdXQnKVxuICAgICAgICAgICAgICAgIC5wcm9wKCdyZXF1aXJlZCcsIHRydWUpO1xuICAgICAgICAgICAgJCgnIycgKyBpZClcbiAgICAgICAgICAgICAgICAuc2libGluZ3MoJy5ldmVudC1vY2Nhc2lvbicpXG4gICAgICAgICAgICAgICAgLmNoaWxkcmVuKCcuYm94JylcbiAgICAgICAgICAgICAgICAuaGlkZSgpXG4gICAgICAgICAgICAgICAgLmZpbmQoJ2lucHV0JylcbiAgICAgICAgICAgICAgICAucHJvcCgncmVxdWlyZWQnLCBmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEFkZCBuZXcgb2NjdXJhbmNlXG4gICAgICAgICQoJy5hZGQtb2NjdXJhbmNlJywgZXZlbnRGb3JtKS5jbGljayhcbiAgICAgICAgICAgIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB2YXIgJG9jY3VyYW5jZUdyb3VwID0gJChldmVudC50YXJnZXQpXG4gICAgICAgICAgICAgICAgICAgICAgICAucGFyZW50KClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5wcmV2KCdbY2xhc3MqPW9jY3VyYW5jZS1ncm91cF0nKSxcbiAgICAgICAgICAgICAgICAgICAgJGR1cGxpY2F0ZSA9ICRvY2N1cmFuY2VHcm91cFxuICAgICAgICAgICAgICAgICAgICAgICAgLmNsb25lKClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maW5kKCdpbnB1dCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAudmFsKCcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdoYXNEYXRlcGlja2VyJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZW1vdmVBdHRyKCdpZCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZW5kKClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5pbnNlcnRBZnRlcigkb2NjdXJhbmNlR3JvdXApXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmluZCgnLmRhdGVwaWNrZXInKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmRhdGVwaWNrZXIoKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmVuZCgpO1xuXG4gICAgICAgICAgICAgICAgLy8gUmUgaW5pdCBkYXRlIGV2ZW50c1xuICAgICAgICAgICAgICAgIHRoaXMuaW5pdERhdGVFdmVudHMoKTtcblxuICAgICAgICAgICAgICAgIGlmICgkKCcucmVtb3ZlLW9jY3VyYW5jZScsICRkdXBsaWNhdGUpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgJHJlbW92ZUJ1dHRvbiA9ICQoXG4gICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj48YnV0dG9uIGNsYXNzPVwiYnRuIGJ0biBidG4tc20gcmVtb3ZlLW9jY3VyYW5jZVwiPjxpIGNsYXNzPVwicHJpY29uIHByaWNvbi1taW51cy1vXCI+PC9pPiBUYSBib3J0PC9idXR0b24+PC9kaXY+J1xuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAkZHVwbGljYXRlLmFwcGVuZCgkcmVtb3ZlQnV0dG9uKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LmJpbmQodGhpcylcbiAgICAgICAgKTtcblxuICAgICAgICAvLyBSZW1vdmUgb2NjdXJhbmNlXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcucmVtb3ZlLW9jY3VyYW5jZScsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICQodGhpcylcbiAgICAgICAgICAgICAgICAuY2xvc2VzdCgnW2NsYXNzKj1vY2N1cmFuY2UtZ3JvdXBdJylcbiAgICAgICAgICAgICAgICAucmVtb3ZlKCk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyBDbGVhbiB1cCBmb3JtXG4gICAgRm9ybS5wcm90b3R5cGUuY2xlYW5Gb3JtID0gZnVuY3Rpb24oZXZlbnRGb3JtKSB7XG4gICAgICAgICQoJzppbnB1dCcsIGV2ZW50Rm9ybSlcbiAgICAgICAgICAgIC5ub3QoJzpidXR0b24sIDpzdWJtaXQsIDpyZXNldCwgOmhpZGRlbiwgc2VsZWN0JylcbiAgICAgICAgICAgIC52YWwoJycpXG4gICAgICAgICAgICAucmVtb3ZlQXR0cignc2VsZWN0ZWQnKTtcbiAgICB9O1xuXG4gICAgLy8gRm9ybWF0IGRhdGUgYW5kIHRpbWVcbiAgICBGb3JtLnByb3RvdHlwZS5mb3JtYXREYXRlID0gZnVuY3Rpb24oZGF0ZSwgaGgsIG1tKSB7XG4gICAgICAgIHZhciBkYXRlVGltZSA9ICcnO1xuICAgICAgICBpZiAodGhpcy5pc1ZhbGlkRGF0ZShkYXRlKSAmJiBoaCAmJiBtbSkge1xuICAgICAgICAgICAgZGF0ZVRpbWUgPSBkYXRlICsgJyAnICsgdGhpcy5hZGRaZXJvKGhoKSArICc6JyArIHRoaXMuYWRkWmVybyhtbSkgKyAnOjAwJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGF0ZVRpbWU7XG4gICAgfTtcblxuICAgIC8vIENoZWNrIHZhbGlkIGRhdGUgZm9ybWF0XG4gICAgRm9ybS5wcm90b3R5cGUuaXNWYWxpZERhdGUgPSBmdW5jdGlvbihkYXRlU3RyaW5nKSB7XG4gICAgICAgIHZhciByZWdFeCA9IC9eXFxkezR9LVxcZHsyfS1cXGR7Mn0kLztcbiAgICAgICAgcmV0dXJuIGRhdGVTdHJpbmcubWF0Y2gocmVnRXgpICE9IG51bGw7XG4gICAgfTtcblxuICAgIC8vIFByZWZpeCB3aXRoIHplcm9cbiAgICBGb3JtLnByb3RvdHlwZS5hZGRaZXJvID0gZnVuY3Rpb24oaSkge1xuICAgICAgICBpZiAoaS50b1N0cmluZygpLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgaSA9ICcwJyArIGk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGk7XG4gICAgfTtcblxuICAgIHJldHVybiBuZXcgRm9ybSgpO1xufSkoalF1ZXJ5KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vL0luaXQgZXZlbnQgd2lkZ2V0XG5FdmVudE1hbmFnZXJJbnRlZ3JhdGlvbiA9IEV2ZW50TWFuYWdlckludGVncmF0aW9uIHx8IHt9O1xuRXZlbnRNYW5hZ2VySW50ZWdyYXRpb24uV2lkZ2V0ID0gRXZlbnRNYW5hZ2VySW50ZWdyYXRpb24uV2lkZ2V0IHx8IHt9O1xuXG4vL0NvbXBvbmVudFxuRXZlbnRNYW5hZ2VySW50ZWdyYXRpb24uV2lkZ2V0LlRlbXBsYXRlUGFyc2VyID0gKGZ1bmN0aW9uICgkKSB7XG4gICAgdmFyIGRhdGUgICAgICAgICAgICAgICAgPSBuZXcgRGF0ZSgpO1xuICAgIHZhciBkZCAgICAgICAgICAgICAgICAgID0gZGF0ZS5nZXREYXRlKCk7XG4gICAgdmFyIG1tICAgICAgICAgICAgICAgICAgPSBkYXRlLmdldE1vbnRoKCkrMTtcbiAgICB2YXIgeWVhciAgICAgICAgICAgICAgICA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcbiAgICB2YXIgbW9udGhzICAgICAgICAgICAgICA9IFtcImphblwiLCBcImZlYlwiLCBcIm1hclwiLCBcImFwclwiLCBcIm1halwiLCBcImp1blwiLCBcImp1bFwiLCBcImF1Z1wiLCBcInNlcFwiLCBcIm9rdFwiLCBcIm5vdlwiLCBcImRlY1wiXTtcblxuICAgIHZhciB0ZW1wbGF0ZSAgICAgICAgICAgID0ge307XG4gICAgdmFyIGVycm9yVGVtcGxhdGUgICAgICAgPSB7fTtcblxuICAgIGZ1bmN0aW9uIFRlbXBsYXRlUGFyc2VyKCkge1xuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9XG5cbiAgICBUZW1wbGF0ZVBhcnNlci5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJChcIi5ldmVudC1hcGlcIikuZWFjaChmdW5jdGlvbihpbmRleCxtb2R1bGUpe1xuICAgICAgICAgICAgdmFyIGRhdGFBcGl1cmwgICAgICAgICAgPSAoJChtb2R1bGUpLmF0dHIoJ2RhdGEtYXBpdXJsJykpO1xuICAgICAgICAgICAgICAgIGRhdGFBcGl1cmwgICAgICAgICAgPSBkYXRhQXBpdXJsLnJlcGxhY2UoL1xcLyQvLCBcIlwiKTtcbiAgICAgICAgICAgICAgICBkYXRhQXBpdXJsICAgICAgICAgID0gZGF0YUFwaXVybCArICcvZXZlbnQvdGltZT9zdGFydD0nICsgeWVhciArICctJyArIG1tICsgJy0nICsgZGQgKyAnJmVuZD0nICsgKHllYXIrMSkgKyAnLScgKyBtbSArICctJyArIGRkO1xuICAgICAgICAgICAgdmFyIGRhdGFMaW1pdCAgICAgICAgICAgPSAoJChtb2R1bGUpLmF0dHIoJ3Bvc3QtbGltaXQnKSk7XG4gICAgICAgICAgICB2YXIgZGF0YUdyb3VwSWQgICAgICAgICA9ICgkKG1vZHVsZSkuYXR0cignZ3JvdXAtaWQnKSk7XG4gICAgICAgICAgICB2YXIgZGF0YUNhdGVnb3J5SWQgICAgICA9ICgkKG1vZHVsZSkuYXR0cignY2F0ZWdvcnktaWQnKSk7XG4gICAgICAgICAgICB2YXIgbGF0bG5nICAgICAgICAgICAgICA9ICgkKG1vZHVsZSkuYXR0cignbGF0bG5nJykpO1xuICAgICAgICAgICAgdmFyIGRpc3RhbmNlICAgICAgICAgICAgPSAoJChtb2R1bGUpLmF0dHIoJ2Rpc3RhbmNlJykpO1xuXG4gICAgICAgICAgICB2YXIgYXBpVXJsID0gKHR5cGVvZiBkYXRhTGltaXQgIT0gJ3VuZGVmaW5lZCcgJiYgJC5pc051bWVyaWMoZGF0YUxpbWl0KSkgPyBkYXRhQXBpdXJsICsgJyZwb3N0LWxpbWl0PScgKyBkYXRhTGltaXQgOiBkYXRhQXBpdXJsICsgJyZwb3N0LWxpbWl0PScgKyAxMDtcbiAgICAgICAgICAgICAgICBhcGlVcmwgKz0gKHR5cGVvZiBkYXRhR3JvdXBJZCAhPSAndW5kZWZpbmVkJyAmJsKgZGF0YUdyb3VwSWQpID8gJyZncm91cC1pZD0nICsgZGF0YUdyb3VwSWQgOiAnJztcbiAgICAgICAgICAgICAgICBhcGlVcmwgKz0gKHR5cGVvZiBkYXRhQ2F0ZWdvcnlJZCAhPSAndW5kZWZpbmVkJyAmJiBkYXRhQ2F0ZWdvcnlJZCkgPyAnJmNhdGVnb3J5LWlkPScgKyBkYXRhQ2F0ZWdvcnlJZCA6ICcnO1xuICAgICAgICAgICAgICAgIGFwaVVybCArPSAodHlwZW9mIGxhdGxuZyAhPSAndW5kZWZpbmVkJyAmJiBsYXRsbmcpID8gJyZsYXRsbmc9JyArIGxhdGxuZyA6ICcnO1xuICAgICAgICAgICAgICAgIGFwaVVybCArPSAodHlwZW9mIGRpc3RhbmNlICE9ICd1bmRlZmluZWQnICYmIGRpc3RhbmNlKSA/ICcmZGlzdGFuY2U9JyArIGRpc3RhbmNlIDogJyc7XG4gICAgICAgICAgICAgICAgYXBpVXJsICs9ICcmX2pzb25wPWdldGV2ZW50cyc7XG4gICAgICAgICAgICB0aGlzLnN0b3JlRXJyb3JUZW1wbGF0ZSgkKG1vZHVsZSkpO1xuICAgICAgICAgICAgdGhpcy5zdG9yZVRlbXBsYXRlKCQobW9kdWxlKSk7XG4gICAgICAgICAgICB0aGlzLnN0b3JlTW9kYWxUZW1wbGF0ZSgkKG1vZHVsZSkpO1xuICAgICAgICAgICAgdGhpcy5sb2FkRXZlbnQoJChtb2R1bGUpLGFwaVVybCk7XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgfTtcblxuICAgIFRlbXBsYXRlUGFyc2VyLnByb3RvdHlwZS5zdG9yZVRlbXBsYXRlID0gZnVuY3Rpb24gKG1vZHVsZSkge1xuICAgICAgICBtb2R1bGUuZGF0YSgndGVtcGxhdGUnLCQoJy50ZW1wbGF0ZScsbW9kdWxlKS5odG1sKCkpO1xuICAgICAgICBtb2R1bGUuZmluZCgnLnRlbXBsYXRlJykucmVtb3ZlKCk7XG4gICAgfTtcblxuICAgIFRlbXBsYXRlUGFyc2VyLnByb3RvdHlwZS5zdG9yZUVycm9yVGVtcGxhdGUgPSBmdW5jdGlvbiAobW9kdWxlKSB7XG4gICAgICAgIG1vZHVsZS5kYXRhKCdlcnJvci10ZW1wbGF0ZScsJCgnLmVycm9yLXRlbXBsYXRlJyxtb2R1bGUpLmh0bWwoKSk7XG4gICAgICAgIG1vZHVsZS5maW5kKCcuZXJyb3ItdGVtcGxhdGUnKS5yZW1vdmUoKTtcbiAgICB9O1xuXG4gICAgVGVtcGxhdGVQYXJzZXIucHJvdG90eXBlLnN0b3JlTW9kYWxUZW1wbGF0ZSA9IGZ1bmN0aW9uIChtb2R1bGUpIHtcbiAgICAgICAgbW9kdWxlLmRhdGEoJ21vZGFsLXRlbXBsYXRlJywkKCcubW9kYWwtdGVtcGxhdGUnLG1vZHVsZSkuaHRtbCgpKTtcbiAgICAgICAgbW9kdWxlLmZpbmQoJy5tb2RhbC10ZW1wbGF0ZScpLnJlbW92ZSgpO1xuICAgIH07XG5cbiAgICBUZW1wbGF0ZVBhcnNlci5wcm90b3R5cGUubG9hZEV2ZW50ID0gZnVuY3Rpb24obW9kdWxlLCByZXNvdXJjZSkge1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdHlwZTogXCJHRVRcIixcbiAgICAgICAgICAgIHVybDogcmVzb3VyY2UsXG4gICAgICAgICAgICBjYWNoZTogZmFsc2UsXG4gICAgICAgICAgICBkYXRhVHlwZTogXCJqc29ucFwiLFxuICAgICAgICAgICAganNvbnBDYWxsYmFjazogJ2dldGV2ZW50cycsXG4gICAgICAgICAgICBjcm9zc0RvbWFpbjogdHJ1ZSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKCByZXNwb25zZSApIHtcbiAgICAgICAgICAgICAgICAvL1N0b3JlIHJlc3BvbnNlIG9uIG1vZHVsZVxuICAgICAgICAgICAgICAgIG1vZHVsZS5kYXRhKCdqc29uLXJlc3BvbnNlJywgcmVzcG9uc2UpO1xuXG4gICAgICAgICAgICAgICAgLy9DbGVhciB0YXJnZXQgZGl2XG4gICAgICAgICAgICAgICAgVGVtcGxhdGVQYXJzZXIucHJvdG90eXBlLmNsZWFyKG1vZHVsZSk7XG5cbiAgICAgICAgICAgICAgICAkKHJlc3BvbnNlKS5lYWNoKGZ1bmN0aW9uKGluZGV4LGV2ZW50KXtcblxuICAgICAgICAgICAgICAgICAgICAvLyBHZXQgdGhlIGNvcnJlY3Qgb2NjYXNpb25cbiAgICAgICAgICAgICAgICAgICAgdmFyIGV2ZW50T2NjYXNpb24gPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAkLmVhY2goZXZlbnQub2NjYXNpb25zLCBmdW5jdGlvbihvY2NhdGlvbmluZGV4LG9jY2F0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG9jY2F0aW9uLmN1cnJlbnRfb2NjYXNpb24gIT0gJ3VuZGVmaW5lZCcgJiYgb2NjYXRpb24uY3VycmVudF9vY2Nhc2lvbiA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRPY2Nhc2lvbiA9IG9jY2F0aW9uO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIG9jY2FzaW9uRGF0ZSAgICA9IG5ldyBEYXRlKGV2ZW50T2NjYXNpb24uc3RhcnRfZGF0ZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy9Mb2FkIHRlbXBsYXRlIGRhdGFcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1vZHVsZVRlbXBsYXRlICA9IG1vZHVsZS5kYXRhKCd0ZW1wbGF0ZScpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vUmVwbGFjZSB3aXRoIHZhbHVlc1xuICAgICAgICAgICAgICAgICAgICBtb2R1bGVUZW1wbGF0ZSAgICAgID0gbW9kdWxlVGVtcGxhdGUucmVwbGFjZSgne2V2ZW50LWlkfScsIGV2ZW50LmlkKTtcbiAgICAgICAgICAgICAgICAgICAgbW9kdWxlVGVtcGxhdGUgICAgICA9IG1vZHVsZVRlbXBsYXRlLnJlcGxhY2UoJ3tldmVudC1vY2Nhc2lvbn0nLCBvY2Nhc2lvbkRhdGUuZ2V0RGF0ZSgpICsgJzxkaXYgY2xhc3M9XCJjbGVhcmZpeFwiPjwvZGl2PicgKyBtb250aHNbb2NjYXNpb25EYXRlLmdldE1vbnRoKCldKTtcbiAgICAgICAgICAgICAgICAgICAgbW9kdWxlVGVtcGxhdGUgICAgICA9IG1vZHVsZVRlbXBsYXRlLnJlcGxhY2UoJ3tldmVudC10aXRsZX0nLCAnPHAgY2xhc3M9XCJsaW5rLWl0ZW1cIj4nICsgZXZlbnQudGl0bGUucmVuZGVyZWQgKyAnPC9wPicpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vQXBwZW5kXG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZS5hcHBlbmQobW9kdWxlVGVtcGxhdGUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIC8vYmluZCBjbGlja1xuICAgICAgICAgICAgICAgIFRlbXBsYXRlUGFyc2VyLnByb3RvdHlwZS5jbGljayhtb2R1bGUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiggcmVzcG9uc2UgKSB7XG4gICAgICAgICAgICAgICAgVGVtcGxhdGVQYXJzZXIucHJvdG90eXBlLmNsZWFyKG1vZHVsZSk7XG4gICAgICAgICAgICAgICAgbW9kdWxlLmh0bWwobW9kdWxlLmRhdGEoJ2Vycm9yLXRlbXBsYXRlJykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuXG4gICAgfTtcblxuICAgIFRlbXBsYXRlUGFyc2VyLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKG1vZHVsZSl7XG4gICAgICAgIGpRdWVyeShtb2R1bGUpLmh0bWwoJycpO1xuICAgIH07XG5cbiAgICBUZW1wbGF0ZVBhcnNlci5wcm90b3R5cGUuYWRkWmVybyA9IGZ1bmN0aW9uIChpKSB7XG4gICAgICAgIGlmIChpIDwgMTApIHtcbiAgICAgICAgICAgIGkgPSBcIjBcIiArIGk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGk7XG4gICAgfTtcblxuICAgIFRlbXBsYXRlUGFyc2VyLnByb3RvdHlwZS5jbGljayA9IGZ1bmN0aW9uKG1vZHVsZSl7XG5cbiAgICAgICAgalF1ZXJ5KFwibGkgYVwiLG1vZHVsZSkub24oJ2NsaWNrJyx7fSxmdW5jdGlvbihlKXtcblxuICAgICAgICAgICAgdmFyIGV2ZW50SWQgPSBqUXVlcnkoZS50YXJnZXQpLmNsb3Nlc3QoXCJhLm1vZGFsLWV2ZW50XCIpLmRhdGEoJ2V2ZW50LWlkJyk7XG5cbiAgICAgICAgICAgICQuZWFjaChtb2R1bGUuZGF0YSgnanNvbi1yZXNwb25zZScpLCBmdW5jdGlvbihpbmRleCxvYmplY3QpIHtcblxuICAgICAgICAgICAgICAgIGlmKG9iamVjdC5pZCA9PSBldmVudElkKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gTWFpbiBtb2RhbFxuICAgICAgICAgICAgICAgICAgICB2YXIgbW9kYWxUZW1wbGF0ZSA9IG1vZHVsZS5kYXRhKCdtb2RhbC10ZW1wbGF0ZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9kYWxUZW1wbGF0ZSA9IG1vZGFsVGVtcGxhdGUucmVwbGFjZSgne2V2ZW50LW1vZGFsLXRpdGxlfScsIG9iamVjdC50aXRsZS5yZW5kZXJlZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RhbFRlbXBsYXRlID0gbW9kYWxUZW1wbGF0ZS5yZXBsYWNlKCd7ZXZlbnQtbW9kYWwtY29udGVudH0nLCAob2JqZWN0LmNvbnRlbnQucmVuZGVyZWQgIT0gbnVsbCkgPyBvYmplY3QuY29udGVudC5yZW5kZXJlZCA6ICcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGFsVGVtcGxhdGUgPSBtb2RhbFRlbXBsYXRlLnJlcGxhY2UoJ3tldmVudC1tb2RhbC1saW5rfScsIChvYmplY3QuZXZlbnRfbGluayAhPSBudWxsKSA/ICc8cD48YSBocmVmPVwiJyArIG9iamVjdC5ldmVudF9saW5rICsgJ1wiIHRhcmdldD1cIl9ibGFua1wiPicgKyBvYmplY3QuZXZlbnRfbGluayArICc8L2E+PC9wPicgOiAnJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RhbFRlbXBsYXRlID0gbW9kYWxUZW1wbGF0ZS5yZXBsYWNlKCd7ZXZlbnQtbW9kYWwtaW1hZ2V9JywgKG9iamVjdC5mZWF0dXJlZF9tZWRpYSAhPSBudWxsKSA/ICc8aW1nIHNyYz0nICsgb2JqZWN0LmZlYXR1cmVkX21lZGlhLnNvdXJjZV91cmwgKyAnIGFsdD1cIicgKyBvYmplY3QudGl0bGUucmVuZGVyZWQgKyAnXCIgc3R5bGU9XCJkaXNwbGF5OmJsb2NrOyB3aWR0aDoxMDAlO1wiPicgOiAnJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBPY2NhdGlvbnMgYWNjb3JkaW9uIHNlY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtb2RhbE9jY2F0aW9uUmVzdWx0ID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICQuZWFjaChvYmplY3Qub2NjYXNpb25zLCBmdW5jdGlvbihvY2NhdGlvbmluZGV4LG9jY2F0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRm9ybWF0IHN0YXJ0IGFuZCBlbmQgZGF0ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkID0gbmV3IERhdGUob2NjYXRpb24uc3RhcnRfZGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN0YXJ0ID0gdGhpcy5hZGRaZXJvKGQuZ2V0RGF0ZSgpKSArICcgJyArIG1vbnRoc1tkLmdldE1vbnRoKCldICsgJyAnICsgZC5nZXRGdWxsWWVhcigpICsgJyBrbC4gJyArIHRoaXMuYWRkWmVybyhkLmdldEhvdXJzKCkpICsgJzonICsgdGhpcy5hZGRaZXJvKGQuZ2V0TWludXRlcygpKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlID0gbmV3IERhdGUob2NjYXRpb24uZW5kX2RhdGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlbmQgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlLmdldERhdGUoKSA9PT0gZC5nZXREYXRlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kID0gJ2tsLiAnICsgdGhpcy5hZGRaZXJvKGUuZ2V0SG91cnMoKSkgKyAnOicgKyB0aGlzLmFkZFplcm8oZS5nZXRNaW51dGVzKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZCA9IGUuZ2V0RGF0ZSgpICsgJyAnICsgbW9udGhzW2UuZ2V0TW9udGgoKV0gKyAnICcgKyBlLmdldEZ1bGxZZWFyKCkgKyAnIGtsLiAnICsgdGhpcy5hZGRaZXJvKGUuZ2V0SG91cnMoKSkgKyAnOicgKyB0aGlzLmFkZFplcm8oZS5nZXRNaW51dGVzKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2RhbE9jY2F0aW9uUmVzdWx0ID0gbW9kYWxPY2NhdGlvblJlc3VsdCArICc8bGkgY2xhc3M9XCJ0ZXh0LXNtIGd1dHRlci1zbSBndXR0ZXItdmVydGljYWxcIj4nICsgc3RhcnQgKyAnIC0gJyArIGVuZCArICc8L2xpPic7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RhbFRlbXBsYXRlID0gbW9kYWxUZW1wbGF0ZS5yZXBsYWNlKCd7ZXZlbnQtbW9kYWwtb2NjYXRpb25zfScsJzxzZWN0aW9uIGNsYXNzPVwiYWNjb3JkaW9uLXNlY3Rpb25cIj48aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cImFjdGl2ZS1zZWN0aW9uXCIgaWQ9XCJhY2NvcmRpb24tc2VjdGlvbi0xXCI+PGxhYmVsIGNsYXNzPVwiYWNjb3JkaW9uLXRvZ2dsZVwiIGZvcj1cImFjY29yZGlvbi1zZWN0aW9uLTFcIj48aDI+RXZlbmVtYW5nZXQgaW50csOkZmZhcjwvaDI+PC9sYWJlbD48ZGl2IGNsYXNzPVwiYWNjb3JkaW9uLWNvbnRlbnRcIj48dWwgaWQ9XCJtb2RhbC1vY2NhdGlvbnNcIj4nICsgbW9kYWxPY2NhdGlvblJlc3VsdCArICc8L3VsPjwvZGl2Pjwvc2VjdGlvbj4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIExvY2F0aW9uIGFjY29yZGlvbiBzZWN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbG9jYXRpb25EYXRhID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbkRhdGEgKz0gKG9iamVjdC5sb2NhdGlvbiAhPSBudWxsICYmIG9iamVjdC5sb2NhdGlvbi50aXRsZSAhPSBudWxsKSA/ICc8bGk+PHN0cm9uZz4nICsgb2JqZWN0LmxvY2F0aW9uLnRpdGxlICsgJzwvc3Ryb25nPjwvbGk+JyA6ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uRGF0YSArPSAob2JqZWN0LmxvY2F0aW9uICE9IG51bGwgJiYgb2JqZWN0LmxvY2F0aW9uLnN0cmVldF9hZGRyZXNzICE9IG51bGwpID8gJzxsaT4nICsgb2JqZWN0LmxvY2F0aW9uLnN0cmVldF9hZGRyZXNzICsgJzwvbGk+JyA6ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uRGF0YSArPSAob2JqZWN0LmxvY2F0aW9uICE9IG51bGwgJiYgb2JqZWN0LmxvY2F0aW9uLnBvc3RhbF9jb2RlICE9IG51bGwpID8gJzxsaT4nICsgb2JqZWN0LmxvY2F0aW9uLnBvc3RhbF9jb2RlICsgJzwvbGk+JyA6ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uRGF0YSArPSAob2JqZWN0LmxvY2F0aW9uICE9IG51bGwgJiYgb2JqZWN0LmxvY2F0aW9uLmNpdHkgIT0gbnVsbCkgPyAnPGlsPicgKyBvYmplY3QubG9jYXRpb24uY2l0eSArICc8L2xpPicgOiAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsb2NhdGlvbiA9IChsb2NhdGlvbkRhdGEpID8gJzxzZWN0aW9uIGNsYXNzPVwiYWNjb3JkaW9uLXNlY3Rpb25cIj48aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cImFjdGl2ZS1zZWN0aW9uXCIgaWQ9XCJhY2NvcmRpb24tc2VjdGlvbi0yXCI+PGxhYmVsIGNsYXNzPVwiYWNjb3JkaW9uLXRvZ2dsZVwiIGZvcj1cImFjY29yZGlvbi1zZWN0aW9uLTJcIj48aDI+UGxhdHM8L2gyPjwvbGFiZWw+PGRpdiBjbGFzcz1cImFjY29yZGlvbi1jb250ZW50XCI+PHVsPicgKyBsb2NhdGlvbkRhdGEgKyAnPC91bD48L2Rpdj48L3NlY3Rpb24+JyA6ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9kYWxUZW1wbGF0ZSA9IG1vZGFsVGVtcGxhdGUucmVwbGFjZSgne2V2ZW50LW1vZGFsLWxvY2F0aW9ufScsIGxvY2F0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEJvb29raW5nIGFjY29yZGlvbiBzZWN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYm9va2luZ0RhdGEgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvb2tpbmdEYXRhICs9IChvYmplY3QuYm9va2luZ19waG9uZSAhPSBudWxsKSA/ICc8bGk+VGVsZWZvbjogJyArIG9iamVjdC5ib29raW5nX3Bob25lICsgJzwvbGk+JyA6ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvb2tpbmdEYXRhICs9IChvYmplY3QucHJpY2VfYWR1bHQgIT0gbnVsbCkgPyAnPGxpPlByaXM6ICcgKyBvYmplY3QucHJpY2VfYWR1bHQgKyAnIGtyPC9saT4nIDogJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9va2luZ0RhdGEgKz0gKG9iamVjdC5wcmljZV9jaGlsZHJlbiAhPSBudWxsKSA/ICc8bGk+QmFybnByaXM6ICcgKyBvYmplY3QucHJpY2VfY2hpbGRyZW4gKyAnIGtyPC9saT4nIDogJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9va2luZ0RhdGEgKz0gKG9iamVjdC5wcmljZV9zZW5pb3IgIT0gbnVsbCkgPyAnPGxpPlBlbnNpb27DpHJzcHJpczogJyArIG9iamVjdC5wcmljZV9zZW5pb3IgKyAnIGtyPC9saT4nIDogJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9va2luZ0RhdGEgKz0gKG9iamVjdC5wcmljZV9zdHVkZW50ICE9IG51bGwpID8gJzxsaT5TdHVkZW50cHJpczogJyArIG9iamVjdC5wcmljZV9zdHVkZW50ICsgJyBrcjwvbGk+JyA6ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvb2tpbmdEYXRhICs9IChvYmplY3QuYWdlX3Jlc3RyaWN0aW9uICE9IG51bGwpID8gJzxsaT7DhWxkZXJzZ3LDpG5zOiAnICsgb2JqZWN0LmFnZV9yZXN0cmljdGlvbiArICcga3I8L2xpPicgOiAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtZW1iZXJzaGlwQ2FyZHMgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgJC5lYWNoKG9iamVjdC5tZW1iZXJzaGlwX2NhcmRzLCBmdW5jdGlvbihjYXJkaW5kZXgsY2FyZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lbWJlcnNoaXBDYXJkcyA9IG1lbWJlcnNoaXBDYXJkcyArICc8bGk+JyArIGNhcmQucG9zdF90aXRsZSArICc8L2xpPic7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvb2tpbmdEYXRhICs9IChtZW1iZXJzaGlwQ2FyZHMpID8gJzxsaT4mbmJzcDs8L2xpPjxsaT48c3Ryb25nPkluZ8OlciBpIG1lZGxlbXNrb3J0PC9zdHJvbmc+PC9saT4nICsgbWVtYmVyc2hpcENhcmRzIDogJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9va2luZ0RhdGEgKz0gKG9iamVjdC5ib29raW5nX2xpbmsgIT0gbnVsbCkgPyAnPGxpPiZuYnNwOzwvbGk+PGxpPjxhIGhyZWY9XCInICsgb2JqZWN0LmJvb2tpbmdfbGluayArICdcIiBjbGFzcz1cImxpbmstaXRlbVwiIHRhcmdldD1cIl9ibGFua1wiPkJva2EgYmxqZXR0ZXIgaMOkcjwvYT48L2xpPicgOiAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBib29raW5nID0gKGJvb2tpbmdEYXRhKSA/ICc8c2VjdGlvbiBjbGFzcz1cImFjY29yZGlvbi1zZWN0aW9uXCI+PGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJhY3RpdmUtc2VjdGlvblwiIGlkPVwiYWNjb3JkaW9uLXNlY3Rpb24tM1wiPjxsYWJlbCBjbGFzcz1cImFjY29yZGlvbi10b2dnbGVcIiBmb3I9XCJhY2NvcmRpb24tc2VjdGlvbi0zXCI+PGgyPkJva25pbmc8L2gyPjwvbGFiZWw+PGRpdiBjbGFzcz1cImFjY29yZGlvbi1jb250ZW50XCI+PHVsPicgKyBib29raW5nRGF0YSArICc8L3VsPjwvZGl2Pjwvc2VjdGlvbj4nIDogJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RhbFRlbXBsYXRlID0gbW9kYWxUZW1wbGF0ZS5yZXBsYWNlKCd7ZXZlbnQtbW9kYWwtYm9va2luZ30nLCBib29raW5nKTtcblxuICAgICAgICAgICAgICAgICAgICAkKCcjbW9kYWwtZXZlbnQnKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnYm9keScpLmFwcGVuZChtb2RhbFRlbXBsYXRlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcblxuICAgIH07XG5cbiAgICByZXR1cm4gbmV3IFRlbXBsYXRlUGFyc2VyKCk7XG5cbn0pKGpRdWVyeSk7XG4iXX0=
