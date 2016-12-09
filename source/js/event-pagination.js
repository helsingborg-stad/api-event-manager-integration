var EventManagerIntegration = EventManagerIntegration || {};
EventManagerIntegration.Event = EventManagerIntegration.Event || {};

EventManagerIntegration.Event.Module = (function ($) {

    function Module() {
        $(function() {
        	this.handleEvents();
        }.bind(this));
    }

    Module.prototype.handleEvents = function () {
		function find_page_number( element ) {
			return parseInt(element.html());
		}

		function find_module_id( element ) {
			var id = $(element).closest('.box-panel').attr('module-id');
			return id;
		}

		$(document).on( 'click', '.module-pagination a', function( event ) {
			event.preventDefault();

			$(this).addClass("active");
			$(".modularity-mod-event .module-pagination a").not($(this)).removeClass("active");

			page = find_page_number($(this).clone());
			moduleId = find_module_id($(this));

			$.ajax({
				url: ajaxpagination.ajaxurl,
				type: 'post',
				data: {
					action: 'ajax_pagination',
					page: page,
					id: moduleId
				},
				success: function( html ) {
					$('.modularity-mod-event').find( '.event-module-list' ).remove();
					$('.modularity-mod-event .module-content').append( html );
				}
			})
		})
	};

	return new Module();
})(jQuery);
