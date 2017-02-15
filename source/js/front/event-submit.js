"use strict";

// Init submit event form
EventManagerIntegration = EventManagerIntegration || {};
EventManagerIntegration.Event = EventManagerIntegration.Event || {};

EventManagerIntegration.Event.Form = (function ($) {

    function Form() {
    	$(".submit-event").each(function(index, eventForm) {
    		var apiUrl = eventintegration.apiurl,
    			apiUrl = apiUrl.replace(/\/$/, "");

        	$(eventForm).find('#end_date').datepicker();
			$(eventForm).find('#start_date').datepicker();
			$('#recurring-event', eventForm).children('.box').hide();

        	this.handleEvents($(eventForm), apiUrl);
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
		            	xhr.setRequestHeader('Authorization', 'Basic ' + Base64.encode(usr+":"+usrHash));
			        },
			        success: function(data) {
			        	console.log('Image uploaded:');
			            console.log(data);
			            $('.submit-error', eventForm).addClass('hidden');
			        },
				    error: function(jqXHR, textStatus) {
				    	$('.submit-error', eventForm).removeClass('hidden');
						$('.submit-error .warning', eventForm).empty().append('<i class="fa fa-warning"></i>'+textStatus+'</li>');
				    }
			    });
    };

    Form.prototype.submitImageAjax = function(eventForm, imageData){
    	console.log(imageData);

    	imageData.append('action', 'submit_image');

		return $.ajax({
	        url: eventintegration.ajaxurl,
	        type: "POST",
			cache: false,
            contentType: false,
            processData: false,
            data: imageData,
	        success: function(response) {
	        	console.log(response);

	            if (response.success) {
	            	console.log('Success');
	            	console.log(response);
	    //         	$('.submit-success', eventForm).removeClass('hidden');
					// $('.submit-success .success', eventForm).empty().append('<i class="fa fa-send"></i>Evenemanget har skickats!</li>');
	            	Form.prototype.cleanForm(eventForm);
	            } else {
	            	console.log('Failed');
	            	console.log(response);
	    //         	$('.submit-error', eventForm).removeClass('hidden');
					// $('.submit-error .warning', eventForm).empty().append('<i class="fa fa-warning"></i>'+response.data+'</li>');
	            }
	        },
		    error: function(jqXHR, textStatus) {
		    	console.log('ERROR');
		    	console.log(textStatus);
		  //   	$('.submit-error', eventForm).removeClass('hidden');
				// $('.submit-error .warning', eventForm).empty().append('<i class="fa fa-warning"></i>'+textStatus+'</li>');
		    }
	    });
    };

    Form.prototype.submitEventAjax = function(eventForm, formData){
		$.ajax({
	        url: eventintegration.ajaxurl,
	        type: "POST",
	        data: {
	            action : "submit_event",
	            data : formData
	        },
	        success: function(response) {
	            if (response.success) {
	            	console.log(response);
	            	$('.submit-success', eventForm).removeClass('hidden');
					$('.submit-success .success', eventForm).empty().append('<i class="fa fa-send"></i>Evenemanget har skickats!</li>');
	            	Form.prototype.cleanForm(eventForm);
	            } else {
	            	console.log(response.data);
	            	$('.submit-error', eventForm).removeClass('hidden');
					$('.submit-error .warning', eventForm).empty().append('<i class="fa fa-warning"></i>'+response.data+'</li>');
	            }
	        },
		    error: function(jqXHR, textStatus) {
		    	$('.submit-error', eventForm).removeClass('hidden');
				$('.submit-error .warning', eventForm).empty().append('<i class="fa fa-warning"></i>'+textStatus+'</li>');
		    }
	    });
    };

    Form.prototype.handleEvents = function(eventForm, apiUrl) {
		$(eventForm).on('submit', function(e) {
		    e.preventDefault();

		   	$('.submit-error', eventForm).addClass('hidden');
		   	$('.submit-success', eventForm).addClass('hidden');

		    var fileInput  	= eventForm.find('#image-input'),
    			formData 	= Form.prototype.jsonData(eventForm),
		    	imageData 	= new FormData();

		    if (fileInput.val()) {
		    	imageData.append('file', fileInput[0].files[0]);
		  		console.log(imageData);
		  		Form.prototype.submitImageAjax(eventForm, imageData);

			 //    $.when(Form.prototype.submitImageAjax(eventForm, imageData))
			 //    .fail(function() {
				// 	$('.submit-error', eventForm).removeClass('hidden');
				// 	$('.submit-error .warning', eventForm).empty().append('<i class="fa fa-warning"></i>Uppladningen misslyckades, vänligen försök igen.</li>');
				// })
			 //    .then(function(data, textStatus) {
				// 	console.log(data);
				// 	console.log(textStatus);
				// 	//formData['featured_media'] 	= data.id;
				// 	//Form.prototype.submitEventAjax(eventForm, formData);
				// });
		    } else {
		    	Form.prototype.submitEventAjax(eventForm, formData);
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
