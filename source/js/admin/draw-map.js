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
