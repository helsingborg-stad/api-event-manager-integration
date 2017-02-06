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
    		var moduleId = $(this).find('[module-id]').attr('module-id');
    		var pages 	 = $(this).find('.module-pagination').attr('data-pages');
    		var module   = $(this);
		    $(this).find('.module-pagination').pagination({
		    	pages: pages,
		    	displayedPages: 3,
		        edges: 1,
		        cssStyle: 'light-theme',
		        ellipsePageSet: false,
		        prevText: '&laquo;',
		        nextText: '&raquo;',
		       	currentPage: 1,
		       	selectOnClick: false,
		        onPageClick: function(page, event) {
		        	Module.prototype.loadEvents(page, moduleId, module);
					$(module).find('.module-pagination').pagination('redraw');
		        },
		    });
		});
    };

    // Get event list with Ajax on pagination click
    Module.prototype.loadEvents = function (page, moduleId, module) {
		var height = $(module).find('.module-content').height();
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
				$(module).find('.module-content').append('<li class="event-loader"><i class="loading-dots"></i></li>');
				$(module).find('.event-loader').height(height);
				$('html, body').animate({
			        scrollTop: $(module).offset().top
			    }, 100);
			},
			success: function(html) {
				$(module).find('.module-content').append(html).hide().fadeIn(80).height('auto');
			},
			error: function() {
				$(module).find('.module-content').append('<ul class="event-module-list"><li><p>' + eventIntegrationFront.event_pagination_error + '</p></li></ul>').hide().fadeIn(80).height('auto');
			},
			complete: function() {
				$(module).find('.event-loader').remove();
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
	var apiUrl 	 		 = 'http://eventmanager.dev/json/wp/v2';

	// Object used for encoding and decoding a base64 string
	var Base64 = {_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}};

    function Form() {
    	$(".submit-event").each(function(index, eventForm) {
        	$(eventForm).find('#end_date').datepicker();
			$(eventForm).find('#start_date').datepicker();
			$('#recurring-event', eventForm).children('.box').hide();

        	this.handleEvents($(eventForm));
        	this.loadLocations($(eventForm), apiUrl);
        	this.loadTaxonomy($(eventForm), apiUrl, 'user_groups');
        	this.loadTaxonomy($(eventForm), apiUrl, 'event_categories');
        }.bind(this));
    }

    // Get taxonomies from API and add to select box
    Form.prototype.loadTaxonomy = function(eventForm, resource, taxonomy) {
    	resource += '/' + taxonomy + '?_jsonp=' + taxonomy + '&per_page=100';
    	var select = document.getElementById(taxonomy);

        $.ajax({
            type: "GET",
            url: resource,
            cache: false,
            dataType: "jsonp",
            jsonpCallback: taxonomy,
            crossDomain: true,
            success: function(response) {
            	// Clear select
            	$(select).html('');

            	if (taxonomy === 'event_categories') {
            		var taxonomies = Form.prototype.hierarchicalTax(response);
					// Add select option and it's children taxonomies(1 level)
	            	$(taxonomies.children).each(function(index,tax){
					    // Parent option
					    var opt 		= document.createElement('option');
					    opt.value 		= tax.data.id;
					    opt.innerHTML 	= tax.data.name;
					    select.appendChild(opt);
					    // Children options
					    $(tax.children).each(function(index,tax){
						    var opt 		= document.createElement('option');
						    opt.value 		= tax.data.id;
							opt.innerHTML 	+= typeof tax.parent != "undefined" && tax.parent != 0 ? ' – ' : '';
						    opt.innerHTML 	+= tax.data.name;
						    select.appendChild(opt);
		    			});
		    		});
            	} else {
            		$(response).each(function(index,tax){
						    var opt 		= document.createElement('option');
						    opt.value 		= tax.id;
						    opt.innerHTML 	= tax.name;
						    select.appendChild(opt);
		    		});
            	}

            }
        });
    };

	function TreeNode(data) {
		this.data     = data;
		this.parent   = null;
		this.children = [];
	}

	TreeNode.comparer = function(a, b) {
	  	return a.data.name < b.data.name ? 0 : 1;
	};

	TreeNode.prototype.sortRecursive = function () {
 		this.children.sort(Form.prototype.comparer);
  		for (var i=0, l=this.children.length; i<l; i++) {
    		this.children[i].sortRecursive();
 		}
 		return this;
 	};

 	// List taxonomy objects hierarchical
	Form.prototype.hierarchicalTax = function(data) {
		var nodeById = {}, i = 0, l = data.length, node;

		// Root node
		nodeById[0] = new TreeNode();

		// Make TreeNode objects for each item
		for (i=0; i<l; i++) {
			nodeById[data[i].id ] = new TreeNode(data[i]);
		}
		// Link all TreeNode objects
		for (i=0; i<l; i++) {
			node = nodeById[ data[i].id ];
			node.parent = nodeById[node.data.parent];
			node.parent.children.push(node);
		}
		return nodeById[0].sortRecursive();
	};

    // Get locations from API and add to select box
    Form.prototype.loadLocations = function(eventForm, resource) {
    	resource += '/location/complete?_jsonp=getlocations';
    	var select = document.getElementById('location');

        $.ajax({
            type: "GET",
            url: resource,
            cache: false,
            dataType: "jsonp",
            jsonpCallback: 'getlocations',
            crossDomain: true,
            success: function(response) {
            	//Clear select
				$(select).html('');

				//Add empty select choice
			    var opt 		= document.createElement('option');
			    opt.value 		= '';
			    opt.innerHTML 	= "Välj plats";
			    select.appendChild(opt);

				//Add select options
            	$(response).each(function(index,location){
				    var opt 		= document.createElement('option');
				    opt.value 		= location.id;
				    opt.innerHTML 	= location.title;
				    select.appendChild(opt);
	    		});
            }
        });
    };

    // Save+format and return as JSON
	Form.prototype.jsonData = function(form) {
	    var arrData 	= form.serializeArray(),
	        objData 	= {},
	        groups 		= [],
	        categories	= [];

	    $.each(arrData, function(index, elem) {
	    	switch(elem.name) {
	    		case 'user_groups':
	    			groups.push(parseInt(elem.value));
			        break;
			    case 'event_categories':
	    			categories.push(parseInt(elem.value));
			        break;
			    default:
			        objData[elem.name] = elem.value;
			}
	    });

	    // Occasion
	   	var startDate 	= this.formatDate($(form).find("#start_date").val(), $(form).find("#start_time_h").val(), $(form).find("#start_time_m").val());
	    var endDate 	= this.formatDate($(form).find("#end_date").val(), $(form).find("#end_time_h").val(), $(form).find("#end_time_m").val());
	    if (startDate && endDate) {
	    	objData['occasions'] 	= [{
	    						"start_date": startDate,
	    						"end_date": endDate,
	    						"status": "scheduled",
	    						"content_mode": "master"
	    						}]
	    }
	    // Recurring occasions
	    var rcrStartH 		= $(form).find("#recurring_start_h").val(),
	    	rcrStartM 		= $(form).find("#recurring_start_m").val();
	    var rcrStartTime 	= (rcrStartH && rcrStartM) ? this.addZero(rcrStartH) + ":" + this.addZero(rcrStartM) + ":" + "00" : false;
	    var rcrEndH 		= $(form).find("#recurring_end_h").val(),
	    	rcrEndM 		= $(form).find("#recurring_end_m").val();
	    var rcrEndTime 		= (rcrEndH && rcrEndM) ? this.addZero(rcrEndH) + ":" + this.addZero(rcrEndM)  + ":" + "00": false;
	    var rcrStartDate 	= (this.isValidDate($(form).find("#recurring_start_d").val())) ? $(form).find("#recurring_start_d").val() : false;
	    var rcrEndDate 		= (this.isValidDate($(form).find("#recurring_end_d").val())) ? $(form).find("#recurring_end_d").val() : false;
	    if (rcrStartTime && rcrEndTime && rcrStartDate && rcrEndDate) {
		  	objData['rcr_rules']	= [{
		    						"rcr_week_day": $(form).find("#weekday").val(),
		    						"rcr_start_time": rcrStartTime,
		    						"rcr_end_time": rcrEndTime,
		    						"rcr_start_date": rcrStartDate,
		    						"rcr_end_date": rcrEndDate,
		    						}]
	    }
	    if ($(form).find("#organizer").val()) {
	    	objData['organizers'] 	= [{
		    						"organizer": $(form).find("#organizer").val(),
		    						"main_organizer": true
		    						}];
	    }
		objData['import_client'] 	= "integration plugin";
		objData['user_groups'] 		= groups;
		objData['event_categories'] = categories;

	    console.log(objData);
	    console.log(JSON.stringify(objData));
	    return objData;
	};

    Form.prototype.uploadImageAjax = function(eventForm, imageData){
    	return $.ajax({
			        url: apiUrl + '/media',
			        method: 'POST',
			        data: imageData,
			        crossDomain: true,
			        contentType: false,
			        processData: false,
			        beforeSend: function (xhr) {
		            	xhr.setRequestHeader('Authorization', 'Basic ' + Base64.encode('external-form:test'));
			        },
			        success: function(data) {
			        	console.log('Image uploaded:');
			            console.log(data);
			            $('.upload-error', eventForm).addClass('hidden');
			        },
			        error: function(error) {
			            console.log(error);
			        }
			    });
    };

    Form.prototype.submitEventAjax = function(eventForm, formData){
    	return $.ajax({
			        url: apiUrl + '/event',
			        method: 'POST',
			        data: formData,
			        crossDomain: true,
			        contentType: 'application/json',
			        beforeSend: function(xhr) {
			            xhr.setRequestHeader('Authorization', 'Basic ' + Base64.encode('external-form:test'));
			        },
			        success: function(data) {
			        	console.log("Event saved:");
			            console.log(data);
			            Form.prototype.cleanForm(eventForm);
			           	$(':submit', eventForm).fadeOut(function() {
							$(this).val("Skickat!").fadeIn();
						});
			        },
			        error: function(error) {
			            console.log(error);
			        }
			    });
    };

    Form.prototype.handleEvents = function(eventForm) {

		$(eventForm).on('submit', function(e) {
		    e.preventDefault();

		    var fileInput  	= eventForm.find('#image-input'),
    			formData 	= Form.prototype.jsonData(eventForm),
		    	imageData 	= new FormData();

		    if (fileInput.val()) {
		    	imageData.append('file', fileInput[0].files[0]);
			    $.when(Form.prototype.uploadImageAjax(eventForm, imageData))
			    .fail(function() {
					$('.upload-error', eventForm).removeClass('hidden');
				})
			    .then(function(data, textStatus, jqXHR) {
					console.log(jqXHR.status); // Alerts 200
					console.log(data.id);
					formData['featured_media'] 	= data.id;
					Form.prototype.submitEventAjax(eventForm, JSON.stringify(formData));
				});
		    } else {
		    	$('.upload-error', eventForm).addClass('hidden');
		    	Form.prototype.submitEventAjax(eventForm, JSON.stringify(formData));
		    }

		});

		$(':radio', eventForm).change(function (event) {
    		var id = $(this).data('id');
    		$('#' + id).children('.form-group .box').show();
    		$('#' + id).siblings('.event-occasion').children('.box').hide();
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
	Form.prototype.formatDate = function(date, hh, mm) {
		var dateTime = "";
		if (this.isValidDate(date) && hh && mm) {
			dateTime = date + "T" + this.addZero(hh) + ":" + this.addZero(mm) + ":" + "00";
	   	}
		return dateTime;
	};

	// Check valid date format
	Form.prototype.isValidDate = function(dateString){
		var regEx = /^\d{4}-\d{2}-\d{2}$/;
		return dateString.match(regEx) != null;
	};

	// Prefix with zero
    Form.prototype.addZero = function (i) {
    	if(i.toString().length === 1) {
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
            var apiUrl = (typeof dataLimit != 'undefined' && $.isNumeric(dataLimit)) ? dataApiurl + '&post-limit=' + dataLimit : dataApiurl + '&post-limit=' + 10;
                apiUrl += (typeof dataGroupId != 'undefined' && dataGroupId) ? '&group-id=' + dataGroupId : '';
                apiUrl += (typeof dataCategoryId != 'undefined' && dataCategoryId) ? '&category-id=' + dataCategoryId : '';
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
