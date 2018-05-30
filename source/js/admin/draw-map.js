'use strict';

EventManagerIntegration = EventManagerIntegration || {};
EventManagerIntegration.Admin = EventManagerIntegration.Admin || {};

EventManagerIntegration.Admin.DrawMap = (function ($) {

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
            zoom: 11,
            center: {lat: 56.04673, lng: 12.69437}
        });

        var drawingManager = new google.maps.drawing.DrawingManager({
            drawingMode: google.maps.drawing.OverlayType.POLYGON,
            drawingControl: true,
            drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_CENTER,
                drawingModes: ['polygon']
            }
        });
        drawingManager.setMap(map);

    };

    return new DrawMap();

})(jQuery);
