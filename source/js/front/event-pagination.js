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
    		var moduleId = $(this).find('.box-panel').attr('module-id');
    		var pages = $(this).find('.module-pagination').attr('data-pages');
		    $('.modularity-mod-event-'+moduleId+' .module-pagination').pagination({
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
		        	Module.prototype.loadEvents(page, moduleId);
					$('.modularity-mod-event-'+moduleId+' .module-pagination').pagination('redraw');
		        },
		    });
		});
    };

    // Get event list with Ajax on pagination click
    Module.prototype.loadEvents = function (page, moduleId) {
		var thisModule = $('.modularity-mod-event-' + moduleId);
		var height = $(thisModule).find('.module-content').height();
		$.ajax({
			url: eventintegration.ajaxurl,
			type: 'post',
			data: {
				action: 'ajax_pagination',
				page: page,
				id: moduleId
			},
			beforeSend: function() {
				$(thisModule).find('.event-module-list').remove();
				$(thisModule).find('.module-content').append('<div class="event-load-box"><div class="loader">' + eventIntegrationFront.loading + '...</div></div>');
				$(thisModule).find('.event-load-box').height(height);
			},
			success: function(html) {
				$(thisModule).find('.event-load-box').remove();
				$(thisModule).find('.module-content').append(html).hide().fadeIn(80).height('auto');
			}
		})
	};

	return new Module();
})(jQuery);
