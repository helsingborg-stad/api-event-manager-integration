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
