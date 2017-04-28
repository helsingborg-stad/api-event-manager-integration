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
		        cssStyle: '',
		        ellipsePageSet: false,
		        prevText: '&laquo;',
		        nextText: '&raquo;',
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
				$(module).find('.event-module-content').append('<li class="event-loader"><div class="loading-wrapper"><div class="loading"><div></div><div></div><div></div><div></div></div></div></li>');
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
