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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImV2ZW50LW1hcC5qcyIsImV2ZW50LXBhZ2luYXRpb24uanMiLCJldmVudC1zdWJtaXQuanMiLCJldmVudC13aWRnZXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcnJCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZXZlbnQtaW50ZWdyYXRpb24tZnJvbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbkV2ZW50TWFuYWdlckludGVncmF0aW9uID0gRXZlbnRNYW5hZ2VySW50ZWdyYXRpb24gfHwge307XG5FdmVudE1hbmFnZXJJbnRlZ3JhdGlvbi5FdmVudCA9IEV2ZW50TWFuYWdlckludGVncmF0aW9uLkV2ZW50IHx8IHt9O1xuXG5FdmVudE1hbmFnZXJJbnRlZ3JhdGlvbi5FdmVudC5NYXAgPSAoZnVuY3Rpb24oKSB7XG5cbiAgICBmdW5jdGlvbiBNYXAoKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZ29vZ2xlID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgZ29vZ2xlLm1hcHMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIE1hcC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbWFwRWxlbWVudCxcbiAgICAgICAgICAgIHBvc2l0aW9uLFxuICAgICAgICAgICAgbWFwT3B0aW9ucyxcbiAgICAgICAgICAgIG1hcCxcbiAgICAgICAgICAgIG1hcmtlcixcbiAgICAgICAgICAgIGluZm93aW5kb3csXG4gICAgICAgICAgICBsb2NhdGlvblRpdGxlO1xuXG4gICAgICAgIG1hcEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZXZlbnQtbWFwJyk7XG5cbiAgICAgICAgaWYgKCFtYXBFbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBwb3NpdGlvbiA9IHtcbiAgICAgICAgICAgIGxhdDogcGFyc2VGbG9hdChtYXBFbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1sYXQnKSksXG4gICAgICAgICAgICBsbmc6IHBhcnNlRmxvYXQobWFwRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbG5nJykpXG4gICAgICAgIH07XG5cbiAgICAgICAgbWFwT3B0aW9ucyA9IHtcbiAgICAgICAgICAgIHpvb206IDE1LFxuICAgICAgICAgICAgY2VudGVyOiBwb3NpdGlvbixcbiAgICAgICAgICAgIGRpc2FibGVEZWZhdWx0VUk6IGZhbHNlXG4gICAgICAgIH07XG5cbiAgICAgICAgbWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcChtYXBFbGVtZW50LCBtYXBPcHRpb25zKTtcbiAgICAgICAgbG9jYXRpb25UaXRsZSA9IG1hcEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXRpdGxlJykgPyBtYXBFbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS10aXRsZScpIDogJyc7XG5cbiAgICAgICAgaW5mb3dpbmRvdyA9IG5ldyBnb29nbGUubWFwcy5JbmZvV2luZG93KHtcbiAgICAgICAgICAgIGNvbnRlbnQ6ICc8Yj4nICsgbG9jYXRpb25UaXRsZSArICc8L2I+J1xuICAgICAgICB9KTtcblxuICAgICAgICBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcbiAgICAgICAgICAgIHBvc2l0aW9uOiBwb3NpdGlvbixcbiAgICAgICAgICAgIG1hcDogbWFwXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChsb2NhdGlvblRpdGxlKSB7XG4gICAgICAgICAgICBtYXJrZXIuYWRkTGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaW5mb3dpbmRvdy5vcGVuKG1hcCwgbWFya2VyKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBuZXcgTWFwKCk7XG59KSgpO1xuIiwiLy8gSW5pdFxudmFyIEV2ZW50TWFuYWdlckludGVncmF0aW9uID0ge307XG5cbi8vIEluaXQgZXZlbnQgcGFnaW5hdGlvblxuRXZlbnRNYW5hZ2VySW50ZWdyYXRpb24gPSBFdmVudE1hbmFnZXJJbnRlZ3JhdGlvbiB8fCB7fTtcbkV2ZW50TWFuYWdlckludGVncmF0aW9uLkV2ZW50ID0gRXZlbnRNYW5hZ2VySW50ZWdyYXRpb24uRXZlbnQgfHwge307XG5cbkV2ZW50TWFuYWdlckludGVncmF0aW9uLkV2ZW50Lk1vZHVsZSA9IChmdW5jdGlvbiAoJCkge1xuXG4gICAgZnVuY3Rpb24gTW9kdWxlKCkge1xuICAgICAgICAkKGZ1bmN0aW9uKCkge1xuICAgICAgICBcdHRoaXMuaW5pdEV2ZW50UGFnaW5hdGlvbigpO1xuICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIC8vIExvYWQgcGFnaW5hdGlvbiBiYXIgdG8gZXZlbnQgbW9kdWxlc1xuICAgIE1vZHVsZS5wcm90b3R5cGUuaW5pdEV2ZW50UGFnaW5hdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICBcdCQoXCIubW9kdWxhcml0eS1tb2QtZXZlbnRcIikuZWFjaChmdW5jdGlvbigga2V5LCB2YWx1ZSApIHtcbiAgICBcdFx0dmFyIG1vZHVsZUlkIFx0PSAkKHRoaXMpLmZpbmQoJ1tkYXRhLW1vZHVsZS1pZF0nKS5hdHRyKCdkYXRhLW1vZHVsZS1pZCcpO1xuICAgIFx0XHR2YXIgcGFnZXMgXHQgXHQ9ICQodGhpcykuZmluZCgnLm1vZHVsZS1wYWdpbmF0aW9uJykuYXR0cignZGF0YS1wYWdlcycpO1xuICAgIFx0XHR2YXIgc2hvd0Fycm93cyBcdD0gJCh0aGlzKS5maW5kKCcubW9kdWxlLXBhZ2luYXRpb24nKS5hdHRyKCdkYXRhLXNob3ctYXJyb3dzJyk7XG4gICAgXHRcdHZhciBtb2R1bGUgICBcdD0gJCh0aGlzKTtcblxuXHRcdCAgICAkKHRoaXMpLmZpbmQoJy5tb2R1bGUtcGFnaW5hdGlvbicpLnBhZ2luYXRpb24oe1xuXHRcdCAgICBcdHBhZ2VzOiBwYWdlcyxcblx0XHQgICAgXHRkaXNwbGF5ZWRQYWdlczogNCxcblx0XHQgICAgICAgIGVkZ2VzOiAwLFxuXHRcdCAgICAgICAgY3NzU3R5bGU6ICcnLFxuXHRcdCAgICAgICAgZWxsaXBzZVBhZ2VTZXQ6IGZhbHNlLFxuXHRcdCAgICAgICAgcHJldlRleHQ6IChzaG93QXJyb3dzKSA/ICcmbGFxdW87JyA6ICcnLFxuXHRcdCAgICAgICAgbmV4dFRleHQ6IChzaG93QXJyb3dzKSA/ICcmcmFxdW87JyA6ICcnLFxuXHRcdCAgICAgICBcdGN1cnJlbnRQYWdlOiAxLFxuXHRcdCAgICAgICBcdHNlbGVjdE9uQ2xpY2s6IGZhbHNlLFxuXHRcdCAgICAgICAgb25QYWdlQ2xpY2s6IGZ1bmN0aW9uKHBhZ2UsIGV2ZW50KSB7XG5cdFx0ICAgICAgICBcdE1vZHVsZS5wcm90b3R5cGUubG9hZEV2ZW50cyhwYWdlLCBtb2R1bGVJZCwgbW9kdWxlKTtcblx0XHQgICAgICAgIFx0JChtb2R1bGUpLmZpbmQoJy5tb2R1bGUtcGFnaW5hdGlvbicpLnBhZ2luYXRpb24oJ3JlZHJhdycpO1xuXHRcdCAgICAgICAgXHQkKG1vZHVsZSkuZmluZCgnLnBhZ2luYXRpb24gYTpub3QoLmN1cnJlbnQpJykuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdCQodGhpcykucGFyZW50KCkuYWRkQ2xhc3MoJ2Rpc2FibGVkIHRlbXBvcmFyeScpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdCAgICAgICAgfSxcblx0XHQgICAgfSk7XG5cdFx0fSk7XG4gICAgfTtcblxuICAgIC8vIEdldCBldmVudCBsaXN0IHdpdGggQWpheCBvbiBwYWdpbmF0aW9uIGNsaWNrXG4gICAgTW9kdWxlLnByb3RvdHlwZS5sb2FkRXZlbnRzID0gZnVuY3Rpb24gKHBhZ2UsIG1vZHVsZUlkLCBtb2R1bGUpIHtcblx0XHR2YXIgaGVpZ2h0IFx0ICA9ICQobW9kdWxlKS5maW5kKCcuZXZlbnQtbW9kdWxlLWNvbnRlbnQnKS5oZWlnaHQoKTtcblx0ICAgIHZhciB3aW5kb3dUb3AgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG5cdCAgICB2YXIgbW9kdWxlVG9wID0gJChtb2R1bGUpLm9mZnNldCgpLnRvcDtcblxuXHRcdCQuYWpheCh7XG5cdFx0XHR1cmw6IGV2ZW50aW50ZWdyYXRpb24uYWpheHVybCxcblx0XHRcdHR5cGU6ICdwb3N0Jyxcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0YWN0aW9uOiAnYWpheF9wYWdpbmF0aW9uJyxcblx0XHRcdFx0cGFnZTogcGFnZSxcblx0XHRcdFx0aWQ6IG1vZHVsZUlkXG5cdFx0XHR9LFxuXHRcdFx0YmVmb3JlU2VuZDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCQobW9kdWxlKS5maW5kKCcuZXZlbnQtbW9kdWxlLWxpc3QnKS5yZW1vdmUoKTtcblx0XHRcdFx0JChtb2R1bGUpLmZpbmQoJy5ldmVudC1tb2R1bGUtY29udGVudCcpLmFwcGVuZCgnPGRpdiBjbGFzcz1cImV2ZW50LWxvYWRlclwiPjxkaXYgY2xhc3M9XCJsb2FkaW5nLXdyYXBwZXJcIj48ZGl2IGNsYXNzPVwibG9hZGluZ1wiPjxkaXY+PC9kaXY+PGRpdj48L2Rpdj48ZGl2PjwvZGl2PjxkaXY+PC9kaXY+PC9kaXY+PC9kaXY+PC9kaXY+Jyk7XG5cdFx0XHRcdCQobW9kdWxlKS5maW5kKCcuZXZlbnQtbG9hZGVyJykuaGVpZ2h0KGhlaWdodCk7XG5cdFx0XHQgICAgaWYgKG1vZHVsZVRvcCA8IHdpbmRvd1RvcCkge1xuXHRcdFx0XHRcdCQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcblx0XHRcdCAgICAgICAgc2Nyb2xsVG9wOiBtb2R1bGVUb3Bcblx0XHRcdCAgICBcdH0sIDEwMCk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRzdWNjZXNzOiBmdW5jdGlvbihodG1sKSB7XG5cdFx0XHRcdCQobW9kdWxlKS5maW5kKCcuZXZlbnQtbW9kdWxlLWNvbnRlbnQnKS5hcHBlbmQoaHRtbCkuaGlkZSgpLmZhZGVJbig4MCkuaGVpZ2h0KCdhdXRvJyk7XG5cdFx0XHR9LFxuXHRcdFx0ZXJyb3I6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkKG1vZHVsZSkuZmluZCgnLmV2ZW50LW1vZHVsZS1jb250ZW50JykuYXBwZW5kKCc8dWwgY2xhc3M9XCJldmVudC1tb2R1bGUtbGlzdFwiPjxsaT48cD4nICsgZXZlbnRJbnRlZ3JhdGlvbkZyb250LmV2ZW50X3BhZ2luYXRpb25fZXJyb3IgKyAnPC9wPjwvbGk+PC91bD4nKS5oaWRlKCkuZmFkZUluKDgwKS5oZWlnaHQoJ2F1dG8nKTtcblx0XHRcdH0sXG5cdFx0XHRjb21wbGV0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCQobW9kdWxlKS5maW5kKCcuZXZlbnQtbG9hZGVyJykucmVtb3ZlKCk7XG5cdFx0XHRcdCQobW9kdWxlKS5maW5kKCcucGFnaW5hdGlvbiAudGVtcG9yYXJ5JykuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkKHRoaXMpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCB0ZW1wb3JhcnknKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9LFxuXG5cdFx0fSlcblx0fTtcblxuXHRyZXR1cm4gbmV3IE1vZHVsZSgpO1xufSkoalF1ZXJ5KTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gSW5pdCBzdWJtaXQgZXZlbnQgZm9ybVxuRXZlbnRNYW5hZ2VySW50ZWdyYXRpb24gPSBFdmVudE1hbmFnZXJJbnRlZ3JhdGlvbiB8fCB7fTtcbkV2ZW50TWFuYWdlckludGVncmF0aW9uLkV2ZW50ID0gRXZlbnRNYW5hZ2VySW50ZWdyYXRpb24uRXZlbnQgfHwge307XG5cbkV2ZW50TWFuYWdlckludGVncmF0aW9uLkV2ZW50LkZvcm0gPSAoZnVuY3Rpb24oJCkge1xuICAgIGZ1bmN0aW9uIEZvcm0oKSB7XG4gICAgICAgICQoJy5zdWJtaXQtZXZlbnQnKS5lYWNoKFxuICAgICAgICAgICAgZnVuY3Rpb24oaW5kZXgsIGV2ZW50Rm9ybSkge1xuICAgICAgICAgICAgICAgIHZhciBhcGlVcmwgPSBldmVudGludGVncmF0aW9uLmFwaXVybDtcbiAgICAgICAgICAgICAgICBhcGlVcmwgPSBhcGlVcmwucmVwbGFjZSgvXFwvJC8sICcnKTtcblxuICAgICAgICAgICAgICAgICQoJyNyZWN1cnJpbmctZXZlbnQnLCBldmVudEZvcm0pXG4gICAgICAgICAgICAgICAgICAgIC5jaGlsZHJlbignLmJveCcpXG4gICAgICAgICAgICAgICAgICAgIC5oaWRlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVFdmVudHMoJChldmVudEZvcm0pLCBhcGlVcmwpO1xuICAgICAgICAgICAgICAgIHRoaXMuaHlwZXJmb3JtRXh0ZW5zaW9ucyhldmVudEZvcm0pO1xuICAgICAgICAgICAgICAgIHRoaXMuZGF0ZVBpY2tlclNldHRpbmdzKCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvY2F0aW9uJykgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkUG9zdFR5cGUoJChldmVudEZvcm0pLCBhcGlVcmwsICdsb2NhdGlvbicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ29yZ2FuaXplcicpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZFBvc3RUeXBlKCQoZXZlbnRGb3JtKSwgYXBpVXJsLCAnb3JnYW5pemVyJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXNlcl9ncm91cHMnKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRUYXhvbm9teSgkKGV2ZW50Rm9ybSksIGFwaVVybCwgJ3VzZXJfZ3JvdXBzJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZXZlbnRfY2F0ZWdvcmllcycpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZFRheG9ub215KCQoZXZlbnRGb3JtKSwgYXBpVXJsLCAnZXZlbnRfY2F0ZWdvcmllcycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2V2ZW50X3RhZ3MnKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRUYXhvbm9teSgkKGV2ZW50Rm9ybSksIGFwaVVybCwgJ2V2ZW50X3RhZ3MnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LmJpbmQodGhpcylcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGQgY3VzdG9tIHZhbGlkYXRpb25zIHdpdGggSHlwZXJmb3JtXG4gICAgICovXG4gICAgRm9ybS5wcm90b3R5cGUuaHlwZXJmb3JtRXh0ZW5zaW9ucyA9IGZ1bmN0aW9uKGV2ZW50Rm9ybSkge1xuICAgICAgICAvLyBNYXRjaCBlbWFpbCBhZGRyZXNzZXNcblxuICAgICAgICBpZiAoJ3N1Ym1pdHRlcl9yZXBlYXRfZW1haWwnIGluIGV2ZW50Rm9ybSkge1xuICAgICAgICAgICAgaHlwZXJmb3JtLmFkZFZhbGlkYXRvcihldmVudEZvcm0uc3VibWl0dGVyX3JlcGVhdF9lbWFpbCwgZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHZhciB2YWxpZCA9IGVsZW1lbnQudmFsdWUgPT09IGV2ZW50Rm9ybS5zdWJtaXR0ZXJfZW1haWwudmFsdWU7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zZXRDdXN0b21WYWxpZGl0eSh2YWxpZCA/ICcnIDogZXZlbnRJbnRlZ3JhdGlvbkZyb250LmVtYWlsX25vdF9tYXRjaGluZyk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsaWQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgnaW1hZ2VfaW5wdXQnIGluIGV2ZW50Rm9ybSkge1xuICAgICAgICAgICAgaHlwZXJmb3JtLmFkZFZhbGlkYXRvcihldmVudEZvcm0uaW1hZ2VfaW5wdXQsIGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoISQoJyNpbWFnZV9pbnB1dCcpLnByb3AoJ3JlcXVpcmVkJykpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIHZhbGlkID0gZWxlbWVudC5maWxlcy5sZW5ndGggPiAwLFxuICAgICAgICAgICAgICAgICAgICBub3RpY2UgPSBldmVudEZvcm0ucXVlcnlTZWxlY3RvcignLmltYWdlLW5vdGljZScpLFxuICAgICAgICAgICAgICAgICAgICBub3RpY2VIdG1sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCF2YWxpZCAmJiAhbm90aWNlKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vdGljZUh0bWwuaW5uZXJIVE1MID0gZXZlbnRJbnRlZ3JhdGlvbkZyb250Lm11c3RfdXBsb2FkX2ltYWdlO1xuICAgICAgICAgICAgICAgICAgICBub3RpY2VIdG1sLmNsYXNzTmFtZSA9ICd0ZXh0LWRhbmdlciBpbWFnZS1ub3RpY2UnO1xuICAgICAgICAgICAgICAgICAgICBldmVudEZvcm0ucXVlcnlTZWxlY3RvcignLmltYWdlLWJveCcpLmFwcGVuZENoaWxkKG5vdGljZUh0bWwpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGVsZW1lbnQuc2V0Q3VzdG9tVmFsaWRpdHkodmFsaWQgPyAnJyA6IGV2ZW50SW50ZWdyYXRpb25Gcm9udC5tdXN0X3VwbG9hZF9pbWFnZSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsaWQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBHZXQgdGF4b25vbWllcyBmcm9tIEFQSSBhbmQgYWRkIHRvIHNlbGVjdCBib3hcbiAgICBGb3JtLnByb3RvdHlwZS5sb2FkVGF4b25vbXkgPSBmdW5jdGlvbihldmVudEZvcm0sIHJlc291cmNlLCB0YXhvbm9teSkge1xuICAgICAgICByZXNvdXJjZSArPSAnLycgKyB0YXhvbm9teSArICc/X2pzb25wPScgKyB0YXhvbm9teSArICcmcGVyX3BhZ2U9MTAwJztcbiAgICAgICAgdmFyIHNlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRheG9ub215KTtcblxuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdHlwZTogJ0dFVCcsXG4gICAgICAgICAgICB1cmw6IHJlc291cmNlLFxuICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29ucCcsXG4gICAgICAgICAgICBqc29ucENhbGxiYWNrOiB0YXhvbm9teSxcbiAgICAgICAgICAgIGNyb3NzRG9tYWluOiB0cnVlLFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAvLyBDbGVhciBzZWxlY3RcbiAgICAgICAgICAgICAgICAkKHNlbGVjdCkuaHRtbCgnJyk7XG5cbiAgICAgICAgICAgICAgICAvLyBNYXAgdXAgYW5kIHBvcHVsYXRlIGhpZXJhcmNoaWNhbCB0YXhvbm9taWVzXG4gICAgICAgICAgICAgICAgaWYgKHRheG9ub215ID09PSAndXNlcl9ncm91cHMnIHx8IHRheG9ub215ID09PSAnZXZlbnRfY2F0ZWdvcmllcycpIHtcbiAgICAgICAgICAgICAgICAgIHZhciB0YXhvbm9taWVzID0gRm9ybS5wcm90b3R5cGUuaGllcmFyY2hpY2FsVGF4KHJlc3BvbnNlKTtcblxuICAgICAgICAgICAgICAgICAgLy8gQWRkIHNlbGVjdCBvcHRpb24gYW5kIGl0J3MgY2hpbGRyZW4gdGF4b25vbWllc1xuICAgICAgICAgICAgICAgICAgJCh0YXhvbm9taWVzLmNoaWxkcmVuKS5lYWNoKGZ1bmN0aW9uIChpbmRleCwgdGF4KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFBhcmVudCBvcHRpb25cbiAgICAgICAgICAgICAgICAgICAgRm9ybS5wcm90b3R5cGUuYWRkT3B0aW9uKHRheCwgc2VsZWN0LCAnJyk7XG4gICAgICAgICAgICAgICAgICAgICQodGF4LmNoaWxkcmVuKS5lYWNoKGZ1bmN0aW9uIChpbmRleCwgdGF4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgLy8gQ2hpbGRyZW4gb3B0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgRm9ybS5wcm90b3R5cGUuYWRkT3B0aW9uKHRheCwgc2VsZWN0LCAnIOKAkyAnKTtcbiAgICAgICAgICAgICAgICAgICAgICAkKHRheC5jaGlsZHJlbikuZWFjaChmdW5jdGlvbiAoaW5kZXgsIHRheCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gR3JhbmQgY2hpbGRyZW4gb3B0aW9uc1xuICAgICAgICAgICAgICAgICAgICAgICAgRm9ybS5wcm90b3R5cGUuYWRkT3B0aW9uKHRheCwgc2VsZWN0LCAnIOKAkyDigJMgJyk7XG4gICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIC8vIFBvcHVsYXRlIG5vbiBoaWVyYXJjaGljYWwgdGF4b25vbXkgbGlzdHNcbiAgICAgICAgICAgICAgICAgIHZhciB0YXhvbm9taWVzID0gcmVzcG9uc2U7XG4gICAgICAgICAgICAgICAgICAkKHRheG9ub21pZXMpLmVhY2goZnVuY3Rpb24gKGluZGV4LCB0ZXJtKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBvcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICAgICAgICAgICAgICAgICAgb3B0LnZhbHVlID0gdGVybS5pZDtcbiAgICAgICAgICAgICAgICAgICAgb3B0LmlubmVySFRNTCArPSB0ZXJtLm5hbWU7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdC5hcHBlbmRDaGlsZChvcHQpO1xuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIEZvcm0ucHJvdG90eXBlLmFkZE9wdGlvbiA9IGZ1bmN0aW9uKHRheG9ub215LCBzZWxlY3QsIGRlcHRoKSB7XG4gICAgICAgIHZhciBvcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICAgICAgb3B0LnZhbHVlID0gdGF4b25vbXkuZGF0YS5pZDtcbiAgICAgICAgb3B0LmlubmVySFRNTCArPSBkZXB0aDtcbiAgICAgICAgb3B0LmlubmVySFRNTCArPSB0YXhvbm9teS5kYXRhLm5hbWU7XG4gICAgICAgIHNlbGVjdC5hcHBlbmRDaGlsZChvcHQpO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBUcmVlTm9kZShkYXRhKSB7XG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgICAgIHRoaXMucGFyZW50ID0gbnVsbDtcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xuICAgIH1cblxuICAgIFRyZWVOb2RlLmNvbXBhcmVyID0gZnVuY3Rpb24oYSwgYikge1xuICAgICAgICByZXR1cm4gYS5kYXRhLm5hbWUgPCBiLmRhdGEubmFtZSA/IDAgOiAxO1xuICAgIH07XG5cbiAgICBUcmVlTm9kZS5wcm90b3R5cGUuc29ydFJlY3Vyc2l2ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmNoaWxkcmVuLnNvcnQoRm9ybS5wcm90b3R5cGUuY29tcGFyZXIpO1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuW2ldLnNvcnRSZWN1cnNpdmUoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLy8gTGlzdCB0YXhvbm9teSBvYmplY3RzIGhpZXJhcmNoaWNhbFxuICAgIEZvcm0ucHJvdG90eXBlLmhpZXJhcmNoaWNhbFRheCA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgdmFyIG5vZGVCeUlkID0ge30sXG4gICAgICAgICAgICBpID0gMCxcbiAgICAgICAgICAgIGwgPSBkYXRhLmxlbmd0aCxcbiAgICAgICAgICAgIG5vZGU7XG5cbiAgICAgICAgLy8gUm9vdCBub2RlXG4gICAgICAgIG5vZGVCeUlkWzBdID0gbmV3IFRyZWVOb2RlKCk7XG5cbiAgICAgICAgLy8gTWFrZSBUcmVlTm9kZSBvYmplY3RzIGZvciBlYWNoIGl0ZW1cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgbm9kZUJ5SWRbZGF0YVtpXS5pZF0gPSBuZXcgVHJlZU5vZGUoZGF0YVtpXSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gTGluayBhbGwgVHJlZU5vZGUgb2JqZWN0c1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBub2RlID0gbm9kZUJ5SWRbZGF0YVtpXS5pZF07XG4gICAgICAgICAgICBub2RlLnBhcmVudCA9IG5vZGVCeUlkW25vZGUuZGF0YS5wYXJlbnRdO1xuICAgICAgICAgICAgbm9kZS5wYXJlbnQuY2hpbGRyZW4ucHVzaChub2RlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBub2RlQnlJZFswXS5zb3J0UmVjdXJzaXZlKCk7XG4gICAgfTtcblxuICAgIC8vIEdldCBhIHBvc3QgdHlwZSBmcm9tIEFQSSBhbmQgYWRkIHRvIGlucHV0IGluaXQgYXV0b2NvbXBsZXRlXG4gICAgRm9ybS5wcm90b3R5cGUubG9hZFBvc3RUeXBlID0gZnVuY3Rpb24oZXZlbnRGb3JtLCByZXNvdXJjZSwgcG9zdFR5cGUpIHtcbiAgICAgICAgcmVzb3VyY2UgKz0gJy8nICsgcG9zdFR5cGUgKyAnL2NvbXBsZXRlP19qc29ucD1nZXQnICsgcG9zdFR5cGU7XG4gICAgICAgIG5ldyBhdXRvQ29tcGxldGUoe1xuICAgICAgICAgICAgc2VsZWN0b3I6ICcjJyArIHBvc3RUeXBlICsgJy1zZWxlY3RvcicsXG4gICAgICAgICAgICBtaW5DaGFyczogMSxcbiAgICAgICAgICAgIHNvdXJjZTogZnVuY3Rpb24odGVybSwgc3VnZ2VzdCkge1xuICAgICAgICAgICAgICAgIHRlcm0gPSB0ZXJtLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ0dFVCcsXG4gICAgICAgICAgICAgICAgICAgIHVybDogcmVzb3VyY2UsXG4gICAgICAgICAgICAgICAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29ucCcsXG4gICAgICAgICAgICAgICAgICAgIGpzb25wQ2FsbGJhY2s6ICdnZXQnICsgcG9zdFR5cGUsXG4gICAgICAgICAgICAgICAgICAgIGNyb3NzRG9tYWluOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN1Z2dlc3Rpb25zID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHJlc3BvbnNlKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKH5pdGVtLnRpdGxlLnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0ZXJtKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VnZ2VzdGlvbnMucHVzaChbaXRlbS50aXRsZSwgaXRlbS5pZCwgcG9zdFR5cGVdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3VnZ2VzdChzdWdnZXN0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVuZGVySXRlbTogZnVuY3Rpb24oaXRlbSwgc2VhcmNoKSB7XG4gICAgICAgICAgICAgICAgc2VhcmNoID0gc2VhcmNoLnJlcGxhY2UoL1stXFwvXFxcXF4kKis/LigpfFtcXF17fV0vZywgJ1xcXFwkJicpO1xuICAgICAgICAgICAgICAgIHZhciByZSA9IG5ldyBSZWdFeHAoJygnICsgc2VhcmNoLnNwbGl0KCcgJykuam9pbignfCcpICsgJyknLCAnZ2knKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImF1dG9jb21wbGV0ZS1zdWdnZXN0aW9uXCIgZGF0YS10eXBlPVwiJyArXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1bMl0gK1xuICAgICAgICAgICAgICAgICAgICAnXCIgZGF0YS1sYW5nbmFtZT1cIicgK1xuICAgICAgICAgICAgICAgICAgICBpdGVtWzBdICtcbiAgICAgICAgICAgICAgICAgICAgJ1wiIGRhdGEtbGFuZz1cIicgK1xuICAgICAgICAgICAgICAgICAgICBpdGVtWzFdICtcbiAgICAgICAgICAgICAgICAgICAgJ1wiIGRhdGEtdmFsPVwiJyArXG4gICAgICAgICAgICAgICAgICAgIHNlYXJjaCArXG4gICAgICAgICAgICAgICAgICAgICdcIj4gJyArXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1bMF0ucmVwbGFjZShyZSwgJzxiPiQxPC9iPicpICtcbiAgICAgICAgICAgICAgICAgICAgJzwvZGl2PidcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9uU2VsZWN0OiBmdW5jdGlvbihlLCB0ZXJtLCBpdGVtKSB7XG4gICAgICAgICAgICAgICAgJCgnIycgKyBpdGVtLmdldEF0dHJpYnV0ZSgnZGF0YS10eXBlJykgKyAnLXNlbGVjdG9yJykudmFsKFxuICAgICAgICAgICAgICAgICAgICBpdGVtLmdldEF0dHJpYnV0ZSgnZGF0YS1sYW5nbmFtZScpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAkKCcjJyArIGl0ZW0uZ2V0QXR0cmlidXRlKCdkYXRhLXR5cGUnKSkudmFsKGl0ZW0uZ2V0QXR0cmlidXRlKCdkYXRhLWxhbmcnKSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy8gU2F2ZStmb3JtYXQgaW5wdXQgZGF0YSBhbmQgcmV0dXJuIGFzIG9iamVjdFxuICAgIEZvcm0ucHJvdG90eXBlLmpzb25EYXRhID0gZnVuY3Rpb24oZm9ybSkge1xuICAgICAgICB2YXIgYXJyRGF0YSA9IGZvcm0uc2VyaWFsaXplQXJyYXkoKSxcbiAgICAgICAgICAgIG9iakRhdGEgPSB7fSxcbiAgICAgICAgICAgIGdyb3VwcyA9IFtdLFxuICAgICAgICAgICAgY2F0ZWdvcmllcyA9IFtdLFxuICAgICAgICAgICAgdGFncyA9IFtdO1xuXG4gICAgICAgICQuZWFjaChhcnJEYXRhLCBmdW5jdGlvbihpbmRleCwgZWxlbSkge1xuICAgICAgICAgICAgc3dpdGNoIChlbGVtLm5hbWUpIHtcbiAgICAgICAgICAgICAgICBjYXNlICd1c2VyX2dyb3Vwcyc6XG4gICAgICAgICAgICAgICAgICAgIGdyb3VwcyA9ICQubWFwKGVsZW0udmFsdWUuc3BsaXQoJywnKSwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUludCh2YWx1ZSwgMTApO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnZXZlbnRfY2F0ZWdvcmllcyc6XG4gICAgICAgICAgICAgICAgICAgIGNhdGVnb3JpZXMucHVzaChwYXJzZUludChlbGVtLnZhbHVlKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2V2ZW50X3RhZ3MnOlxuICAgICAgICAgICAgICAgICAgICB0YWdzLnB1c2gocGFyc2VJbnQoZWxlbS52YWx1ZSkpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBvYmpEYXRhW2VsZW0ubmFtZV0gPSBlbGVtLnZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBPY2Nhc2lvblxuICAgICAgICBvYmpEYXRhWydvY2Nhc2lvbnMnXSA9IFtdO1xuICAgICAgICAkKCcub2NjdXJhbmNlLWdyb3VwLXNpbmdsZScsIGZvcm0pLmVhY2goZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgICAgIHZhciBzdGFydERhdGUgPSBGb3JtLnByb3RvdHlwZS5mb3JtYXREYXRlKFxuICAgICAgICAgICAgICAgICQoJ1tuYW1lPVwic3RhcnRfZGF0ZVwiXScsIHRoaXMpLnZhbCgpLFxuICAgICAgICAgICAgICAgICQoJ1tuYW1lPVwic3RhcnRfdGltZV9oXCJdJywgdGhpcykudmFsKCksXG4gICAgICAgICAgICAgICAgJCgnW25hbWU9XCJzdGFydF90aW1lX21cIl0nLCB0aGlzKS52YWwoKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHZhciBlbmREYXRlID0gRm9ybS5wcm90b3R5cGUuZm9ybWF0RGF0ZShcbiAgICAgICAgICAgICAgICAkKCdbbmFtZT1cImVuZF9kYXRlXCJdJywgdGhpcykudmFsKCksXG4gICAgICAgICAgICAgICAgJCgnW25hbWU9XCJlbmRfdGltZV9oXCJdJywgdGhpcykudmFsKCksXG4gICAgICAgICAgICAgICAgJCgnW25hbWU9XCJlbmRfdGltZV9tXCJdJywgdGhpcykudmFsKClcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAoc3RhcnREYXRlICYmIGVuZERhdGUpIHtcbiAgICAgICAgICAgICAgICBvYmpEYXRhWydvY2Nhc2lvbnMnXS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRfZGF0ZTogc3RhcnREYXRlLFxuICAgICAgICAgICAgICAgICAgICBlbmRfZGF0ZTogZW5kRGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnc2NoZWR1bGVkJyxcbiAgICAgICAgICAgICAgICAgICAgY29udGVudF9tb2RlOiAnbWFzdGVyJyxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gUmVjdXJyaW5nIG9jY2FzaW9uc1xuICAgICAgICBvYmpEYXRhWydyY3JfcnVsZXMnXSA9IFtdO1xuICAgICAgICAkKCcub2NjdXJhbmNlLWdyb3VwLXJlY3VycmluZycsIGZvcm0pLmVhY2goZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgICAgIHZhciByY3JTdGFydEggPSAkKCdbbmFtZT1cInJlY3VycmluZ19zdGFydF9oXCJdJywgdGhpcykudmFsKCksXG4gICAgICAgICAgICAgICAgcmNyU3RhcnRNID0gJCgnW25hbWU9XCJyZWN1cnJpbmdfc3RhcnRfbVwiXScsIHRoaXMpLnZhbCgpO1xuICAgICAgICAgICAgdmFyIHJjclN0YXJ0VGltZSA9XG4gICAgICAgICAgICAgICAgcmNyU3RhcnRIICYmIHJjclN0YXJ0TVxuICAgICAgICAgICAgICAgICAgICA/IEZvcm0ucHJvdG90eXBlLmFkZFplcm8ocmNyU3RhcnRIKSArXG4gICAgICAgICAgICAgICAgICAgICAgJzonICtcbiAgICAgICAgICAgICAgICAgICAgICBGb3JtLnByb3RvdHlwZS5hZGRaZXJvKHJjclN0YXJ0TSkgK1xuICAgICAgICAgICAgICAgICAgICAgICc6JyArXG4gICAgICAgICAgICAgICAgICAgICAgJzAwJ1xuICAgICAgICAgICAgICAgICAgICA6IGZhbHNlO1xuICAgICAgICAgICAgdmFyIHJjckVuZEggPSAkKCdbbmFtZT1cInJlY3VycmluZ19lbmRfaFwiXScsIHRoaXMpLnZhbCgpLFxuICAgICAgICAgICAgICAgIHJjckVuZE0gPSAkKCdbbmFtZT1cInJlY3VycmluZ19lbmRfbVwiXScsIHRoaXMpLnZhbCgpO1xuICAgICAgICAgICAgdmFyIHJjckVuZFRpbWUgPVxuICAgICAgICAgICAgICAgIHJjckVuZEggJiYgcmNyRW5kTVxuICAgICAgICAgICAgICAgICAgICA/IEZvcm0ucHJvdG90eXBlLmFkZFplcm8ocmNyRW5kSCkgK1xuICAgICAgICAgICAgICAgICAgICAgICc6JyArXG4gICAgICAgICAgICAgICAgICAgICAgRm9ybS5wcm90b3R5cGUuYWRkWmVybyhyY3JFbmRNKSArXG4gICAgICAgICAgICAgICAgICAgICAgJzonICtcbiAgICAgICAgICAgICAgICAgICAgICAnMDAnXG4gICAgICAgICAgICAgICAgICAgIDogZmFsc2U7XG4gICAgICAgICAgICB2YXIgcmNyU3RhcnREYXRlID0gRm9ybS5wcm90b3R5cGUuaXNWYWxpZERhdGUoXG4gICAgICAgICAgICAgICAgJCgnW25hbWU9XCJyZWN1cnJpbmdfc3RhcnRfZFwiXScsIHRoaXMpLnZhbCgpXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgPyAkKCdbbmFtZT1cInJlY3VycmluZ19zdGFydF9kXCJdJywgdGhpcykudmFsKClcbiAgICAgICAgICAgICAgICA6IGZhbHNlO1xuICAgICAgICAgICAgdmFyIHJjckVuZERhdGUgPSBGb3JtLnByb3RvdHlwZS5pc1ZhbGlkRGF0ZSgkKCdbbmFtZT1cInJlY3VycmluZ19lbmRfZFwiXScsIHRoaXMpLnZhbCgpKVxuICAgICAgICAgICAgICAgID8gJCgnW25hbWU9XCJyZWN1cnJpbmdfZW5kX2RcIl0nLCB0aGlzKS52YWwoKVxuICAgICAgICAgICAgICAgIDogZmFsc2U7XG5cbiAgICAgICAgICAgIGlmIChyY3JTdGFydFRpbWUgJiYgcmNyRW5kVGltZSAmJiByY3JTdGFydERhdGUgJiYgcmNyRW5kRGF0ZSkge1xuICAgICAgICAgICAgICAgIG9iakRhdGFbJ3Jjcl9ydWxlcyddLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICByY3Jfd2Vla19kYXk6ICQoJ1tuYW1lPVwid2Vla2RheVwiXScsIHRoaXMpLnZhbCgpLFxuICAgICAgICAgICAgICAgICAgICByY3Jfd2Vla2x5X2ludGVydmFsOiAkKCdbbmFtZT1cIndlZWtseV9pbnRlcnZhbFwiXScsIHRoaXMpLnZhbCgpLFxuICAgICAgICAgICAgICAgICAgICByY3Jfc3RhcnRfdGltZTogcmNyU3RhcnRUaW1lLFxuICAgICAgICAgICAgICAgICAgICByY3JfZW5kX3RpbWU6IHJjckVuZFRpbWUsXG4gICAgICAgICAgICAgICAgICAgIHJjcl9zdGFydF9kYXRlOiByY3JTdGFydERhdGUsXG4gICAgICAgICAgICAgICAgICAgIHJjcl9lbmRfZGF0ZTogcmNyRW5kRGF0ZSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCQoJyNvcmdhbml6ZXInLCBmb3JtKS52YWwoKSkge1xuICAgICAgICAgICAgb2JqRGF0YVsnb3JnYW5pemVycyddID0gW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3JnYW5pemVyOiAkKGZvcm0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmluZCgnI29yZ2FuaXplcicpXG4gICAgICAgICAgICAgICAgICAgICAgICAudmFsKCksXG4gICAgICAgICAgICAgICAgICAgIG1haW5fb3JnYW5pemVyOiB0cnVlLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWRkIGFjY2Vzc2liaWxpdHkgaXRlbXNcbiAgICAgICAgb2JqRGF0YVsnYWNjZXNzaWJpbGl0eSddID0gW107XG4gICAgICAgICQuZWFjaCgkKFwiaW5wdXRbbmFtZT0nYWNjZXNzaWJpbGl0eSddOmNoZWNrZWRcIiksIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgb2JqRGF0YVsnYWNjZXNzaWJpbGl0eSddLnB1c2goJCh0aGlzKS52YWwoKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIG9iakRhdGFbJ3VzZXJfZ3JvdXBzJ10gPSBncm91cHM7XG4gICAgICAgIG9iakRhdGFbJ2V2ZW50X2NhdGVnb3JpZXMnXSA9IGNhdGVnb3JpZXM7XG4gICAgICAgIG9iakRhdGFbJ2V2ZW50X3RhZ3MnXSA9IHRhZ3M7XG5cbiAgICAgICAgcmV0dXJuIG9iakRhdGE7XG4gICAgfTtcblxuICAgIC8vIFNlbmQgQWpheCByZXF1ZXN0IHdpdGggbWVkaWEgZGF0YVxuICAgIEZvcm0ucHJvdG90eXBlLnN1Ym1pdEltYWdlQWpheCA9IGZ1bmN0aW9uKGV2ZW50Rm9ybSwgaW1hZ2VEYXRhKSB7XG4gICAgICAgIGltYWdlRGF0YS5hcHBlbmQoJ2FjdGlvbicsICdzdWJtaXRfaW1hZ2UnKTtcbiAgICAgICAgcmV0dXJuICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6IGV2ZW50aW50ZWdyYXRpb24uYWpheHVybCxcbiAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgICAgICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcbiAgICAgICAgICAgIHByb2Nlc3NEYXRhOiBmYWxzZSxcbiAgICAgICAgICAgIGRhdGE6IGltYWdlRGF0YSxcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbihqcVhIUiwgdGV4dFN0YXR1cykge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRleHRTdGF0dXMpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8vIFNlbmQgQWpheCByZXF1ZXN0IHdpdGggcG9zdCBkYXRhXG4gICAgRm9ybS5wcm90b3R5cGUuc3VibWl0RXZlbnRBamF4ID0gZnVuY3Rpb24oZXZlbnRGb3JtLCBmb3JtRGF0YSkge1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiBldmVudGludGVncmF0aW9uLmFqYXh1cmwsXG4gICAgICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgYWN0aW9uOiAnc3VibWl0X2V2ZW50JyxcbiAgICAgICAgICAgICAgICBkYXRhOiBmb3JtRGF0YSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy5zdWJtaXQtc3VjY2VzcycsIGV2ZW50Rm9ybSkucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgICAgICAkKCcuc3VibWl0LXN1Y2Nlc3MgLnN1Y2Nlc3MnLCBldmVudEZvcm0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuZW1wdHkoKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmFwcGVuZCgnPGkgY2xhc3M9XCJmYSBmYS1zZW5kXCI+PC9pPkV2ZW5lbWFuZ2V0IGhhciBza2lja2F0cyE8L2xpPicpO1xuICAgICAgICAgICAgICAgICAgICBGb3JtLnByb3RvdHlwZS5jbGVhbkZvcm0oZXZlbnRGb3JtKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnLnN1Ym1pdC1zdWNjZXNzJywgZXZlbnRGb3JtKS5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgICAgICQoJy5zdWJtaXQtZXJyb3InLCBldmVudEZvcm0pLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnLnN1Ym1pdC1lcnJvciAud2FybmluZycsIGV2ZW50Rm9ybSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5lbXB0eSgpXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKCc8aSBjbGFzcz1cImZhIGZhLXdhcm5pbmdcIj48L2k+JyArIHJlc3BvbnNlLmRhdGEgKyAnPC9saT4nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKGpxWEhSLCB0ZXh0U3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgJCgnLnN1Ym1pdC1zdWNjZXNzJywgZXZlbnRGb3JtKS5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgJCgnLnN1Ym1pdC1lcnJvcicsIGV2ZW50Rm9ybSkucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgICQoJy5zdWJtaXQtZXJyb3IgLndhcm5pbmcnLCBldmVudEZvcm0pXG4gICAgICAgICAgICAgICAgICAgIC5lbXB0eSgpXG4gICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoJzxpIGNsYXNzPVwiZmEgZmEtd2FybmluZ1wiPjwvaT4nICsgdGV4dFN0YXR1cyArICc8L2xpPicpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIEZvcm0ucHJvdG90eXBlLmVuZEhvdXJDaGFuZ2UgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICB2YXIgd3JhcHBlciA9IGV2ZW50LnRhcmdldC5jbG9zZXN0KCcub2NjdXJyZW5jZScpO1xuICAgICAgICBpZiAod3JhcHBlcikge1xuICAgICAgICAgICAgdmFyIHN0YXJ0RGF0ZSA9IHdyYXBwZXIucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cInN0YXJ0X2RhdGVcIl0nKS52YWx1ZSxcbiAgICAgICAgICAgICAgICBlbmREYXRlID0gd3JhcHBlci5xdWVyeVNlbGVjdG9yKCdpbnB1dFtuYW1lPVwiZW5kX2RhdGVcIl0nKS52YWx1ZSxcbiAgICAgICAgICAgICAgICBzdGFydFRpbWVIID0gd3JhcHBlci5xdWVyeVNlbGVjdG9yKCdpbnB1dFtuYW1lPVwic3RhcnRfdGltZV9oXCJdJykudmFsdWU7XG5cbiAgICAgICAgICAgIGlmIChzdGFydERhdGUgPj0gZW5kRGF0ZSkge1xuICAgICAgICAgICAgICAgIGV2ZW50LnRhcmdldC5zZXRBdHRyaWJ1dGUoJ21pbicsIHN0YXJ0VGltZUgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBldmVudC50YXJnZXQuc2V0QXR0cmlidXRlKCdtaW4nLCAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBGb3JtLnByb3RvdHlwZS5lbmRNaW51dGVDaGFuZ2UgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICB2YXIgd3JhcHBlciA9IGV2ZW50LnRhcmdldC5jbG9zZXN0KCcub2NjdXJyZW5jZScpO1xuICAgICAgICBpZiAod3JhcHBlcikge1xuICAgICAgICAgICAgdmFyIHN0YXJ0RGF0ZSA9IHdyYXBwZXIucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cInN0YXJ0X2RhdGVcIl0nKS52YWx1ZSxcbiAgICAgICAgICAgICAgICBlbmREYXRlID0gd3JhcHBlci5xdWVyeVNlbGVjdG9yKCdpbnB1dFtuYW1lPVwiZW5kX2RhdGVcIl0nKS52YWx1ZSxcbiAgICAgICAgICAgICAgICBzdGFydFRpbWVIID0gd3JhcHBlci5xdWVyeVNlbGVjdG9yKCdpbnB1dFtuYW1lPVwic3RhcnRfdGltZV9oXCJdJykudmFsdWUsXG4gICAgICAgICAgICAgICAgZW5kVGltZUggPSB3cmFwcGVyLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWU9XCJlbmRfdGltZV9oXCJdJykudmFsdWUsXG4gICAgICAgICAgICAgICAgc3RhcnRUaW1lTSA9IHdyYXBwZXIucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cInN0YXJ0X3RpbWVfbVwiXScpLnZhbHVlO1xuXG4gICAgICAgICAgICBpZiAoc3RhcnREYXRlID49IGVuZERhdGUgJiYgc3RhcnRUaW1lSCA+PSBlbmRUaW1lSCkge1xuICAgICAgICAgICAgICAgIHN0YXJ0VGltZU0gPSBwYXJzZUludChzdGFydFRpbWVNKSArIDEwO1xuICAgICAgICAgICAgICAgIGlmIChzdGFydFRpbWVNID49IDYwKSB7XG4gICAgICAgICAgICAgICAgICAgIHdyYXBwZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5xdWVyeVNlbGVjdG9yKCdpbnB1dFtuYW1lPVwiZW5kX3RpbWVfaFwiXScpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2V0QXR0cmlidXRlKCdtaW4nLCBwYXJzZUludChzdGFydFRpbWVIKSArIDEpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnRhcmdldC5zZXRBdHRyaWJ1dGUoJ21pbicsIHN0YXJ0VGltZU0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnNldEF0dHJpYnV0ZSgnbWluJywgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgRm9ybS5wcm90b3R5cGUuaW5pdFBpY2tlckV2ZW50ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBlbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W25hbWU9XCJzdGFydF9kYXRlXCJdJyk7XG4gICAgICAgIEFycmF5LmZyb20oZWxlbWVudHMpLmZvckVhY2goXG4gICAgICAgICAgICBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5vbmNoYW5nZSA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUudGFyZ2V0LnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgd3JhcHBlciA9IGUudGFyZ2V0LmNsb3Nlc3QoJy5vY2N1cnJlbmNlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHdyYXBwZXIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpbmQoJ2lucHV0W25hbWU9XCJlbmRfZGF0ZVwiXScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmRhdGVwaWNrZXIoJ29wdGlvbicsICdtaW5EYXRlJywgbmV3IERhdGUoZS50YXJnZXQudmFsdWUpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKTtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKVxuICAgICAgICApO1xuICAgIH07XG5cbiAgICBGb3JtLnByb3RvdHlwZS5pbml0RW5kSG91ckV2ZW50ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBlbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W25hbWU9XCJlbmRfdGltZV9oXCJdJyk7XG4gICAgICAgIEFycmF5LmZyb20oZWxlbWVudHMpLmZvckVhY2goXG4gICAgICAgICAgICBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5vbmNoYW5nZSA9IHRoaXMuZW5kSG91ckNoYW5nZTtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKVxuICAgICAgICApO1xuICAgIH07XG5cbiAgICBGb3JtLnByb3RvdHlwZS5pbml0RW5kTWludXRlRXZlbnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbbmFtZT1cImVuZF90aW1lX21cIl0nKTtcbiAgICAgICAgQXJyYXkuZnJvbShlbGVtZW50cykuZm9yRWFjaChcbiAgICAgICAgICAgIGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50Lm9uY2hhbmdlID0gdGhpcy5lbmRNaW51dGVDaGFuZ2U7XG4gICAgICAgICAgICB9LmJpbmQodGhpcylcbiAgICAgICAgKTtcbiAgICB9O1xuXG4gICAgRm9ybS5wcm90b3R5cGUuaW5pdFJlY3VycmluZ0VuZEhvdXJFdmVudCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFtuYW1lPVwicmVjdXJyaW5nX2VuZF9oXCJdJyk7XG4gICAgICAgIEFycmF5LmZyb20oZWxlbWVudHMpLmZvckVhY2goXG4gICAgICAgICAgICBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5vbmNoYW5nZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB3cmFwcGVyID0gZXZlbnQudGFyZ2V0LmNsb3Nlc3QoJy5vY2N1cnJlbmNlJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh3cmFwcGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3RhcnRUaW1lSCA9IHdyYXBwZXIucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cInJlY3VycmluZ19zdGFydF9oXCJdJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC50YXJnZXQuc2V0QXR0cmlidXRlKCdtaW4nLCBzdGFydFRpbWVIKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9LmJpbmQodGhpcylcbiAgICAgICAgKTtcbiAgICB9O1xuXG4gICAgRm9ybS5wcm90b3R5cGUuaW5pdFJlY3VycmluZ0VuZE1pbnV0ZUV2ZW50ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBlbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W25hbWU9XCJyZWN1cnJpbmdfZW5kX21cIl0nKTtcbiAgICAgICAgQXJyYXkuZnJvbShlbGVtZW50cykuZm9yRWFjaChcbiAgICAgICAgICAgIGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50Lm9uY2hhbmdlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHdyYXBwZXIgPSBldmVudC50YXJnZXQuY2xvc2VzdCgnLm9jY3VycmVuY2UnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHdyYXBwZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdGFydFRpbWVIID0gd3JhcHBlci5xdWVyeVNlbGVjdG9yKCdpbnB1dFtuYW1lPVwicmVjdXJyaW5nX3N0YXJ0X2hcIl0nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlbmRUaW1lSCA9IHdyYXBwZXIucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cInJlY3VycmluZ19lbmRfaFwiXScpLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN0YXJ0VGltZU0gPSB3cmFwcGVyLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWU9XCJyZWN1cnJpbmdfc3RhcnRfbVwiXScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnZhbHVlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhcnRUaW1lSCA+PSBlbmRUaW1lSCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VGltZU0gPSBwYXJzZUludChzdGFydFRpbWVNKSArIDEwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGFydFRpbWVNID49IDYwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdyYXBwZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5xdWVyeVNlbGVjdG9yKCdpbnB1dFtuYW1lPVwicmVjdXJyaW5nX2VuZF9oXCJdJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zZXRBdHRyaWJ1dGUoJ21pbicsIHBhcnNlSW50KHN0YXJ0VGltZUgpICsgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnNldEF0dHJpYnV0ZSgnbWluJywgc3RhcnRUaW1lTSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC50YXJnZXQuc2V0QXR0cmlidXRlKCdtaW4nLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9LmJpbmQodGhpcylcbiAgICAgICAgKTtcbiAgICB9O1xuXG4gICAgRm9ybS5wcm90b3R5cGUuaW5pdERhdGVFdmVudHMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gU2luZ2xlIG9jY2FzaW9ucyBldmVudHNcbiAgICAgICAgdGhpcy5pbml0UGlja2VyRXZlbnQoKTtcbiAgICAgICAgdGhpcy5pbml0RW5kSG91ckV2ZW50KCk7XG4gICAgICAgIHRoaXMuaW5pdEVuZE1pbnV0ZUV2ZW50KCk7XG5cbiAgICAgICAgLy8gUmVjdXJyaW5nIGRhdGUgZXZlbnRzXG4gICAgICAgIHRoaXMuaW5pdFJlY3VycmluZ0VuZEhvdXJFdmVudCgpO1xuICAgICAgICB0aGlzLmluaXRSZWN1cnJpbmdFbmRNaW51dGVFdmVudCgpO1xuICAgIH07XG5cbiAgICBGb3JtLnByb3RvdHlwZS5kYXRlUGlja2VyU2V0dGluZ3MgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgJC5kYXRlcGlja2VyLnNldERlZmF1bHRzKHtcbiAgICAgICAgICAgIG1pbkRhdGU6ICdub3cnLFxuICAgICAgICAgICAgbWF4RGF0ZTogbmV3IERhdGUoKS5nZXREYXRlKCkgKyAzNjUsXG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBGb3JtLnByb3RvdHlwZS5oYW5kbGVFdmVudHMgPSBmdW5jdGlvbihldmVudEZvcm0sIGFwaVVybCkge1xuICAgICAgICB0aGlzLmluaXREYXRlRXZlbnRzKCk7XG5cbiAgICAgICAgJChldmVudEZvcm0pLm9uKFxuICAgICAgICAgICAgJ3N1Ym1pdCcsXG4gICAgICAgICAgICBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgdmFyIGZpbGVJbnB1dCA9IGV2ZW50Rm9ybS5maW5kKCcjaW1hZ2VfaW5wdXQnKSxcbiAgICAgICAgICAgICAgICAgICAgZm9ybURhdGEgPSB0aGlzLmpzb25EYXRhKGV2ZW50Rm9ybSksXG4gICAgICAgICAgICAgICAgICAgIGltYWdlRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuXG4gICAgICAgICAgICAgICAgJCgnLnN1Ym1pdC1lcnJvcicsIGV2ZW50Rm9ybSkuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgICQoJy5zdWJtaXQtc3VjY2VzcycsIGV2ZW50Rm9ybSkucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgICQoJy5zdWJtaXQtc3VjY2VzcyAuc3VjY2VzcycsIGV2ZW50Rm9ybSlcbiAgICAgICAgICAgICAgICAgICAgLmVtcHR5KClcbiAgICAgICAgICAgICAgICAgICAgLmFwcGVuZCgnPGkgY2xhc3M9XCJmYSBmYS1zZW5kXCI+PC9pPlNraWNrYXIuLi48L2xpPicpO1xuXG4gICAgICAgICAgICAgICAgLy8gVXBsb2FkIG1lZGlhIGZpcnN0IGFuZCBhcHBlbmQgaXQgdG8gdGhlIHBvc3QuXG4gICAgICAgICAgICAgICAgaWYgKGZpbGVJbnB1dC52YWwoKSkge1xuICAgICAgICAgICAgICAgICAgICBpbWFnZURhdGEuYXBwZW5kKCdmaWxlJywgZmlsZUlucHV0WzBdLmZpbGVzWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgJC53aGVuKHRoaXMuc3VibWl0SW1hZ2VBamF4KGV2ZW50Rm9ybSwgaW1hZ2VEYXRhKSkudGhlbihmdW5jdGlvbihcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dFN0YXR1c1xuICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybURhdGFbJ2ZlYXR1cmVkX21lZGlhJ10gPSByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEZvcm0ucHJvdG90eXBlLnN1Ym1pdEV2ZW50QWpheChldmVudEZvcm0sIGZvcm1EYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnLnN1Ym1pdC1zdWNjZXNzJywgZXZlbnRGb3JtKS5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnLnN1Ym1pdC1lcnJvcicsIGV2ZW50Rm9ybSkucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJy5zdWJtaXQtZXJyb3IgLndhcm5pbmcnLCBldmVudEZvcm0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5lbXB0eSgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGkgY2xhc3M9XCJmYSBmYS13YXJuaW5nXCI+PC9pPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50SW50ZWdyYXRpb25Gcm9udC5zb21ldGhpbmdfd2VudF93cm9uZyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvbGk+J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgLy8gU3VibWl0IHBvc3QgaWYgbWVkaWEgaXMgbm90IHNldFxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3VibWl0RXZlbnRBamF4KGV2ZW50Rm9ybSwgZm9ybURhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0uYmluZCh0aGlzKVxuICAgICAgICApO1xuXG4gICAgICAgIC8vIFNob3cgaW1hZ2UgYXBwcm92YWwgdGVybXNcbiAgICAgICAgJCgnLmltZy1idXR0b24nLCBldmVudEZvcm0pLmNsaWNrKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICQoJy5pbWFnZS1ib3gnLCBldmVudEZvcm0pLmhpZGUoKTtcbiAgICAgICAgICAgICQoJy5pbWFnZS1hcHByb3ZlJywgZXZlbnRGb3JtKS5mYWRlSW4oKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gU2hvdyB1cGxvYWRlciBpZiB0ZXJtcyBpcyBhcHByb3ZlZFxuICAgICAgICAkKCdpbnB1dFtuYW1lPWFwcHJvdmVdJywgZXZlbnRGb3JtKS5jaGFuZ2UoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZmlyc3RDaGVjayA9ICQoJ2lucHV0OmNoZWNrYm94W2lkPWZpcnN0LWFwcHJvdmVdOmNoZWNrZWQnLCBldmVudEZvcm0pLmxlbmd0aCA+IDA7XG4gICAgICAgICAgICB2YXIgcmFkaW9DaGVjayA9ICQoJ2lucHV0OnJhZGlvW25hbWU9YXBwcm92ZV06Y2hlY2tlZCcpLnZhbCgpO1xuICAgICAgICAgICAgdmFyIHNlY29uZENoZWNrID0gJCgnaW5wdXQ6Y2hlY2tib3hbaWQ9c2Vjb25kLWFwcHJvdmVdOmNoZWNrZWQnLCBldmVudEZvcm0pLmxlbmd0aCA+IDA7XG4gICAgICAgICAgaWYgKChmaXJzdENoZWNrICYmIHJhZGlvQ2hlY2sgPT0gMCkgfHzCoChmaXJzdENoZWNrICYmIHNlY29uZENoZWNrKSkge1xuICAgICAgICAgICAgICAgICQoJy5pbWFnZS1hcHByb3ZlJywgZXZlbnRGb3JtKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgJCgnLmltYWdlLXVwbG9hZCcsIGV2ZW50Rm9ybSkuZmFkZUluKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoJ2lucHV0OnJhZGlvW25hbWU9YXBwcm92ZV0nKS5jaGFuZ2UoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmICh0aGlzLnZhbHVlID09IDEpIHtcbiAgICAgICAgICAgICQoJyNwZXJzb25zLWFwcHJvdmUnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQoJyNwZXJzb25zLWFwcHJvdmUnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBTaG93L2hpZGUgb2NjYXNpb24gYW5kIHJlY2N1cmluZyBvY2Nhc2lvbiBydWxlcy4gQW5kIGFkZCByZXF1aXJlZCBmaWVsZHMuXG4gICAgICAgICQoJ2lucHV0OnJhZGlvW25hbWU9b2NjdXJhbmNlLXR5cGVdJywgZXZlbnRGb3JtKS5jaGFuZ2UoZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBpZCA9ICQodGhpcykuZGF0YSgnaWQnKTtcbiAgICAgICAgICAgICQoJyMnICsgaWQpXG4gICAgICAgICAgICAgICAgLmNoaWxkcmVuKCcuZm9ybS1ncm91cCAuYm94JylcbiAgICAgICAgICAgICAgICAuc2hvdygpXG4gICAgICAgICAgICAgICAgLmZpbmQoJ2lucHV0JylcbiAgICAgICAgICAgICAgICAucHJvcCgncmVxdWlyZWQnLCB0cnVlKTtcbiAgICAgICAgICAgICQoJyMnICsgaWQpXG4gICAgICAgICAgICAgICAgLnNpYmxpbmdzKCcuZXZlbnQtb2NjYXNpb24nKVxuICAgICAgICAgICAgICAgIC5jaGlsZHJlbignLmJveCcpXG4gICAgICAgICAgICAgICAgLmhpZGUoKVxuICAgICAgICAgICAgICAgIC5maW5kKCdpbnB1dCcpXG4gICAgICAgICAgICAgICAgLnByb3AoJ3JlcXVpcmVkJywgZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBBZGQgbmV3IG9jY3VyYW5jZVxuICAgICAgICAkKCcuYWRkLW9jY3VyYW5jZScsIGV2ZW50Rm9ybSkuY2xpY2soXG4gICAgICAgICAgICBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgdmFyICRvY2N1cmFuY2VHcm91cCA9ICQoZXZlbnQudGFyZ2V0KVxuICAgICAgICAgICAgICAgICAgICAgICAgLnBhcmVudCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAucHJldignW2NsYXNzKj1vY2N1cmFuY2UtZ3JvdXBdJyksXG4gICAgICAgICAgICAgICAgICAgICRkdXBsaWNhdGUgPSAkb2NjdXJhbmNlR3JvdXBcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jbG9uZSgpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmluZCgnaW5wdXQnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnZhbCgnJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnaGFzRGF0ZXBpY2tlcicpXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQXR0cignaWQnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmVuZCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAuaW5zZXJ0QWZ0ZXIoJG9jY3VyYW5jZUdyb3VwKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbmQoJy5kYXRlcGlja2VyJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5kYXRlcGlja2VyKClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5lbmQoKTtcblxuICAgICAgICAgICAgICAgIC8vIFJlIGluaXQgZGF0ZSBldmVudHNcbiAgICAgICAgICAgICAgICB0aGlzLmluaXREYXRlRXZlbnRzKCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoJCgnLnJlbW92ZS1vY2N1cmFuY2UnLCAkZHVwbGljYXRlKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyICRyZW1vdmVCdXR0b24gPSAkKFxuICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+PGJ1dHRvbiBjbGFzcz1cImJ0biBidG4gYnRuLXNtIHJlbW92ZS1vY2N1cmFuY2VcIj48aSBjbGFzcz1cInByaWNvbiBwcmljb24tbWludXMtb1wiPjwvaT4gVGEgYm9ydDwvYnV0dG9uPjwvZGl2PidcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgJGR1cGxpY2F0ZS5hcHBlbmQoJHJlbW92ZUJ1dHRvbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpXG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gUmVtb3ZlIG9jY3VyYW5jZVxuICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLnJlbW92ZS1vY2N1cmFuY2UnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAkKHRoaXMpXG4gICAgICAgICAgICAgICAgLmNsb3Nlc3QoJ1tjbGFzcyo9b2NjdXJhbmNlLWdyb3VwXScpXG4gICAgICAgICAgICAgICAgLnJlbW92ZSgpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy8gQ2xlYW4gdXAgZm9ybVxuICAgIEZvcm0ucHJvdG90eXBlLmNsZWFuRm9ybSA9IGZ1bmN0aW9uKGV2ZW50Rm9ybSkge1xuICAgICAgICAkKCc6aW5wdXQnLCBldmVudEZvcm0pXG4gICAgICAgICAgICAubm90KCc6YnV0dG9uLCA6c3VibWl0LCA6cmVzZXQsIDpoaWRkZW4sIHNlbGVjdCcpXG4gICAgICAgICAgICAudmFsKCcnKVxuICAgICAgICAgICAgLnJlbW92ZUF0dHIoJ3NlbGVjdGVkJyk7XG4gICAgfTtcblxuICAgIC8vIEZvcm1hdCBkYXRlIGFuZCB0aW1lXG4gICAgRm9ybS5wcm90b3R5cGUuZm9ybWF0RGF0ZSA9IGZ1bmN0aW9uKGRhdGUsIGhoLCBtbSkge1xuICAgICAgICB2YXIgZGF0ZVRpbWUgPSAnJztcbiAgICAgICAgaWYgKHRoaXMuaXNWYWxpZERhdGUoZGF0ZSkgJiYgaGggJiYgbW0pIHtcbiAgICAgICAgICAgIGRhdGVUaW1lID0gZGF0ZSArICcgJyArIHRoaXMuYWRkWmVybyhoaCkgKyAnOicgKyB0aGlzLmFkZFplcm8obW0pICsgJzowMCc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRhdGVUaW1lO1xuICAgIH07XG5cbiAgICAvLyBDaGVjayB2YWxpZCBkYXRlIGZvcm1hdFxuICAgIEZvcm0ucHJvdG90eXBlLmlzVmFsaWREYXRlID0gZnVuY3Rpb24oZGF0ZVN0cmluZykge1xuICAgICAgICB2YXIgcmVnRXggPSAvXlxcZHs0fS1cXGR7Mn0tXFxkezJ9JC87XG4gICAgICAgIHJldHVybiBkYXRlU3RyaW5nLm1hdGNoKHJlZ0V4KSAhPSBudWxsO1xuICAgIH07XG5cbiAgICAvLyBQcmVmaXggd2l0aCB6ZXJvXG4gICAgRm9ybS5wcm90b3R5cGUuYWRkWmVybyA9IGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgaWYgKGkudG9TdHJpbmcoKS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIGkgPSAnMCcgKyBpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpO1xuICAgIH07XG5cbiAgICByZXR1cm4gbmV3IEZvcm0oKTtcbn0pKGpRdWVyeSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLy9Jbml0IGV2ZW50IHdpZGdldFxuRXZlbnRNYW5hZ2VySW50ZWdyYXRpb24gPSBFdmVudE1hbmFnZXJJbnRlZ3JhdGlvbiB8fCB7fTtcbkV2ZW50TWFuYWdlckludGVncmF0aW9uLldpZGdldCA9IEV2ZW50TWFuYWdlckludGVncmF0aW9uLldpZGdldCB8fCB7fTtcblxuLy9Db21wb25lbnRcbkV2ZW50TWFuYWdlckludGVncmF0aW9uLldpZGdldC5UZW1wbGF0ZVBhcnNlciA9IChmdW5jdGlvbiAoJCkge1xuICAgIHZhciBkYXRlICAgICAgICAgICAgICAgID0gbmV3IERhdGUoKTtcbiAgICB2YXIgZGQgICAgICAgICAgICAgICAgICA9IGRhdGUuZ2V0RGF0ZSgpO1xuICAgIHZhciBtbSAgICAgICAgICAgICAgICAgID0gZGF0ZS5nZXRNb250aCgpKzE7XG4gICAgdmFyIHllYXIgICAgICAgICAgICAgICAgPSBkYXRlLmdldEZ1bGxZZWFyKCk7XG4gICAgdmFyIG1vbnRocyAgICAgICAgICAgICAgPSBbXCJqYW5cIiwgXCJmZWJcIiwgXCJtYXJcIiwgXCJhcHJcIiwgXCJtYWpcIiwgXCJqdW5cIiwgXCJqdWxcIiwgXCJhdWdcIiwgXCJzZXBcIiwgXCJva3RcIiwgXCJub3ZcIiwgXCJkZWNcIl07XG5cbiAgICB2YXIgdGVtcGxhdGUgICAgICAgICAgICA9IHt9O1xuICAgIHZhciBlcnJvclRlbXBsYXRlICAgICAgID0ge307XG5cbiAgICBmdW5jdGlvbiBUZW1wbGF0ZVBhcnNlcigpIHtcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfVxuXG4gICAgVGVtcGxhdGVQYXJzZXIucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICQoXCIuZXZlbnQtYXBpXCIpLmVhY2goZnVuY3Rpb24oaW5kZXgsbW9kdWxlKXtcbiAgICAgICAgICAgIHZhciBkYXRhQXBpdXJsICAgICAgICAgID0gKCQobW9kdWxlKS5hdHRyKCdkYXRhLWFwaXVybCcpKTtcbiAgICAgICAgICAgICAgICBkYXRhQXBpdXJsICAgICAgICAgID0gZGF0YUFwaXVybC5yZXBsYWNlKC9cXC8kLywgXCJcIik7XG4gICAgICAgICAgICAgICAgZGF0YUFwaXVybCAgICAgICAgICA9IGRhdGFBcGl1cmwgKyAnL2V2ZW50L3RpbWU/c3RhcnQ9JyArIHllYXIgKyAnLScgKyBtbSArICctJyArIGRkICsgJyZlbmQ9JyArICh5ZWFyKzEpICsgJy0nICsgbW0gKyAnLScgKyBkZDtcbiAgICAgICAgICAgIHZhciBkYXRhTGltaXQgICAgICAgICAgID0gKCQobW9kdWxlKS5hdHRyKCdwb3N0LWxpbWl0JykpO1xuICAgICAgICAgICAgdmFyIGRhdGFHcm91cElkICAgICAgICAgPSAoJChtb2R1bGUpLmF0dHIoJ2dyb3VwLWlkJykpO1xuICAgICAgICAgICAgdmFyIGRhdGFDYXRlZ29yeUlkICAgICAgPSAoJChtb2R1bGUpLmF0dHIoJ2NhdGVnb3J5LWlkJykpO1xuICAgICAgICAgICAgdmFyIGxhdGxuZyAgICAgICAgICAgICAgPSAoJChtb2R1bGUpLmF0dHIoJ2xhdGxuZycpKTtcbiAgICAgICAgICAgIHZhciBkaXN0YW5jZSAgICAgICAgICAgID0gKCQobW9kdWxlKS5hdHRyKCdkaXN0YW5jZScpKTtcblxuICAgICAgICAgICAgdmFyIGFwaVVybCA9ICh0eXBlb2YgZGF0YUxpbWl0ICE9ICd1bmRlZmluZWQnICYmICQuaXNOdW1lcmljKGRhdGFMaW1pdCkpID8gZGF0YUFwaXVybCArICcmcG9zdC1saW1pdD0nICsgZGF0YUxpbWl0IDogZGF0YUFwaXVybCArICcmcG9zdC1saW1pdD0nICsgMTA7XG4gICAgICAgICAgICAgICAgYXBpVXJsICs9ICh0eXBlb2YgZGF0YUdyb3VwSWQgIT0gJ3VuZGVmaW5lZCcgJibCoGRhdGFHcm91cElkKSA/ICcmZ3JvdXAtaWQ9JyArIGRhdGFHcm91cElkIDogJyc7XG4gICAgICAgICAgICAgICAgYXBpVXJsICs9ICh0eXBlb2YgZGF0YUNhdGVnb3J5SWQgIT0gJ3VuZGVmaW5lZCcgJiYgZGF0YUNhdGVnb3J5SWQpID8gJyZjYXRlZ29yeS1pZD0nICsgZGF0YUNhdGVnb3J5SWQgOiAnJztcbiAgICAgICAgICAgICAgICBhcGlVcmwgKz0gKHR5cGVvZiBsYXRsbmcgIT0gJ3VuZGVmaW5lZCcgJiYgbGF0bG5nKSA/ICcmbGF0bG5nPScgKyBsYXRsbmcgOiAnJztcbiAgICAgICAgICAgICAgICBhcGlVcmwgKz0gKHR5cGVvZiBkaXN0YW5jZSAhPSAndW5kZWZpbmVkJyAmJiBkaXN0YW5jZSkgPyAnJmRpc3RhbmNlPScgKyBkaXN0YW5jZSA6ICcnO1xuICAgICAgICAgICAgICAgIGFwaVVybCArPSAnJl9qc29ucD1nZXRldmVudHMnO1xuICAgICAgICAgICAgdGhpcy5zdG9yZUVycm9yVGVtcGxhdGUoJChtb2R1bGUpKTtcbiAgICAgICAgICAgIHRoaXMuc3RvcmVUZW1wbGF0ZSgkKG1vZHVsZSkpO1xuICAgICAgICAgICAgdGhpcy5zdG9yZU1vZGFsVGVtcGxhdGUoJChtb2R1bGUpKTtcbiAgICAgICAgICAgIHRoaXMubG9hZEV2ZW50KCQobW9kdWxlKSxhcGlVcmwpO1xuICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgIH07XG5cbiAgICBUZW1wbGF0ZVBhcnNlci5wcm90b3R5cGUuc3RvcmVUZW1wbGF0ZSA9IGZ1bmN0aW9uIChtb2R1bGUpIHtcbiAgICAgICAgbW9kdWxlLmRhdGEoJ3RlbXBsYXRlJywkKCcudGVtcGxhdGUnLG1vZHVsZSkuaHRtbCgpKTtcbiAgICAgICAgbW9kdWxlLmZpbmQoJy50ZW1wbGF0ZScpLnJlbW92ZSgpO1xuICAgIH07XG5cbiAgICBUZW1wbGF0ZVBhcnNlci5wcm90b3R5cGUuc3RvcmVFcnJvclRlbXBsYXRlID0gZnVuY3Rpb24gKG1vZHVsZSkge1xuICAgICAgICBtb2R1bGUuZGF0YSgnZXJyb3ItdGVtcGxhdGUnLCQoJy5lcnJvci10ZW1wbGF0ZScsbW9kdWxlKS5odG1sKCkpO1xuICAgICAgICBtb2R1bGUuZmluZCgnLmVycm9yLXRlbXBsYXRlJykucmVtb3ZlKCk7XG4gICAgfTtcblxuICAgIFRlbXBsYXRlUGFyc2VyLnByb3RvdHlwZS5zdG9yZU1vZGFsVGVtcGxhdGUgPSBmdW5jdGlvbiAobW9kdWxlKSB7XG4gICAgICAgIG1vZHVsZS5kYXRhKCdtb2RhbC10ZW1wbGF0ZScsJCgnLm1vZGFsLXRlbXBsYXRlJyxtb2R1bGUpLmh0bWwoKSk7XG4gICAgICAgIG1vZHVsZS5maW5kKCcubW9kYWwtdGVtcGxhdGUnKS5yZW1vdmUoKTtcbiAgICB9O1xuXG4gICAgVGVtcGxhdGVQYXJzZXIucHJvdG90eXBlLmxvYWRFdmVudCA9IGZ1bmN0aW9uKG1vZHVsZSwgcmVzb3VyY2UpIHtcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHR5cGU6IFwiR0VUXCIsXG4gICAgICAgICAgICB1cmw6IHJlc291cmNlLFxuICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgICAgICAgZGF0YVR5cGU6IFwianNvbnBcIixcbiAgICAgICAgICAgIGpzb25wQ2FsbGJhY2s6ICdnZXRldmVudHMnLFxuICAgICAgICAgICAgY3Jvc3NEb21haW46IHRydWUsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiggcmVzcG9uc2UgKSB7XG4gICAgICAgICAgICAgICAgLy9TdG9yZSByZXNwb25zZSBvbiBtb2R1bGVcbiAgICAgICAgICAgICAgICBtb2R1bGUuZGF0YSgnanNvbi1yZXNwb25zZScsIHJlc3BvbnNlKTtcblxuICAgICAgICAgICAgICAgIC8vQ2xlYXIgdGFyZ2V0IGRpdlxuICAgICAgICAgICAgICAgIFRlbXBsYXRlUGFyc2VyLnByb3RvdHlwZS5jbGVhcihtb2R1bGUpO1xuXG4gICAgICAgICAgICAgICAgJChyZXNwb25zZSkuZWFjaChmdW5jdGlvbihpbmRleCxldmVudCl7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gR2V0IHRoZSBjb3JyZWN0IG9jY2FzaW9uXG4gICAgICAgICAgICAgICAgICAgIHZhciBldmVudE9jY2FzaW9uID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgJC5lYWNoKGV2ZW50Lm9jY2FzaW9ucywgZnVuY3Rpb24ob2NjYXRpb25pbmRleCxvY2NhdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvY2NhdGlvbi5jdXJyZW50X29jY2FzaW9uICE9ICd1bmRlZmluZWQnICYmIG9jY2F0aW9uLmN1cnJlbnRfb2NjYXNpb24gPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50T2NjYXNpb24gPSBvY2NhdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBvY2Nhc2lvbkRhdGUgICAgPSBuZXcgRGF0ZShldmVudE9jY2FzaW9uLnN0YXJ0X2RhdGUpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vTG9hZCB0ZW1wbGF0ZSBkYXRhXG4gICAgICAgICAgICAgICAgICAgIHZhciBtb2R1bGVUZW1wbGF0ZSAgPSBtb2R1bGUuZGF0YSgndGVtcGxhdGUnKTtcblxuICAgICAgICAgICAgICAgICAgICAvL1JlcGxhY2Ugd2l0aCB2YWx1ZXNcbiAgICAgICAgICAgICAgICAgICAgbW9kdWxlVGVtcGxhdGUgICAgICA9IG1vZHVsZVRlbXBsYXRlLnJlcGxhY2UoJ3tldmVudC1pZH0nLCBldmVudC5pZCk7XG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZVRlbXBsYXRlICAgICAgPSBtb2R1bGVUZW1wbGF0ZS5yZXBsYWNlKCd7ZXZlbnQtb2NjYXNpb259Jywgb2NjYXNpb25EYXRlLmdldERhdGUoKSArICc8ZGl2IGNsYXNzPVwiY2xlYXJmaXhcIj48L2Rpdj4nICsgbW9udGhzW29jY2FzaW9uRGF0ZS5nZXRNb250aCgpXSk7XG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZVRlbXBsYXRlICAgICAgPSBtb2R1bGVUZW1wbGF0ZS5yZXBsYWNlKCd7ZXZlbnQtdGl0bGV9JywgJzxwIGNsYXNzPVwibGluay1pdGVtXCI+JyArIGV2ZW50LnRpdGxlLnJlbmRlcmVkICsgJzwvcD4nKTtcblxuICAgICAgICAgICAgICAgICAgICAvL0FwcGVuZFxuICAgICAgICAgICAgICAgICAgICBtb2R1bGUuYXBwZW5kKG1vZHVsZVRlbXBsYXRlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAvL2JpbmQgY2xpY2tcbiAgICAgICAgICAgICAgICBUZW1wbGF0ZVBhcnNlci5wcm90b3R5cGUuY2xpY2sobW9kdWxlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oIHJlc3BvbnNlICkge1xuICAgICAgICAgICAgICAgIFRlbXBsYXRlUGFyc2VyLnByb3RvdHlwZS5jbGVhcihtb2R1bGUpO1xuICAgICAgICAgICAgICAgIG1vZHVsZS5odG1sKG1vZHVsZS5kYXRhKCdlcnJvci10ZW1wbGF0ZScpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cblxuICAgIH07XG5cbiAgICBUZW1wbGF0ZVBhcnNlci5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbihtb2R1bGUpe1xuICAgICAgICBqUXVlcnkobW9kdWxlKS5odG1sKCcnKTtcbiAgICB9O1xuXG4gICAgVGVtcGxhdGVQYXJzZXIucHJvdG90eXBlLmFkZFplcm8gPSBmdW5jdGlvbiAoaSkge1xuICAgICAgICBpZiAoaSA8IDEwKSB7XG4gICAgICAgICAgICBpID0gXCIwXCIgKyBpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpO1xuICAgIH07XG5cbiAgICBUZW1wbGF0ZVBhcnNlci5wcm90b3R5cGUuY2xpY2sgPSBmdW5jdGlvbihtb2R1bGUpe1xuXG4gICAgICAgIGpRdWVyeShcImxpIGFcIixtb2R1bGUpLm9uKCdjbGljaycse30sZnVuY3Rpb24oZSl7XG5cbiAgICAgICAgICAgIHZhciBldmVudElkID0galF1ZXJ5KGUudGFyZ2V0KS5jbG9zZXN0KFwiYS5tb2RhbC1ldmVudFwiKS5kYXRhKCdldmVudC1pZCcpO1xuXG4gICAgICAgICAgICAkLmVhY2gobW9kdWxlLmRhdGEoJ2pzb24tcmVzcG9uc2UnKSwgZnVuY3Rpb24oaW5kZXgsb2JqZWN0KSB7XG5cbiAgICAgICAgICAgICAgICBpZihvYmplY3QuaWQgPT0gZXZlbnRJZCkge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIE1haW4gbW9kYWxcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1vZGFsVGVtcGxhdGUgPSBtb2R1bGUuZGF0YSgnbW9kYWwtdGVtcGxhdGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGFsVGVtcGxhdGUgPSBtb2RhbFRlbXBsYXRlLnJlcGxhY2UoJ3tldmVudC1tb2RhbC10aXRsZX0nLCBvYmplY3QudGl0bGUucmVuZGVyZWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9kYWxUZW1wbGF0ZSA9IG1vZGFsVGVtcGxhdGUucmVwbGFjZSgne2V2ZW50LW1vZGFsLWNvbnRlbnR9JywgKG9iamVjdC5jb250ZW50LnJlbmRlcmVkICE9IG51bGwpID8gb2JqZWN0LmNvbnRlbnQucmVuZGVyZWQgOiAnJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RhbFRlbXBsYXRlID0gbW9kYWxUZW1wbGF0ZS5yZXBsYWNlKCd7ZXZlbnQtbW9kYWwtbGlua30nLCAob2JqZWN0LmV2ZW50X2xpbmsgIT0gbnVsbCkgPyAnPHA+PGEgaHJlZj1cIicgKyBvYmplY3QuZXZlbnRfbGluayArICdcIiB0YXJnZXQ9XCJfYmxhbmtcIj4nICsgb2JqZWN0LmV2ZW50X2xpbmsgKyAnPC9hPjwvcD4nIDogJycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9kYWxUZW1wbGF0ZSA9IG1vZGFsVGVtcGxhdGUucmVwbGFjZSgne2V2ZW50LW1vZGFsLWltYWdlfScsIChvYmplY3QuZmVhdHVyZWRfbWVkaWEgIT0gbnVsbCkgPyAnPGltZyBzcmM9JyArIG9iamVjdC5mZWF0dXJlZF9tZWRpYS5zb3VyY2VfdXJsICsgJyBhbHQ9XCInICsgb2JqZWN0LnRpdGxlLnJlbmRlcmVkICsgJ1wiIHN0eWxlPVwiZGlzcGxheTpibG9jazsgd2lkdGg6MTAwJTtcIj4nIDogJycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gT2NjYXRpb25zIGFjY29yZGlvbiBzZWN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbW9kYWxPY2NhdGlvblJlc3VsdCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAkLmVhY2gob2JqZWN0Lm9jY2FzaW9ucywgZnVuY3Rpb24ob2NjYXRpb25pbmRleCxvY2NhdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZvcm1hdCBzdGFydCBhbmQgZW5kIGRhdGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZCA9IG5ldyBEYXRlKG9jY2F0aW9uLnN0YXJ0X2RhdGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdGFydCA9IHRoaXMuYWRkWmVybyhkLmdldERhdGUoKSkgKyAnICcgKyBtb250aHNbZC5nZXRNb250aCgpXSArICcgJyArIGQuZ2V0RnVsbFllYXIoKSArICcga2wuICcgKyB0aGlzLmFkZFplcm8oZC5nZXRIb3VycygpKSArICc6JyArIHRoaXMuYWRkWmVybyhkLmdldE1pbnV0ZXMoKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZSA9IG5ldyBEYXRlKG9jY2F0aW9uLmVuZF9kYXRlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZW5kID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZS5nZXREYXRlKCkgPT09IGQuZ2V0RGF0ZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZCA9ICdrbC4gJyArIHRoaXMuYWRkWmVybyhlLmdldEhvdXJzKCkpICsgJzonICsgdGhpcy5hZGRaZXJvKGUuZ2V0TWludXRlcygpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmQgPSBlLmdldERhdGUoKSArICcgJyArIG1vbnRoc1tlLmdldE1vbnRoKCldICsgJyAnICsgZS5nZXRGdWxsWWVhcigpICsgJyBrbC4gJyArIHRoaXMuYWRkWmVybyhlLmdldEhvdXJzKCkpICsgJzonICsgdGhpcy5hZGRaZXJvKGUuZ2V0TWludXRlcygpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kYWxPY2NhdGlvblJlc3VsdCA9IG1vZGFsT2NjYXRpb25SZXN1bHQgKyAnPGxpIGNsYXNzPVwidGV4dC1zbSBndXR0ZXItc20gZ3V0dGVyLXZlcnRpY2FsXCI+JyArIHN0YXJ0ICsgJyAtICcgKyBlbmQgKyAnPC9saT4nO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9kYWxUZW1wbGF0ZSA9IG1vZGFsVGVtcGxhdGUucmVwbGFjZSgne2V2ZW50LW1vZGFsLW9jY2F0aW9uc30nLCc8c2VjdGlvbiBjbGFzcz1cImFjY29yZGlvbi1zZWN0aW9uXCI+PGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJhY3RpdmUtc2VjdGlvblwiIGlkPVwiYWNjb3JkaW9uLXNlY3Rpb24tMVwiPjxsYWJlbCBjbGFzcz1cImFjY29yZGlvbi10b2dnbGVcIiBmb3I9XCJhY2NvcmRpb24tc2VjdGlvbi0xXCI+PGgyPkV2ZW5lbWFuZ2V0IGludHLDpGZmYXI8L2gyPjwvbGFiZWw+PGRpdiBjbGFzcz1cImFjY29yZGlvbi1jb250ZW50XCI+PHVsIGlkPVwibW9kYWwtb2NjYXRpb25zXCI+JyArIG1vZGFsT2NjYXRpb25SZXN1bHQgKyAnPC91bD48L2Rpdj48L3NlY3Rpb24+Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBMb2NhdGlvbiBhY2NvcmRpb24gc2VjdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxvY2F0aW9uRGF0YSA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYXRpb25EYXRhICs9IChvYmplY3QubG9jYXRpb24gIT0gbnVsbCAmJiBvYmplY3QubG9jYXRpb24udGl0bGUgIT0gbnVsbCkgPyAnPGxpPjxzdHJvbmc+JyArIG9iamVjdC5sb2NhdGlvbi50aXRsZSArICc8L3N0cm9uZz48L2xpPicgOiAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbkRhdGEgKz0gKG9iamVjdC5sb2NhdGlvbiAhPSBudWxsICYmIG9iamVjdC5sb2NhdGlvbi5zdHJlZXRfYWRkcmVzcyAhPSBudWxsKSA/ICc8bGk+JyArIG9iamVjdC5sb2NhdGlvbi5zdHJlZXRfYWRkcmVzcyArICc8L2xpPicgOiAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbkRhdGEgKz0gKG9iamVjdC5sb2NhdGlvbiAhPSBudWxsICYmIG9iamVjdC5sb2NhdGlvbi5wb3N0YWxfY29kZSAhPSBudWxsKSA/ICc8bGk+JyArIG9iamVjdC5sb2NhdGlvbi5wb3N0YWxfY29kZSArICc8L2xpPicgOiAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbkRhdGEgKz0gKG9iamVjdC5sb2NhdGlvbiAhPSBudWxsICYmIG9iamVjdC5sb2NhdGlvbi5jaXR5ICE9IG51bGwpID8gJzxpbD4nICsgb2JqZWN0LmxvY2F0aW9uLmNpdHkgKyAnPC9saT4nIDogJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbG9jYXRpb24gPSAobG9jYXRpb25EYXRhKSA/ICc8c2VjdGlvbiBjbGFzcz1cImFjY29yZGlvbi1zZWN0aW9uXCI+PGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJhY3RpdmUtc2VjdGlvblwiIGlkPVwiYWNjb3JkaW9uLXNlY3Rpb24tMlwiPjxsYWJlbCBjbGFzcz1cImFjY29yZGlvbi10b2dnbGVcIiBmb3I9XCJhY2NvcmRpb24tc2VjdGlvbi0yXCI+PGgyPlBsYXRzPC9oMj48L2xhYmVsPjxkaXYgY2xhc3M9XCJhY2NvcmRpb24tY29udGVudFwiPjx1bD4nICsgbG9jYXRpb25EYXRhICsgJzwvdWw+PC9kaXY+PC9zZWN0aW9uPicgOiAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGFsVGVtcGxhdGUgPSBtb2RhbFRlbXBsYXRlLnJlcGxhY2UoJ3tldmVudC1tb2RhbC1sb2NhdGlvbn0nLCBsb2NhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBCb29va2luZyBhY2NvcmRpb24gc2VjdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGJvb2tpbmdEYXRhID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib29raW5nRGF0YSArPSAob2JqZWN0LmJvb2tpbmdfcGhvbmUgIT0gbnVsbCkgPyAnPGxpPlRlbGVmb246ICcgKyBvYmplY3QuYm9va2luZ19waG9uZSArICc8L2xpPicgOiAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib29raW5nRGF0YSArPSAob2JqZWN0LnByaWNlX2FkdWx0ICE9IG51bGwpID8gJzxsaT5QcmlzOiAnICsgb2JqZWN0LnByaWNlX2FkdWx0ICsgJyBrcjwvbGk+JyA6ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvb2tpbmdEYXRhICs9IChvYmplY3QucHJpY2VfY2hpbGRyZW4gIT0gbnVsbCkgPyAnPGxpPkJhcm5wcmlzOiAnICsgb2JqZWN0LnByaWNlX2NoaWxkcmVuICsgJyBrcjwvbGk+JyA6ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvb2tpbmdEYXRhICs9IChvYmplY3QucHJpY2Vfc2VuaW9yICE9IG51bGwpID8gJzxsaT5QZW5zaW9uw6Ryc3ByaXM6ICcgKyBvYmplY3QucHJpY2Vfc2VuaW9yICsgJyBrcjwvbGk+JyA6ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvb2tpbmdEYXRhICs9IChvYmplY3QucHJpY2Vfc3R1ZGVudCAhPSBudWxsKSA/ICc8bGk+U3R1ZGVudHByaXM6ICcgKyBvYmplY3QucHJpY2Vfc3R1ZGVudCArICcga3I8L2xpPicgOiAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib29raW5nRGF0YSArPSAob2JqZWN0LmFnZV9yZXN0cmljdGlvbiAhPSBudWxsKSA/ICc8bGk+w4VsZGVyc2dyw6RuczogJyArIG9iamVjdC5hZ2VfcmVzdHJpY3Rpb24gKyAnIGtyPC9saT4nIDogJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWVtYmVyc2hpcENhcmRzID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICQuZWFjaChvYmplY3QubWVtYmVyc2hpcF9jYXJkcywgZnVuY3Rpb24oY2FyZGluZGV4LGNhcmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZW1iZXJzaGlwQ2FyZHMgPSBtZW1iZXJzaGlwQ2FyZHMgKyAnPGxpPicgKyBjYXJkLnBvc3RfdGl0bGUgKyAnPC9saT4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib29raW5nRGF0YSArPSAobWVtYmVyc2hpcENhcmRzKSA/ICc8bGk+Jm5ic3A7PC9saT48bGk+PHN0cm9uZz5JbmfDpXIgaSBtZWRsZW1za29ydDwvc3Ryb25nPjwvbGk+JyArIG1lbWJlcnNoaXBDYXJkcyA6ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvb2tpbmdEYXRhICs9IChvYmplY3QuYm9va2luZ19saW5rICE9IG51bGwpID8gJzxsaT4mbmJzcDs8L2xpPjxsaT48YSBocmVmPVwiJyArIG9iamVjdC5ib29raW5nX2xpbmsgKyAnXCIgY2xhc3M9XCJsaW5rLWl0ZW1cIiB0YXJnZXQ9XCJfYmxhbmtcIj5Cb2thIGJsamV0dGVyIGjDpHI8L2E+PC9saT4nIDogJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYm9va2luZyA9IChib29raW5nRGF0YSkgPyAnPHNlY3Rpb24gY2xhc3M9XCJhY2NvcmRpb24tc2VjdGlvblwiPjxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwiYWN0aXZlLXNlY3Rpb25cIiBpZD1cImFjY29yZGlvbi1zZWN0aW9uLTNcIj48bGFiZWwgY2xhc3M9XCJhY2NvcmRpb24tdG9nZ2xlXCIgZm9yPVwiYWNjb3JkaW9uLXNlY3Rpb24tM1wiPjxoMj5Cb2tuaW5nPC9oMj48L2xhYmVsPjxkaXYgY2xhc3M9XCJhY2NvcmRpb24tY29udGVudFwiPjx1bD4nICsgYm9va2luZ0RhdGEgKyAnPC91bD48L2Rpdj48L3NlY3Rpb24+JyA6ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9kYWxUZW1wbGF0ZSA9IG1vZGFsVGVtcGxhdGUucmVwbGFjZSgne2V2ZW50LW1vZGFsLWJvb2tpbmd9JywgYm9va2luZyk7XG5cbiAgICAgICAgICAgICAgICAgICAgJCgnI21vZGFsLWV2ZW50JykucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgICQoJ2JvZHknKS5hcHBlbmQobW9kYWxUZW1wbGF0ZSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICB9O1xuXG4gICAgcmV0dXJuIG5ldyBUZW1wbGF0ZVBhcnNlcigpO1xuXG59KShqUXVlcnkpO1xuIl19
