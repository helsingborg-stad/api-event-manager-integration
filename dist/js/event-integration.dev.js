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
