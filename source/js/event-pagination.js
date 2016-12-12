var EventManagerIntegration = EventManagerIntegration || {};
EventManagerIntegration.Event = EventManagerIntegration.Event || {};

EventManagerIntegration.Event.Module = (function ($) {

    function Module() {
        $(function() {
        	//this.handleEvents();
        	this.initEventModules();
        	this.initEventPagination();
        }.bind(this));
    }

    Module.prototype.initEventModules = function () {
	    $( ".modularity-mod-event" ).each(function( key, value ) {
	    	var id = $(value).find('.box-panel').attr('module-id');
    		var thisModule = $('.modularity-mod-event-' + id);

			$.ajax({
				url: ajaxpagination.ajaxurl,
				type: 'post',
				data: {
					action: 'ajax_get_events',
					id: id
				},
				beforeSend: function() {
					$(thisModule).find('.event-module-list').remove();
					$(thisModule).find('.module-content').append('<div class="event-load-box"><div class="loader">Loading...</div></div>');
				},
				success: function(html) {
					$(thisModule).find('.event-load-box').remove();
					$(thisModule).find('.module-content').append(html).hide().fadeIn(80);
				}
			})
		});
    };

    Module.prototype.initEventPagination = function () {
	    $( ".modularity-mod-event" ).each(function( key, value ) {
			$('.module-pagination').bladePagination({
			maxPageNum: 3,
			prevLabel: '&laquo;',
			nextLabel: '&raquo;',
			moreLabel: '...',
			clickPage: function(page, item) {
				Module.prototype.loadEvents(item, page);
			}
			});
		});
    };

    Module.prototype.loadEvents = function (item, page) {

		var moduleId = $(item).closest('.box-panel').attr('module-id');
		var thisModule = $('.modularity-mod-event-' + moduleId);
		var height = $(thisModule).find('.module-content').height();

		$(thisModule).find(".module-pagination li").not($(item)).removeClass("active");
		$(item).addClass("active");

		$.ajax({
			url: ajaxpagination.ajaxurl,
			type: 'post',
			data: {
				action: 'ajax_pagination',
				page: page,
				id: moduleId
			},
			beforeSend: function() {
				$(thisModule).find('.event-module-list').remove();
				$(thisModule).find('.module-content').append('<div class="event-load-box"><div class="loader">Loading...</div></div>').height(height);
			},
			success: function(html) {
				$(thisModule).find('.event-load-box').remove();
				$(thisModule).find('.module-content').append(html).hide().fadeIn(80);
			}
		})
	};

	return new Module();
})(jQuery);
