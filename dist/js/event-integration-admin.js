/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./source/js/admin/accept-deny.js":
/*!****************************************!*\
  !*** ./source/js/admin/accept-deny.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((() => {
  var EventManagerIntegration = EventManagerIntegration || {};
  EventManagerIntegration.Admin = EventManagerIntegration.Admin || {};

  EventManagerIntegration.Admin.AcceptDeny = function ($) {
    function AcceptDeny() {
      $(function () {
        this.handleEvents();
      }.bind(this));
    }
    /**
     * Accept or deny events.
     * @param  int postStatus 1 = accept, 0 = deny
     * @param  int postId     event object id
     * @return {void}
     */


    AcceptDeny.prototype.changeAccepted = function (postStatus, postId) {
      $.ajax({
        url: eventintegration.ajaxurl,
        type: 'post',
        data: {
          action: 'accept_or_deny',
          value: postStatus,
          postId: postId
        },
        beforeSend: function (response) {
          var postElement = $('#post-' + postId);

          if (postStatus == 1) {
            postElement.find('.deny').removeClass('hidden');
            postElement.find('.accept').addClass('hidden');
          } else if (postStatus == 0) {
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
  }(jQuery);
})());

/***/ }),

/***/ "./source/js/admin/draw-map.js":
/*!*************************************!*\
  !*** ./source/js/admin/draw-map.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((() => {
  var EventManagerIntegration = EventManagerIntegration || {};
  EventManagerIntegration.Admin = EventManagerIntegration.Admin || {};

  EventManagerIntegration.Admin.DrawMap = function ($) {
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
        center: {
          lat: 56.04673,
          lng: 12.69437
        },
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
        drawingManager = new google.maps.Polygon(polyOptions); // Set center of the map

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

      drawingManager.setMap(map); // Fire action when polygon shape is completed

      drawingManager.addListener('overlaycomplete', function (e) {
        this.polygonComplete(e);
      }.bind(this));
    };

    DrawMap.prototype.polygonComplete = function (e) {
      drawnPolygon = e.overlay;
      var vertices = e.overlay.getPath(),
          coords = []; // Maximum amount of points is 8

      if (vertices.length > 8) {
        this.clearMap();
        $('#clear-draw-map').after('<div class="notice error"><p>Exceeded maximum amount of 8 points. Please try again.</p></div>');
        $('.notice', drawDiv).delay(3000).fadeOut();
        return;
      }

      for (var i = 0; i < vertices.length; i++) {
        var xy = vertices.getAt(i);
        coords.push({
          lat: xy.lat(),
          lng: xy.lng()
        });
      } // Save to db


      this.saveDrawOptions(coords);

      if (e.type != google.maps.drawing.OverlayType.MARKER) {
        // Switch back to non-drawing mode after drawing a shape.
        drawingManager.setDrawingMode(null); // Hide controls

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
        }
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
  }(jQuery);
})());

/***/ }),

/***/ "./source/js/admin/importer.js":
/*!*************************************!*\
  !*** ./source/js/admin/importer.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((() => {
  var EventManagerIntegration = EventManagerIntegration || {};
  EventManagerIntegration.loading = false;
  EventManagerIntegration.data = {
    'action': 'import_events',
    'value': ''
  };
  EventManagerIntegration.timerId = null;
  jQuery(document).ready(function ($) {
    $('#importevents').click(function () {
      if (!EventManagerIntegration.loadingOccasions) {
        EventManagerIntegration.loadingOccasions = true;
        var button = $(this);
        var storedCss = collectCssFromButton(button);
        redLoadingButton(button, function () {
          EventManagerIntegration.data.value = button.attr('id');
          jQuery.post(ajaxurl, EventManagerIntegration.data, function (response) {
            var newPosts = response;
            EventManagerIntegration.loadingOccasions = false;
            restoreButton(button, storedCss);
            location.reload();
          });
        });
      }
    });
  });

  function collectCssFromButton(button) {
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

  function redLoadingButton(button, callback) {
    button.fadeOut(500, function () {
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
      EventManagerIntegration.timerId = setInterval(function () {
        if (counter > 3) counter = 0;
        button.html(texts[counter]);
        ++counter;
      }, 500);
      if (callback != undefined) callback();
    });
  }

  function restoreButton(button, storedCss) {
    button.fadeOut(500, function () {
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
})());

/***/ }),

/***/ "./source/js/admin/oauth.js":
/*!**********************************!*\
  !*** ./source/js/admin/oauth.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((() => {
  var EventManagerIntegration = EventManagerIntegration || {};
  EventManagerIntegration.Admin = EventManagerIntegration.Admin || {};

  EventManagerIntegration.Admin.Oauth = function ($) {
    function Oauth() {
      $(function () {
        $('.oauth-access').addClass('hidden');
        this.handleEvents();
      }.bind(this));
    }

    Oauth.prototype.requestOauth = function (client, secret) {
      $.ajax({
        url: eventintegration.ajaxurl,
        type: 'post',
        dataType: 'json',
        data: {
          action: 'request_oauth',
          client: client,
          secret: secret
        },
        success: function (response) {
          if (response.success) {
            $(".error").addClass("hidden");
            $(".updated").removeClass("hidden").empty().append('<p>' + response.data.message + '</p>');
            $("#oauth-access").before('<p>' + response.data.url + '</p>');
            $(".oauth-request").addClass("hidden");
            $(".oauth-access").removeClass("hidden");
          } else {
            $(".updated").addClass("hidden");
            $(".error").removeClass("hidden").empty().append('<p>' + response.data + '</p>');
          }
        },
        error: function (error) {
          console.log(error);
        }
      });
    };

    Oauth.prototype.accessOauth = function (verifier) {
      $.ajax({
        url: eventintegration.ajaxurl,
        type: 'post',
        dataType: 'json',
        data: {
          action: 'access_oauth',
          verifier: verifier
        },
        success: function (response) {
          if (response.success) {
            $(".error").addClass("hidden");
            location.reload();
          } else {
            $(".updated").addClass("hidden");
            $(".error").removeClass("hidden").empty().append('<p>' + response.data + '</p>');
          }
        },
        error: function (error) {
          console.log(error);
        }
      });
    };

    Oauth.prototype.deleteOauth = function () {
      $.ajax({
        url: eventintegration.ajaxurl,
        type: 'post',
        data: {
          action: 'delete_oauth'
        },
        success: function (response) {
          console.log(response);
          location.reload();
        },
        error: function (error) {
          console.log(error);
        }
      });
    };
    /**
     * Handle events
     * @return {void}
     */


    Oauth.prototype.handleEvents = function () {
      $("#oauth-request").submit(function (e) {
        e.preventDefault();
        var client = $("#client-key").val();
        var secret = $("#client-secret").val();
        Oauth.prototype.requestOauth(client, secret);
      }.bind(this));
      $("#oauth-access").submit(function (e) {
        e.preventDefault();
        var verifier = $("#verification-token").val();
        console.log(verifier);
        Oauth.prototype.accessOauth(verifier);
      }.bind(this));
      $("#oauth-authorized").submit(function (e) {
        e.preventDefault();
        Oauth.prototype.deleteOauth();
      }.bind(this));
    };

    return new Oauth();
  }(jQuery);
})());

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************************!*\
  !*** ./source/js/admin/index.js ***!
  \**********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _accept_deny__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./accept-deny */ "./source/js/admin/accept-deny.js");
/* harmony import */ var _draw_map__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./draw-map */ "./source/js/admin/draw-map.js");
/* harmony import */ var _importer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./importer */ "./source/js/admin/importer.js");
/* harmony import */ var _oauth__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./oauth */ "./source/js/admin/oauth.js");




})();

/******/ })()
;
//# sourceMappingURL=event-integration-admin.js.map