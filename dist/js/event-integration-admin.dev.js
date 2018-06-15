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
            drawDiv;

        function DrawMap() {
            $(function () {
                if (typeof google === 'object' && typeof google.maps === 'object' && pagenow === 'event_page_acf-options-options') {
                    this.init();
                    this.handleEvents();
                }
            }.bind(this));
        }

        DrawMap.prototype.init = function () {
            drawDiv = document.getElementById('draw-map-container');
            if (!drawDiv) {
                return;
            }

            $(drawDiv).append('<button class="button" id="clear-draw-map">Clear map</button>');
            $(drawDiv).append('<div id="draw-map-area"></div>');

            var map = new google.maps.Map(document.getElementById('draw-map-area'), {
                zoom: 13,
                center: {lat: 56.04673, lng: 12.69437},
                disableDefaultUI: true,
                zoomControl: true
            });

            var polyOptions = {
                strokeWeight: 0,
                fillOpacity: 0.45,
                fillColor: '#1e90ff'
            };

            drawingManager = new google.maps.drawing.DrawingManager({
                drawingMode: google.maps.drawing.OverlayType.POLYGON,
                drawingControl: true,
                drawingControlOptions: {
                    position: google.maps.ControlPosition.TOP_CENTER,
                    drawingModes: ['polygon']
                },
                markerOptions: {
                    draggable: true
                },
                polygonOptions: polyOptions
            });

            drawingManager.setMap(map);

            // Fire action when polygon shape is completed
            drawingManager.addListener('overlaycomplete', function(e) {
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
                coords.push({latitude: xy.lat(), longitude: xy.lng()});
            }

            if (e.type != google.maps.drawing.OverlayType.MARKER) {
                // Switch back to non-drawing mode after drawing a shape.
                drawingManager.setDrawingMode(null);
                // Hide controls
                drawingManager.setOptions({
                    drawingControl: false
                });
            }
        };

        /**
         * Removes the drawn polygon area
         */
        DrawMap.prototype.clearMap = function() {
            if (drawnPolygon) {
                drawnPolygon.setMap(null);
                drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
                drawingManager.setOptions({
                    drawingControl: true
                });
                drawnPolygon = null;
            }
        };

        DrawMap.prototype.handleEvents = function() {
            document.getElementById('clear-draw-map').addEventListener('click', function(e) {
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
