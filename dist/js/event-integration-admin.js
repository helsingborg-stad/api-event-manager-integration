EventManagerIntegration = EventManagerIntegration || {};
EventManagerIntegration.Admin = EventManagerIntegration.Admin || {};

EventManagerIntegration.Admin.AcceptDeny = (function ($) {

    function AcceptDeny() {
        $(function(){
            this.handleEvents();
        }.bind(this));
    }

    /**
     * Accept or deny events.
     * @param  int postStatus 1 = accept, 0 = deny
     * @param  int postId     event object id
     * @return {void}
     */
    AcceptDeny.prototype.changeAccepted = function(postStatus, postId) {
            $.ajax({
            url: eventintegration.ajaxurl,
            type: 'post',
            data: {
                action    : 'accept_or_deny',
                value     : postStatus,
                postId    : postId
            },
            beforeSend: function(response) {
                var postElement = $('#post-' + postId);
                if (postStatus == 1) {
                    postElement.find('.deny').removeClass('hidden');
                    postElement.find('.accept').addClass('hidden');
                } else if(postStatus == 0) {
                    postElement.find('.deny').addClass('hidden');
                    postElement.find('.accept').removeClass('hidden');
                }
            }
        });
    };

    /**
     * Handle events
     * @return {void}
     */
    AcceptDeny.prototype.handleEvents = function () {
        $(document).on('click', '.accept', function (e) {
            e.preventDefault();
            var postId = $(e.target).attr('postid');
            AcceptDeny.prototype.changeAccepted(1, postId);
        }.bind(this));

        $(document).on('click', '.deny', function (e) {
            e.preventDefault();
            var postId = $(e.target).attr('postid');
            AcceptDeny.prototype.changeAccepted(0, postId);
        }.bind(this));
    };

    return new AcceptDeny();

})(jQuery);

'use strict';

EventManagerIntegration = EventManagerIntegration || {};
EventManagerIntegration.Admin = EventManagerIntegration.Admin || {};

EventManagerIntegration.Admin.DrawMap = (function ($) {

        var drawingManager,
            drawnPolygon,
            savedPoints = eventIntegrationAdmin.options.areaCoordinates;

        function DrawMap() {
            $(function () {
                if (typeof google === 'object' && typeof google.maps === 'object' && pagenow === 'event_page_event-options') {
                    this.init();
                    this.handleEvents();
                }
            }.bind(this));
        }

        DrawMap.prototype.init = function () {
            var map = new google.maps.Map(document.getElementById('draw-map-area'), {
                zoom: 13,
                center: {lat: 56.04673, lng: 12.69437},
                disableDefaultUI: true,
                zoomControl: true
            });

            var polyOptions = {
                strokeWeight: 2,
                fillOpacity: 0.45,
                fillColor: '#1e90ff',
                strokeColor: '#0480FF'
            };

            if (savedPoints) {
                polyOptions.paths = savedPoints;
                drawingManager = new google.maps.Polygon(polyOptions);
                // Set center of the map
                var bounds = new google.maps.LatLngBounds();
                for (var i = 0; i < savedPoints.length; i++) {
                    bounds.extend(savedPoints[i]);
                }
                map.fitBounds(bounds);
            } else {
                drawingManager = new google.maps.drawing.DrawingManager({
                    drawingMode: google.maps.drawing.OverlayType.POLYGON,
                    drawingControl: true,
                    drawingControlOptions: {
                        position: google.maps.ControlPosition.TOP_CENTER,
                        drawingModes: ['polygon']
                    },
                    polygonOptions: polyOptions
                });
            }

            drawingManager.setMap(map);

            // Fire action when polygon shape is completed
            drawingManager.addListener('overlaycomplete', function (e) {
                this.polygonComplete(e);
            }.bind(this));
        };

        DrawMap.prototype.polygonComplete = function (e) {
            drawnPolygon = e.overlay;
            var vertices = e.overlay.getPath(),
                coords = [];

            // Maximum amount of points is 8
            if (vertices.length > 8) {
                this.clearMap();
                $('#clear-draw-map').after('<div class="notice error"><p>Exceeded maximum amount of 8 points. Please try again.</p></div>');
                $('.notice', drawDiv).delay(3000).fadeOut();
                return;
            }

            for (var i = 0; i < vertices.length; i++) {
                var xy = vertices.getAt(i);
                coords.push({lat: xy.lat(), lng: xy.lng()});
            }

            // Save to db
            this.saveDrawOptions(coords);

            if (e.type != google.maps.drawing.OverlayType.MARKER) {
                // Switch back to non-drawing mode after drawing a shape.
                drawingManager.setDrawingMode(null);
                // Hide controls
                drawingManager.setOptions({
                    drawingControl: false
                });
            }
        };

        DrawMap.prototype.saveDrawOptions = function (coordinates) {
            $.ajax({
                url: eventintegration.ajaxurl,
                type: 'post',
                dataType: 'json',
                data: {
                    action: 'save_draw_points',
                    coordinates: coordinates
                },
                error: function (error) {
                    console.log(error);
                },
            });
        };

        /**
         * Removes the drawn polygon area
         */
        DrawMap.prototype.clearMap = function () {
            savedPoints = null;
            this.init();
        };

        DrawMap.prototype.handleEvents = function () {
            document.getElementById('clear-draw-map').addEventListener('click', function (e) {
                e.preventDefault();
                this.clearMap();
            }.bind(this));
        };

        return new DrawMap();
    }
)(jQuery);

var EventManagerIntegration = EventManagerIntegration || {};
EventManagerIntegration.loading = false;
EventManagerIntegration.data = {'action' : 'import_events', 'value': ''};
EventManagerIntegration.timerId = null;

jQuery(document).ready(function ($) {
    $('#importevents').click(function() {
        if(!EventManagerIntegration.loadingOccasions)
        {
            EventManagerIntegration.loadingOccasions = true;
            var button = $(this);
            var storedCss = collectCssFromButton(button);
            redLoadingButton(button, function() {
                EventManagerIntegration.data.value = button.attr('id');
                jQuery.post(ajaxurl, EventManagerIntegration.data, function(response) {
                    var newPosts = response;
                    EventManagerIntegration.loadingOccasions = false;
                    restoreButton(button, storedCss);
                    location.reload();
                });
            });
        }
    });
});

function collectCssFromButton(button)
{
    return {
        bgColor: button.css('background-color'),
        textColor: button.css('color'),
        borderColor: button.css('border-color'),
        textShadow: button.css('text-shadow'),
        boxShadow: button.css('box-shadow'),
        width: button.css('width'),
        text: button.text()
    };
}

function redLoadingButton(button, callback)
{
    button.fadeOut(500, function() {
        var texts = [eventIntegrationAdmin.loading + '&nbsp;&nbsp;&nbsp;', eventIntegrationAdmin.loading + '.&nbsp;&nbsp;', eventIntegrationAdmin.loading + '..&nbsp;', eventIntegrationAdmin.loading + '...'];
        button.css('background-color', 'rgb(51, 197, 255)');
        button.css('border-color', 'rgb(0, 164, 230)');
        button.css('color', 'white');
        button.css('text-shadow', '0 -1px 1px rgb(0, 164, 230),1px 0 1px rgb(0, 164, 230),0 1px 1px rgb(0, 164, 230),-1px 0 1px rgb(0, 164, 230)');
        button.css('box-shadow', 'none');
        button.css('width', '85px');
        button.html(texts[0]);
        button.fadeIn(500);

        var counter = 1;
        EventManagerIntegration.timerId = setInterval(function()
        {
            if(counter > 3)
                counter = 0;
            button.html(texts[counter]);
            ++counter;
        }, 500);
        if(callback != undefined)
            callback();
    });
}

function restoreButton(button, storedCss)
{
    button.fadeOut(500, function() {
        button.css('background-color', storedCss.bgColor);
        button.css('color', storedCss.textColor);
        button.css('border-color', storedCss.borderColor);
        button.css('text-shadow', storedCss.textShadow);
        button.css('box-shadow', storedCss.boxShadow);
        button.css('width', storedCss.width);
        button.text(storedCss.text);
        button.fadeIn(500);
        clearTimeout(EventManagerIntegration.timerId);
    });
}

EventManagerIntegration = EventManagerIntegration || {};
EventManagerIntegration.Admin = EventManagerIntegration.Admin || {};

EventManagerIntegration.Admin.Oauth = (function ($) {

    function Oauth() {
        $(function(){
            $('.oauth-access').addClass('hidden');
            this.handleEvents();
        }.bind(this));
    }

    Oauth.prototype.requestOauth = function(client, secret) {
        $.ajax({
            url: eventintegration.ajaxurl,
            type: 'post',
            dataType: 'json',
            data: {
                action  : 'request_oauth',
                client  : client,
                secret  : secret
            },
            success: function(response) {
                if (response.success) {
                    $(".error").addClass("hidden");
                    $(".updated").removeClass("hidden").empty().append('<p>' + response.data.message + '</p>');
                    $("#oauth-access").before('<p>' + response.data.url + '</p>');
                    $(".oauth-request").addClass("hidden");
                    $(".oauth-access").removeClass("hidden");
                } else {
                    $(".updated").addClass("hidden");
                    $(".error").removeClass("hidden").empty().append('<p>'+response.data+'</p>');
                }
            },
            error: function(error) {
                console.log(error);
            },
        });
    };

    Oauth.prototype.accessOauth = function(verifier) {
        $.ajax({
            url: eventintegration.ajaxurl,
            type: 'post',
            dataType: 'json',
            data: {
                action      : 'access_oauth',
                verifier    : verifier
            },
            success: function(response) {
                if (response.success) {
                    $(".error").addClass("hidden");
                    location.reload();
                } else {
                    $(".updated").addClass("hidden");
                    $(".error").removeClass("hidden").empty().append('<p>'+response.data+'</p>');
                }
            },
            error: function(error) {
                console.log(error);
            },
        });
    };

    Oauth.prototype.deleteOauth = function() {
        $.ajax({
            url: eventintegration.ajaxurl,
            type: 'post',
            data: {
                action : 'delete_oauth'
            },
            success: function(response) {
                console.log(response);
                location.reload();
            },
            error: function(error) {
                console.log(error);
            },
        });
    };

    /**
     * Handle events
     * @return {void}
     */
    Oauth.prototype.handleEvents = function () {
        $("#oauth-request").submit(function(e) {
            e.preventDefault();
            var client = $("#client-key").val();
            var secret = $("#client-secret").val();
            Oauth.prototype.requestOauth(client, secret);
        }.bind(this));

        $("#oauth-access").submit(function(e) {
            e.preventDefault();
            var verifier = $("#verification-token").val();
            console.log(verifier);
            Oauth.prototype.accessOauth(verifier);
        }.bind(this));

        $("#oauth-authorized").submit(function(e) {
            e.preventDefault();
            Oauth.prototype.deleteOauth();
        }.bind(this));

    };

    return new Oauth();

})(jQuery);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFjY2VwdC1kZW55LmpzIiwiZHJhdy1tYXAuanMiLCJpbXBvcnRlci5qcyIsIm9hdXRoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZXZlbnQtaW50ZWdyYXRpb24tYWRtaW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJFdmVudE1hbmFnZXJJbnRlZ3JhdGlvbiA9IEV2ZW50TWFuYWdlckludGVncmF0aW9uIHx8IHt9O1xuRXZlbnRNYW5hZ2VySW50ZWdyYXRpb24uQWRtaW4gPSBFdmVudE1hbmFnZXJJbnRlZ3JhdGlvbi5BZG1pbiB8fCB7fTtcblxuRXZlbnRNYW5hZ2VySW50ZWdyYXRpb24uQWRtaW4uQWNjZXB0RGVueSA9IChmdW5jdGlvbiAoJCkge1xuXG4gICAgZnVuY3Rpb24gQWNjZXB0RGVueSgpIHtcbiAgICAgICAgJChmdW5jdGlvbigpe1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVFdmVudHMoKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBY2NlcHQgb3IgZGVueSBldmVudHMuXG4gICAgICogQHBhcmFtICBpbnQgcG9zdFN0YXR1cyAxID0gYWNjZXB0LCAwID0gZGVueVxuICAgICAqIEBwYXJhbSAgaW50IHBvc3RJZCAgICAgZXZlbnQgb2JqZWN0IGlkXG4gICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgKi9cbiAgICBBY2NlcHREZW55LnByb3RvdHlwZS5jaGFuZ2VBY2NlcHRlZCA9IGZ1bmN0aW9uKHBvc3RTdGF0dXMsIHBvc3RJZCkge1xuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogZXZlbnRpbnRlZ3JhdGlvbi5hamF4dXJsLFxuICAgICAgICAgICAgdHlwZTogJ3Bvc3QnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIGFjdGlvbiAgICA6ICdhY2NlcHRfb3JfZGVueScsXG4gICAgICAgICAgICAgICAgdmFsdWUgICAgIDogcG9zdFN0YXR1cyxcbiAgICAgICAgICAgICAgICBwb3N0SWQgICAgOiBwb3N0SWRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHZhciBwb3N0RWxlbWVudCA9ICQoJyNwb3N0LScgKyBwb3N0SWQpO1xuICAgICAgICAgICAgICAgIGlmIChwb3N0U3RhdHVzID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgcG9zdEVsZW1lbnQuZmluZCgnLmRlbnknKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgICAgIHBvc3RFbGVtZW50LmZpbmQoJy5hY2NlcHQnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmKHBvc3RTdGF0dXMgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBwb3N0RWxlbWVudC5maW5kKCcuZGVueScpLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgcG9zdEVsZW1lbnQuZmluZCgnLmFjY2VwdCcpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGUgZXZlbnRzXG4gICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgKi9cbiAgICBBY2NlcHREZW55LnByb3RvdHlwZS5oYW5kbGVFdmVudHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuYWNjZXB0JywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHZhciBwb3N0SWQgPSAkKGUudGFyZ2V0KS5hdHRyKCdwb3N0aWQnKTtcbiAgICAgICAgICAgIEFjY2VwdERlbnkucHJvdG90eXBlLmNoYW5nZUFjY2VwdGVkKDEsIHBvc3RJZCk7XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5kZW55JywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHZhciBwb3N0SWQgPSAkKGUudGFyZ2V0KS5hdHRyKCdwb3N0aWQnKTtcbiAgICAgICAgICAgIEFjY2VwdERlbnkucHJvdG90eXBlLmNoYW5nZUFjY2VwdGVkKDAsIHBvc3RJZCk7XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgfTtcblxuICAgIHJldHVybiBuZXcgQWNjZXB0RGVueSgpO1xuXG59KShqUXVlcnkpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5FdmVudE1hbmFnZXJJbnRlZ3JhdGlvbiA9IEV2ZW50TWFuYWdlckludGVncmF0aW9uIHx8IHt9O1xuRXZlbnRNYW5hZ2VySW50ZWdyYXRpb24uQWRtaW4gPSBFdmVudE1hbmFnZXJJbnRlZ3JhdGlvbi5BZG1pbiB8fCB7fTtcblxuRXZlbnRNYW5hZ2VySW50ZWdyYXRpb24uQWRtaW4uRHJhd01hcCA9IChmdW5jdGlvbiAoJCkge1xuXG4gICAgICAgIHZhciBkcmF3aW5nTWFuYWdlcixcbiAgICAgICAgICAgIGRyYXduUG9seWdvbixcbiAgICAgICAgICAgIHNhdmVkUG9pbnRzID0gZXZlbnRJbnRlZ3JhdGlvbkFkbWluLm9wdGlvbnMuYXJlYUNvb3JkaW5hdGVzO1xuXG4gICAgICAgIGZ1bmN0aW9uIERyYXdNYXAoKSB7XG4gICAgICAgICAgICAkKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGdvb2dsZSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIGdvb2dsZS5tYXBzID09PSAnb2JqZWN0JyAmJiBwYWdlbm93ID09PSAnZXZlbnRfcGFnZV9ldmVudC1vcHRpb25zJykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVFdmVudHMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgICAgICB9XG5cbiAgICAgICAgRHJhd01hcC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBtYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkcmF3LW1hcC1hcmVhJyksIHtcbiAgICAgICAgICAgICAgICB6b29tOiAxMyxcbiAgICAgICAgICAgICAgICBjZW50ZXI6IHtsYXQ6IDU2LjA0NjczLCBsbmc6IDEyLjY5NDM3fSxcbiAgICAgICAgICAgICAgICBkaXNhYmxlRGVmYXVsdFVJOiB0cnVlLFxuICAgICAgICAgICAgICAgIHpvb21Db250cm9sOiB0cnVlXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIHBvbHlPcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIHN0cm9rZVdlaWdodDogMixcbiAgICAgICAgICAgICAgICBmaWxsT3BhY2l0eTogMC40NSxcbiAgICAgICAgICAgICAgICBmaWxsQ29sb3I6ICcjMWU5MGZmJyxcbiAgICAgICAgICAgICAgICBzdHJva2VDb2xvcjogJyMwNDgwRkYnXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAoc2F2ZWRQb2ludHMpIHtcbiAgICAgICAgICAgICAgICBwb2x5T3B0aW9ucy5wYXRocyA9IHNhdmVkUG9pbnRzO1xuICAgICAgICAgICAgICAgIGRyYXdpbmdNYW5hZ2VyID0gbmV3IGdvb2dsZS5tYXBzLlBvbHlnb24ocG9seU9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIC8vIFNldCBjZW50ZXIgb2YgdGhlIG1hcFxuICAgICAgICAgICAgICAgIHZhciBib3VuZHMgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzKCk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzYXZlZFBvaW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBib3VuZHMuZXh0ZW5kKHNhdmVkUG9pbnRzW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbWFwLmZpdEJvdW5kcyhib3VuZHMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkcmF3aW5nTWFuYWdlciA9IG5ldyBnb29nbGUubWFwcy5kcmF3aW5nLkRyYXdpbmdNYW5hZ2VyKHtcbiAgICAgICAgICAgICAgICAgICAgZHJhd2luZ01vZGU6IGdvb2dsZS5tYXBzLmRyYXdpbmcuT3ZlcmxheVR5cGUuUE9MWUdPTixcbiAgICAgICAgICAgICAgICAgICAgZHJhd2luZ0NvbnRyb2w6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGRyYXdpbmdDb250cm9sT3B0aW9uczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IGdvb2dsZS5tYXBzLkNvbnRyb2xQb3NpdGlvbi5UT1BfQ0VOVEVSLFxuICAgICAgICAgICAgICAgICAgICAgICAgZHJhd2luZ01vZGVzOiBbJ3BvbHlnb24nXVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBwb2x5Z29uT3B0aW9uczogcG9seU9wdGlvbnNcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZHJhd2luZ01hbmFnZXIuc2V0TWFwKG1hcCk7XG5cbiAgICAgICAgICAgIC8vIEZpcmUgYWN0aW9uIHdoZW4gcG9seWdvbiBzaGFwZSBpcyBjb21wbGV0ZWRcbiAgICAgICAgICAgIGRyYXdpbmdNYW5hZ2VyLmFkZExpc3RlbmVyKCdvdmVybGF5Y29tcGxldGUnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIHRoaXMucG9seWdvbkNvbXBsZXRlKGUpO1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICAgICAgfTtcblxuICAgICAgICBEcmF3TWFwLnByb3RvdHlwZS5wb2x5Z29uQ29tcGxldGUgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgZHJhd25Qb2x5Z29uID0gZS5vdmVybGF5O1xuICAgICAgICAgICAgdmFyIHZlcnRpY2VzID0gZS5vdmVybGF5LmdldFBhdGgoKSxcbiAgICAgICAgICAgICAgICBjb29yZHMgPSBbXTtcblxuICAgICAgICAgICAgLy8gTWF4aW11bSBhbW91bnQgb2YgcG9pbnRzIGlzIDhcbiAgICAgICAgICAgIGlmICh2ZXJ0aWNlcy5sZW5ndGggPiA4KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jbGVhck1hcCgpO1xuICAgICAgICAgICAgICAgICQoJyNjbGVhci1kcmF3LW1hcCcpLmFmdGVyKCc8ZGl2IGNsYXNzPVwibm90aWNlIGVycm9yXCI+PHA+RXhjZWVkZWQgbWF4aW11bSBhbW91bnQgb2YgOCBwb2ludHMuIFBsZWFzZSB0cnkgYWdhaW4uPC9wPjwvZGl2PicpO1xuICAgICAgICAgICAgICAgICQoJy5ub3RpY2UnLCBkcmF3RGl2KS5kZWxheSgzMDAwKS5mYWRlT3V0KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZlcnRpY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHh5ID0gdmVydGljZXMuZ2V0QXQoaSk7XG4gICAgICAgICAgICAgICAgY29vcmRzLnB1c2goe2xhdDogeHkubGF0KCksIGxuZzogeHkubG5nKCl9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gU2F2ZSB0byBkYlxuICAgICAgICAgICAgdGhpcy5zYXZlRHJhd09wdGlvbnMoY29vcmRzKTtcblxuICAgICAgICAgICAgaWYgKGUudHlwZSAhPSBnb29nbGUubWFwcy5kcmF3aW5nLk92ZXJsYXlUeXBlLk1BUktFUikge1xuICAgICAgICAgICAgICAgIC8vIFN3aXRjaCBiYWNrIHRvIG5vbi1kcmF3aW5nIG1vZGUgYWZ0ZXIgZHJhd2luZyBhIHNoYXBlLlxuICAgICAgICAgICAgICAgIGRyYXdpbmdNYW5hZ2VyLnNldERyYXdpbmdNb2RlKG51bGwpO1xuICAgICAgICAgICAgICAgIC8vIEhpZGUgY29udHJvbHNcbiAgICAgICAgICAgICAgICBkcmF3aW5nTWFuYWdlci5zZXRPcHRpb25zKHtcbiAgICAgICAgICAgICAgICAgICAgZHJhd2luZ0NvbnRyb2w6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgRHJhd01hcC5wcm90b3R5cGUuc2F2ZURyYXdPcHRpb25zID0gZnVuY3Rpb24gKGNvb3JkaW5hdGVzKSB7XG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHVybDogZXZlbnRpbnRlZ3JhdGlvbi5hamF4dXJsLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdwb3N0JyxcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiAnc2F2ZV9kcmF3X3BvaW50cycsXG4gICAgICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVzOiBjb29yZGluYXRlc1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZW1vdmVzIHRoZSBkcmF3biBwb2x5Z29uIGFyZWFcbiAgICAgICAgICovXG4gICAgICAgIERyYXdNYXAucHJvdG90eXBlLmNsZWFyTWFwID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc2F2ZWRQb2ludHMgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgRHJhd01hcC5wcm90b3R5cGUuaGFuZGxlRXZlbnRzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NsZWFyLWRyYXctbWFwJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNsZWFyTWFwKCk7XG4gICAgICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBuZXcgRHJhd01hcCgpO1xuICAgIH1cbikoalF1ZXJ5KTtcbiIsInZhciBFdmVudE1hbmFnZXJJbnRlZ3JhdGlvbiA9IEV2ZW50TWFuYWdlckludGVncmF0aW9uIHx8IHt9O1xuRXZlbnRNYW5hZ2VySW50ZWdyYXRpb24ubG9hZGluZyA9IGZhbHNlO1xuRXZlbnRNYW5hZ2VySW50ZWdyYXRpb24uZGF0YSA9IHsnYWN0aW9uJyA6ICdpbXBvcnRfZXZlbnRzJywgJ3ZhbHVlJzogJyd9O1xuRXZlbnRNYW5hZ2VySW50ZWdyYXRpb24udGltZXJJZCA9IG51bGw7XG5cbmpRdWVyeShkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCQpIHtcbiAgICAkKCcjaW1wb3J0ZXZlbnRzJykuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmKCFFdmVudE1hbmFnZXJJbnRlZ3JhdGlvbi5sb2FkaW5nT2NjYXNpb25zKVxuICAgICAgICB7XG4gICAgICAgICAgICBFdmVudE1hbmFnZXJJbnRlZ3JhdGlvbi5sb2FkaW5nT2NjYXNpb25zID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhciBidXR0b24gPSAkKHRoaXMpO1xuICAgICAgICAgICAgdmFyIHN0b3JlZENzcyA9IGNvbGxlY3RDc3NGcm9tQnV0dG9uKGJ1dHRvbik7XG4gICAgICAgICAgICByZWRMb2FkaW5nQnV0dG9uKGJ1dHRvbiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgRXZlbnRNYW5hZ2VySW50ZWdyYXRpb24uZGF0YS52YWx1ZSA9IGJ1dHRvbi5hdHRyKCdpZCcpO1xuICAgICAgICAgICAgICAgIGpRdWVyeS5wb3N0KGFqYXh1cmwsIEV2ZW50TWFuYWdlckludGVncmF0aW9uLmRhdGEsIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXdQb3N0cyA9IHJlc3BvbnNlO1xuICAgICAgICAgICAgICAgICAgICBFdmVudE1hbmFnZXJJbnRlZ3JhdGlvbi5sb2FkaW5nT2NjYXNpb25zID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHJlc3RvcmVCdXR0b24oYnV0dG9uLCBzdG9yZWRDc3MpO1xuICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbi5yZWxvYWQoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG59KTtcblxuZnVuY3Rpb24gY29sbGVjdENzc0Zyb21CdXR0b24oYnV0dG9uKVxue1xuICAgIHJldHVybiB7XG4gICAgICAgIGJnQ29sb3I6IGJ1dHRvbi5jc3MoJ2JhY2tncm91bmQtY29sb3InKSxcbiAgICAgICAgdGV4dENvbG9yOiBidXR0b24uY3NzKCdjb2xvcicpLFxuICAgICAgICBib3JkZXJDb2xvcjogYnV0dG9uLmNzcygnYm9yZGVyLWNvbG9yJyksXG4gICAgICAgIHRleHRTaGFkb3c6IGJ1dHRvbi5jc3MoJ3RleHQtc2hhZG93JyksXG4gICAgICAgIGJveFNoYWRvdzogYnV0dG9uLmNzcygnYm94LXNoYWRvdycpLFxuICAgICAgICB3aWR0aDogYnV0dG9uLmNzcygnd2lkdGgnKSxcbiAgICAgICAgdGV4dDogYnV0dG9uLnRleHQoKVxuICAgIH07XG59XG5cbmZ1bmN0aW9uIHJlZExvYWRpbmdCdXR0b24oYnV0dG9uLCBjYWxsYmFjaylcbntcbiAgICBidXR0b24uZmFkZU91dCg1MDAsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdGV4dHMgPSBbZXZlbnRJbnRlZ3JhdGlvbkFkbWluLmxvYWRpbmcgKyAnJm5ic3A7Jm5ic3A7Jm5ic3A7JywgZXZlbnRJbnRlZ3JhdGlvbkFkbWluLmxvYWRpbmcgKyAnLiZuYnNwOyZuYnNwOycsIGV2ZW50SW50ZWdyYXRpb25BZG1pbi5sb2FkaW5nICsgJy4uJm5ic3A7JywgZXZlbnRJbnRlZ3JhdGlvbkFkbWluLmxvYWRpbmcgKyAnLi4uJ107XG4gICAgICAgIGJ1dHRvbi5jc3MoJ2JhY2tncm91bmQtY29sb3InLCAncmdiKDUxLCAxOTcsIDI1NSknKTtcbiAgICAgICAgYnV0dG9uLmNzcygnYm9yZGVyLWNvbG9yJywgJ3JnYigwLCAxNjQsIDIzMCknKTtcbiAgICAgICAgYnV0dG9uLmNzcygnY29sb3InLCAnd2hpdGUnKTtcbiAgICAgICAgYnV0dG9uLmNzcygndGV4dC1zaGFkb3cnLCAnMCAtMXB4IDFweCByZ2IoMCwgMTY0LCAyMzApLDFweCAwIDFweCByZ2IoMCwgMTY0LCAyMzApLDAgMXB4IDFweCByZ2IoMCwgMTY0LCAyMzApLC0xcHggMCAxcHggcmdiKDAsIDE2NCwgMjMwKScpO1xuICAgICAgICBidXR0b24uY3NzKCdib3gtc2hhZG93JywgJ25vbmUnKTtcbiAgICAgICAgYnV0dG9uLmNzcygnd2lkdGgnLCAnODVweCcpO1xuICAgICAgICBidXR0b24uaHRtbCh0ZXh0c1swXSk7XG4gICAgICAgIGJ1dHRvbi5mYWRlSW4oNTAwKTtcblxuICAgICAgICB2YXIgY291bnRlciA9IDE7XG4gICAgICAgIEV2ZW50TWFuYWdlckludGVncmF0aW9uLnRpbWVySWQgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmKGNvdW50ZXIgPiAzKVxuICAgICAgICAgICAgICAgIGNvdW50ZXIgPSAwO1xuICAgICAgICAgICAgYnV0dG9uLmh0bWwodGV4dHNbY291bnRlcl0pO1xuICAgICAgICAgICAgKytjb3VudGVyO1xuICAgICAgICB9LCA1MDApO1xuICAgICAgICBpZihjYWxsYmFjayAhPSB1bmRlZmluZWQpXG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiByZXN0b3JlQnV0dG9uKGJ1dHRvbiwgc3RvcmVkQ3NzKVxue1xuICAgIGJ1dHRvbi5mYWRlT3V0KDUwMCwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGJ1dHRvbi5jc3MoJ2JhY2tncm91bmQtY29sb3InLCBzdG9yZWRDc3MuYmdDb2xvcik7XG4gICAgICAgIGJ1dHRvbi5jc3MoJ2NvbG9yJywgc3RvcmVkQ3NzLnRleHRDb2xvcik7XG4gICAgICAgIGJ1dHRvbi5jc3MoJ2JvcmRlci1jb2xvcicsIHN0b3JlZENzcy5ib3JkZXJDb2xvcik7XG4gICAgICAgIGJ1dHRvbi5jc3MoJ3RleHQtc2hhZG93Jywgc3RvcmVkQ3NzLnRleHRTaGFkb3cpO1xuICAgICAgICBidXR0b24uY3NzKCdib3gtc2hhZG93Jywgc3RvcmVkQ3NzLmJveFNoYWRvdyk7XG4gICAgICAgIGJ1dHRvbi5jc3MoJ3dpZHRoJywgc3RvcmVkQ3NzLndpZHRoKTtcbiAgICAgICAgYnV0dG9uLnRleHQoc3RvcmVkQ3NzLnRleHQpO1xuICAgICAgICBidXR0b24uZmFkZUluKDUwMCk7XG4gICAgICAgIGNsZWFyVGltZW91dChFdmVudE1hbmFnZXJJbnRlZ3JhdGlvbi50aW1lcklkKTtcbiAgICB9KTtcbn1cbiIsIkV2ZW50TWFuYWdlckludGVncmF0aW9uID0gRXZlbnRNYW5hZ2VySW50ZWdyYXRpb24gfHwge307XG5FdmVudE1hbmFnZXJJbnRlZ3JhdGlvbi5BZG1pbiA9IEV2ZW50TWFuYWdlckludGVncmF0aW9uLkFkbWluIHx8IHt9O1xuXG5FdmVudE1hbmFnZXJJbnRlZ3JhdGlvbi5BZG1pbi5PYXV0aCA9IChmdW5jdGlvbiAoJCkge1xuXG4gICAgZnVuY3Rpb24gT2F1dGgoKSB7XG4gICAgICAgICQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICQoJy5vYXV0aC1hY2Nlc3MnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZUV2ZW50cygpO1xuICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIE9hdXRoLnByb3RvdHlwZS5yZXF1ZXN0T2F1dGggPSBmdW5jdGlvbihjbGllbnQsIHNlY3JldCkge1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiBldmVudGludGVncmF0aW9uLmFqYXh1cmwsXG4gICAgICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIGFjdGlvbiAgOiAncmVxdWVzdF9vYXV0aCcsXG4gICAgICAgICAgICAgICAgY2xpZW50ICA6IGNsaWVudCxcbiAgICAgICAgICAgICAgICBzZWNyZXQgIDogc2VjcmV0XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgICAkKFwiLmVycm9yXCIpLmFkZENsYXNzKFwiaGlkZGVuXCIpO1xuICAgICAgICAgICAgICAgICAgICAkKFwiLnVwZGF0ZWRcIikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIikuZW1wdHkoKS5hcHBlbmQoJzxwPicgKyByZXNwb25zZS5kYXRhLm1lc3NhZ2UgKyAnPC9wPicpO1xuICAgICAgICAgICAgICAgICAgICAkKFwiI29hdXRoLWFjY2Vzc1wiKS5iZWZvcmUoJzxwPicgKyByZXNwb25zZS5kYXRhLnVybCArICc8L3A+Jyk7XG4gICAgICAgICAgICAgICAgICAgICQoXCIub2F1dGgtcmVxdWVzdFwiKS5hZGRDbGFzcyhcImhpZGRlblwiKTtcbiAgICAgICAgICAgICAgICAgICAgJChcIi5vYXV0aC1hY2Nlc3NcIikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJChcIi51cGRhdGVkXCIpLmFkZENsYXNzKFwiaGlkZGVuXCIpO1xuICAgICAgICAgICAgICAgICAgICAkKFwiLmVycm9yXCIpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpLmVtcHR5KCkuYXBwZW5kKCc8cD4nK3Jlc3BvbnNlLmRhdGErJzwvcD4nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIE9hdXRoLnByb3RvdHlwZS5hY2Nlc3NPYXV0aCA9IGZ1bmN0aW9uKHZlcmlmaWVyKSB7XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6IGV2ZW50aW50ZWdyYXRpb24uYWpheHVybCxcbiAgICAgICAgICAgIHR5cGU6ICdwb3N0JyxcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgYWN0aW9uICAgICAgOiAnYWNjZXNzX29hdXRoJyxcbiAgICAgICAgICAgICAgICB2ZXJpZmllciAgICA6IHZlcmlmaWVyXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgICAkKFwiLmVycm9yXCIpLmFkZENsYXNzKFwiaGlkZGVuXCIpO1xuICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbi5yZWxvYWQoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkKFwiLnVwZGF0ZWRcIikuYWRkQ2xhc3MoXCJoaWRkZW5cIik7XG4gICAgICAgICAgICAgICAgICAgICQoXCIuZXJyb3JcIikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIikuZW1wdHkoKS5hcHBlbmQoJzxwPicrcmVzcG9uc2UuZGF0YSsnPC9wPicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgT2F1dGgucHJvdG90eXBlLmRlbGV0ZU9hdXRoID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6IGV2ZW50aW50ZWdyYXRpb24uYWpheHVybCxcbiAgICAgICAgICAgIHR5cGU6ICdwb3N0JyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBhY3Rpb24gOiAnZGVsZXRlX29hdXRoJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGUgZXZlbnRzXG4gICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgKi9cbiAgICBPYXV0aC5wcm90b3R5cGUuaGFuZGxlRXZlbnRzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAkKFwiI29hdXRoLXJlcXVlc3RcIikuc3VibWl0KGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHZhciBjbGllbnQgPSAkKFwiI2NsaWVudC1rZXlcIikudmFsKCk7XG4gICAgICAgICAgICB2YXIgc2VjcmV0ID0gJChcIiNjbGllbnQtc2VjcmV0XCIpLnZhbCgpO1xuICAgICAgICAgICAgT2F1dGgucHJvdG90eXBlLnJlcXVlc3RPYXV0aChjbGllbnQsIHNlY3JldCk7XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICAgICAgJChcIiNvYXV0aC1hY2Nlc3NcIikuc3VibWl0KGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHZhciB2ZXJpZmllciA9ICQoXCIjdmVyaWZpY2F0aW9uLXRva2VuXCIpLnZhbCgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2codmVyaWZpZXIpO1xuICAgICAgICAgICAgT2F1dGgucHJvdG90eXBlLmFjY2Vzc09hdXRoKHZlcmlmaWVyKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcblxuICAgICAgICAkKFwiI29hdXRoLWF1dGhvcml6ZWRcIikuc3VibWl0KGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIE9hdXRoLnByb3RvdHlwZS5kZWxldGVPYXV0aCgpO1xuICAgICAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgfTtcblxuICAgIHJldHVybiBuZXcgT2F1dGgoKTtcblxufSkoalF1ZXJ5KTtcbiJdfQ==
