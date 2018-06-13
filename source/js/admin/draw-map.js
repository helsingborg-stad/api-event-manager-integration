'use strict';

EventManagerIntegration = EventManagerIntegration || {};
EventManagerIntegration.Admin = EventManagerIntegration.Admin || {};

EventManagerIntegration.Admin.DrawMap = (function ($) {

        var drawingManager;

        function DrawMap() {
            $(function () {
                if (typeof google === 'object' && typeof google.maps === 'object' && pagenow === 'event_page_acf-options-options') {
                    this.init();
                }
            }.bind(this));
        }

        DrawMap.prototype.init = function () {
            var drawDiv = document.getElementById('draw-map-container');
            if (!drawDiv) {
                return;
            }

            var mapElement = document.createElement('div');
            mapElement.id = 'draw-map-area';
            drawDiv.appendChild(mapElement);

            var map = new google.maps.Map(mapElement, {
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
                map: map,
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

            // Fire action when polygon shape is completed
            drawingManager.addListener('overlaycomplete', this.polygonComplete);
        };

        DrawMap.prototype.polygonComplete = function (event) {
            var vertices = event.overlay.getPath();
            var coords = [];

            for (var i = 0; i < vertices.length; i++) {
                var xy = vertices.getAt(i);
                coords.push({latitude: xy.lat(), longitude: xy.lng()});
            }

            if (event.type != google.maps.drawing.OverlayType.MARKER) {
                // Switch back to non-drawing mode after drawing a shape.
                drawingManager.setDrawingMode(null);
                // Hide controls
                drawingManager.setOptions({
                    drawingControl: false
                });
            }
        };

        return new DrawMap();
    }
)(jQuery);
