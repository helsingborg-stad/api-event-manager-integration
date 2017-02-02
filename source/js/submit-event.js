"use strict";

// Init
var SubmitEvent = {};

// Init event pagination
SubmitEvent = SubmitEvent || {};

SubmitEvent.Form = (function ($) {
	var postForm 		 = '#submit-event';
	var apiUrl 	 		 = 'http://eventmanager.dev/json/wp/v2';

	// Object used for encoding and decoding a base64 string
	var Base64 = {_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}};

    function Form() {
        $(function() {
        	this.handleEvents();
        	this.init();
        }.bind(this));
    }

    Form.prototype.init = function () {
        $(postForm).each(function(index, form){
        	$(form).find('#end_date').datepicker();
			$(form).find('#start_date').datepicker();

        	this.loadLocations(apiUrl);
        	this.loadTaxonomy(apiUrl, 'user_groups');
        	this.loadTaxonomy(apiUrl, 'event_categories');
        }.bind(this));
    };

    // Get taxonomy from API and add to select box
    Form.prototype.loadTaxonomy = function(resource, taxonomy) {
    	resource += '/' + taxonomy + '?_jsonp=' + taxonomy + '&per_page=100';
    	var select = document.getElementById(taxonomy);
    	console.log(resource);

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
    Form.prototype.loadLocations = function(resource) {
    	resource += '/location/complete?_jsonp=getlocations';
    	var select = document.getElementById('location');
    	console.log(resource);

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

    // Clean up form
    Form.prototype.cleanForm = function () {
		$(':input', postForm)
		.not(':button, :submit, :reset, :hidden, select')
		.val('')
		.removeAttr('checked')
		.removeAttr('selected');
    };

	Form.prototype.jsonData = function(form) {
	    var arrData 	= form.serializeArray(),
	        objData 	= {},
	        groups 		= [],
	        categories	= [],
	        startDate   = [];

	    $.each(arrData, function(index, elem) {
	    	switch(elem.name) {
	    		case 'user_groups':
	    			groups.push(parseInt(elem.value));
			        break;
			    case 'event_categories':
	    			categories.push(parseInt(elem.value));
			        break;
			    case 'start_date':
	    			startDate.push(elem.value);
			        break;
			    // case 'organizers':
			    //     objData[elem.name] = [{"organizer": elem.value, "main_organizer":1}];
			    //     break;
			    default:
			        objData[elem.name] = elem.value;
			}
	    });

	    objData['user_groups'] 		= groups;
	    objData['event_categories'] = categories;

	    // console.log(objData);
	    // console.log(JSON.stringify(objData));
	    return JSON.stringify(objData);
	};

    // Load pagination bar to event modules
    Form.prototype.handleEvents = function () {

		$(postForm).on('submit', function(e) {
		    e.preventDefault();

		    $.ajax({
		        url: apiUrl + '/event',
		        method: 'POST',
		        data: this.jsonData($(postForm)),
		        crossDomain: true,
		        contentType: 'application/json',
		        beforeSend: function(xhr) {
		            xhr.setRequestHeader('Authorization', 'Basic ' + Base64.encode('external-form:test'));
		            $(postForm + ' :submit').fadeOut(function() {
					  $(this).val("Skickat!").fadeIn();
					});
		        },
		        success: function(data) {
		            //console.log(data);
		            Form.prototype.cleanForm();
		        },
		        error: function(error) {
		            console.log(error);
		        },
		        complete: function() {

		        }
		    });
		}.bind(this));

    };

	return new Form();
})(jQuery);
