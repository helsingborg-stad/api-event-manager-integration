/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./source/js/front/event-map.js":
/*!**************************************!*\
  !*** ./source/js/front/event-map.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((() => {
  if (!EventManagerIntegration) {
    var EventManagerIntegration = {};
  } // EventManagerIntegration = EventManagerIntegration || {};


  EventManagerIntegration.Event = EventManagerIntegration.Event || {};

  EventManagerIntegration.Event.Map = function () {
    function Map() {
      if (typeof google === 'object' && typeof google.maps === 'object') {
        this.init();
      }
    }

    Map.prototype.init = function () {
      var mapElement, position, mapOptions, map, marker, infowindow, locationTitle;
      mapElement = document.getElementById('event-map');

      if (!mapElement) {
        return;
      }

      position = {
        lat: parseFloat(mapElement.getAttribute('data-lat')),
        lng: parseFloat(mapElement.getAttribute('data-lng'))
      };
      mapOptions = {
        zoom: 15,
        center: position,
        disableDefaultUI: false
      };
      map = new google.maps.Map(mapElement, mapOptions);
      locationTitle = mapElement.getAttribute('data-title') ? mapElement.getAttribute('data-title') : '';
      infowindow = new google.maps.InfoWindow({
        content: '<b>' + locationTitle + '</b>'
      });
      marker = new google.maps.Marker({
        position: position,
        map: map
      });

      if (locationTitle) {
        marker.addListener('click', function () {
          infowindow.open(map, marker);
        });
      }
    };

    return new Map();
  }();
})());

/***/ }),

/***/ "./source/js/front/event-pagination.js":
/*!*********************************************!*\
  !*** ./source/js/front/event-pagination.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((() => {
  // Init
  var EventManagerIntegration = {}; // Init event pagination

  EventManagerIntegration = EventManagerIntegration || {};
  EventManagerIntegration.Event = EventManagerIntegration.Event || {};

  EventManagerIntegration.Event.Module = function ($) {
    function Module() {
      $(function () {
        this.initEventPagination();
      }.bind(this));
    } // Load pagination bar to event modules


    Module.prototype.initEventPagination = function () {
      $(".modularity-mod-event").each(function (key, value) {
        var moduleId = $(this).find('[data-module-id]').attr('data-module-id');
        var pages = $(this).find('.module-pagination').attr('data-pages');
        var showArrows = $(this).find('.module-pagination').attr('data-show-arrows');
        var module = $(this);
        $(this).find('.module-pagination').pagination({
          pages: pages,
          displayedPages: 4,
          edges: 0,
          cssStyle: '',
          ellipsePageSet: false,
          prevText: showArrows ? '&laquo;' : '',
          nextText: showArrows ? '&raquo;' : '',
          currentPage: 1,
          selectOnClick: false,
          onPageClick: function (page, event) {
            Module.prototype.loadEvents(page, moduleId, module);
            $(module).find('.module-pagination').pagination('redraw');
            $(module).find('.pagination a:not(.current)').each(function () {
              $(this).parent().addClass('disabled temporary');
            });
          }
        });
      });
    }; // Get event list with Ajax on pagination click


    Module.prototype.loadEvents = function (page, moduleId, module) {
      var height = $(module).find('.event-module-content').height();
      var windowTop = $(window).scrollTop();
      var moduleTop = $(module).offset().top;
      $.ajax({
        url: eventintegration.ajaxurl,
        type: 'post',
        data: {
          action: 'ajax_pagination',
          page: page,
          id: moduleId
        },
        beforeSend: function () {
          $(module).find('.event-module-list').remove();
          $(module).find('.event-module-content').append('<div class="event-loader"><div class="loading-wrapper"><div class="loading"><div></div><div></div><div></div><div></div></div></div></div>');
          $(module).find('.event-loader').height(height);

          if (moduleTop < windowTop) {
            $('html, body').animate({
              scrollTop: moduleTop
            }, 100);
          }
        },
        success: function (html) {
          $(module).find('.event-module-content').append(html).hide().fadeIn(80).height('auto');
        },
        error: function () {
          $(module).find('.event-module-content').append('<ul class="event-module-list"><li><p>' + eventIntegrationFront.event_pagination_error + '</p></li></ul>').hide().fadeIn(80).height('auto');
        },
        complete: function () {
          $(module).find('.event-loader').remove();
          $(module).find('.pagination .temporary').each(function () {
            $(this).removeClass('disabled temporary');
          });
        }
      });
    };

    return new Module();
  }(jQuery);
})());

/***/ }),

/***/ "./source/js/front/event-widget.js":
/*!*****************************************!*\
  !*** ./source/js/front/event-widget.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((() => {
  //Init event widget
  if (!EventManagerIntegration) {
    var EventManagerIntegration = {};
  }

  EventManagerIntegration.Widget = EventManagerIntegration.Widget || {}; //Component

  EventManagerIntegration.Widget.TemplateParser = function ($) {
    var date = new Date();
    var dd = date.getDate();
    var mm = date.getMonth() + 1;
    var year = date.getFullYear();
    var months = ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
    var template = {};
    var errorTemplate = {};

    function TemplateParser() {
      this.init();
    }

    TemplateParser.prototype.init = function () {
      $(".event-api").each(function (index, module) {
        var dataApiurl = $(module).attr('data-apiurl');
        dataApiurl = dataApiurl.replace(/\/$/, "");
        dataApiurl = dataApiurl + '/event/time?start=' + year + '-' + mm + '-' + dd + '&end=' + (year + 1) + '-' + mm + '-' + dd;
        var dataLimit = $(module).attr('post-limit');
        var dataGroupId = $(module).attr('group-id');
        var dataCategoryId = $(module).attr('category-id');
        var latlng = $(module).attr('latlng');
        var distance = $(module).attr('distance');
        var apiUrl = typeof dataLimit != 'undefined' && $.isNumeric(dataLimit) ? dataApiurl + '&post-limit=' + dataLimit : dataApiurl + '&post-limit=' + 10;
        apiUrl += typeof dataGroupId != 'undefined' && dataGroupId ? '&group-id=' + dataGroupId : '';
        apiUrl += typeof dataCategoryId != 'undefined' && dataCategoryId ? '&category-id=' + dataCategoryId : '';
        apiUrl += typeof latlng != 'undefined' && latlng ? '&latlng=' + latlng : '';
        apiUrl += typeof distance != 'undefined' && distance ? '&distance=' + distance : '';
        apiUrl += '&_jsonp=getevents';
        this.storeErrorTemplate($(module));
        this.storeTemplate($(module));
        this.storeModalTemplate($(module));
        this.loadEvent($(module), apiUrl);
      }.bind(this));
    };

    TemplateParser.prototype.storeTemplate = function (module) {
      module.data('template', $('.template', module).html());
      module.find('.template').remove();
    };

    TemplateParser.prototype.storeErrorTemplate = function (module) {
      module.data('error-template', $('.error-template', module).html());
      module.find('.error-template').remove();
    };

    TemplateParser.prototype.storeModalTemplate = function (module) {
      module.data('modal-template', $('.modal-template', module).html());
      module.find('.modal-template').remove();
    };

    TemplateParser.prototype.loadEvent = function (module, resource) {
      $.ajax({
        type: "GET",
        url: resource,
        cache: false,
        dataType: "jsonp",
        jsonpCallback: 'getevents',
        crossDomain: true,
        success: function (response) {
          //Store response on module
          module.data('json-response', response); //Clear target div

          TemplateParser.prototype.clear(module);
          $(response).each(function (index, event) {
            // Get the correct occasion
            var eventOccasion = "";
            $.each(event.occasions, function (occationindex, occation) {
              if (typeof occation.current_occasion != 'undefined' && occation.current_occasion == true) {
                eventOccasion = occation;
                return false;
              }
            });
            var occasionDate = new Date(eventOccasion.start_date); //Load template data

            var moduleTemplate = module.data('template'); //Replace with values

            moduleTemplate = moduleTemplate.replace('{event-id}', event.id);
            moduleTemplate = moduleTemplate.replace('{event-occasion}', occasionDate.getDate() + '<div class="clearfix"></div>' + months[occasionDate.getMonth()]);
            moduleTemplate = moduleTemplate.replace('{event-title}', '<p class="link-item">' + event.title.rendered + '</p>'); //Append

            module.append(moduleTemplate);
          }); //bind click

          TemplateParser.prototype.click(module);
        },
        error: function (response) {
          TemplateParser.prototype.clear(module);
          module.html(module.data('error-template'));
        }
      });
    };

    TemplateParser.prototype.clear = function (module) {
      jQuery(module).html('');
    };

    TemplateParser.prototype.addZero = function (i) {
      if (i < 10) {
        i = "0" + i;
      }

      return i;
    };

    TemplateParser.prototype.click = function (module) {
      jQuery("li a", module).on('click', {}, function (e) {
        var eventId = jQuery(e.target).closest("a.modal-event").data('event-id');
        $.each(module.data('json-response'), function (index, object) {
          if (object.id == eventId) {
            // Main modal
            var modalTemplate = module.data('modal-template');
            modalTemplate = modalTemplate.replace('{event-modal-title}', object.title.rendered);
            modalTemplate = modalTemplate.replace('{event-modal-content}', object.content.rendered != null ? object.content.rendered : '');
            modalTemplate = modalTemplate.replace('{event-modal-link}', object.event_link != null ? '<p><a href="' + object.event_link + '" target="_blank">' + object.event_link + '</a></p>' : '');
            modalTemplate = modalTemplate.replace('{event-modal-image}', object.featured_media != null ? '<img src=' + object.featured_media.source_url + ' alt="' + object.title.rendered + '" style="display:block; width:100%;">' : ''); // Occations accordion section

            var modalOccationResult = "";
            $.each(object.occasions, function (occationindex, occation) {
              // Format start and end date
              var d = new Date(occation.start_date);
              var start = this.addZero(d.getDate()) + ' ' + months[d.getMonth()] + ' ' + d.getFullYear() + ' kl. ' + this.addZero(d.getHours()) + ':' + this.addZero(d.getMinutes());
              var e = new Date(occation.end_date);
              var end = "";

              if (e.getDate() === d.getDate()) {
                end = 'kl. ' + this.addZero(e.getHours()) + ':' + this.addZero(e.getMinutes());
              } else {
                end = e.getDate() + ' ' + months[e.getMonth()] + ' ' + e.getFullYear() + ' kl. ' + this.addZero(e.getHours()) + ':' + this.addZero(e.getMinutes());
              }

              modalOccationResult = modalOccationResult + '<li class="text-sm gutter-sm gutter-vertical">' + start + ' - ' + end + '</li>';
            }.bind(this));
            modalTemplate = modalTemplate.replace('{event-modal-occations}', '<section class="accordion-section"><input type="radio" name="active-section" id="accordion-section-1"><label class="accordion-toggle" for="accordion-section-1"><h2>Evenemanget inträffar</h2></label><div class="accordion-content"><ul id="modal-occations">' + modalOccationResult + '</ul></div></section>'); // Location accordion section

            var locationData = "";
            locationData += object.location != null && object.location.title != null ? '<li><strong>' + object.location.title + '</strong></li>' : '';
            locationData += object.location != null && object.location.street_address != null ? '<li>' + object.location.street_address + '</li>' : '';
            locationData += object.location != null && object.location.postal_code != null ? '<li>' + object.location.postal_code + '</li>' : '';
            locationData += object.location != null && object.location.city != null ? '<il>' + object.location.city + '</li>' : '';
            var location = locationData ? '<section class="accordion-section"><input type="radio" name="active-section" id="accordion-section-2"><label class="accordion-toggle" for="accordion-section-2"><h2>Plats</h2></label><div class="accordion-content"><ul>' + locationData + '</ul></div></section>' : '';
            modalTemplate = modalTemplate.replace('{event-modal-location}', location); // Boooking accordion section

            var bookingData = "";
            bookingData += object.booking_phone != null ? '<li>Telefon: ' + object.booking_phone + '</li>' : '';
            bookingData += object.price_adult != null ? '<li>Pris: ' + object.price_adult + ' kr</li>' : '';
            bookingData += object.price_children != null ? '<li>Barnpris: ' + object.price_children + ' kr</li>' : '';
            bookingData += object.price_senior != null ? '<li>Pensionärspris: ' + object.price_senior + ' kr</li>' : '';
            bookingData += object.price_student != null ? '<li>Studentpris: ' + object.price_student + ' kr</li>' : '';
            bookingData += object.age_restriction != null ? '<li>Åldersgräns: ' + object.age_restriction + ' kr</li>' : '';
            var membershipCards = "";
            $.each(object.membership_cards, function (cardindex, card) {
              membershipCards = membershipCards + '<li>' + card.post_title + '</li>';
            }.bind(this));
            bookingData += membershipCards ? '<li>&nbsp;</li><li><strong>Ingår i medlemskort</strong></li>' + membershipCards : '';
            bookingData += object.booking_link != null ? '<li>&nbsp;</li><li><a href="' + object.booking_link + '" class="link-item" target="_blank">Boka bljetter här</a></li>' : '';
            var booking = bookingData ? '<section class="accordion-section"><input type="radio" name="active-section" id="accordion-section-3"><label class="accordion-toggle" for="accordion-section-3"><h2>Bokning</h2></label><div class="accordion-content"><ul>' + bookingData + '</ul></div></section>' : '';
            modalTemplate = modalTemplate.replace('{event-modal-booking}', booking);
            $('#modal-event').remove();
            $('body').append(modalTemplate);
          }
        }.bind(this));
      }.bind(this));
    };

    return new TemplateParser();
  }(jQuery);
})());

/***/ }),

/***/ "./source/js/front/form-submit.js":
/*!****************************************!*\
  !*** ./source/js/front/form-submit.js ***!
  \****************************************/
/***/ (() => {

const eventFormSubmit = {
  setupFormSubmit: () => {
    const forms = document.querySelectorAll('.js-event-form');
    forms.forEach(form => {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const submitButton = form.querySelector('.event-submit__submit-button');
        submitButton.disabled = true;
        form.querySelector('.event-submit__success').classList.add('u-display--none');
        form.querySelector('.event-submit__error').classList.add('u-display--none');
        const imageInput = form.querySelector('input[name="image_input"]');
        const formData = eventFormSubmit.formToJsonData(form);
        const imageData = new FormData();
        imageData.append('file', imageInput.files[0]);
        const formRequests = [];
        formRequests.push(eventFormSubmit.submitImageData(imageData));

        if (formData.event_organizer === 'new') {
          const organizerData = {
            title: '',
            phone: '',
            email: ''
          };
          Object.keys(organizerData).forEach(key => {
            const organizerField = form.querySelector(`[name="organizer-${key}"]`);

            if (organizerField) {
              organizerData[key] = organizerField.value;
            }
          });
          formRequests.push(eventFormSubmit.submitFormData(organizerData, 'submit_organizer'));
        } else {
          formData['organizers'] = [{
            organizer: formData['event_existing_organizer'],
            main_organizer: true
          }];
          formRequests.push([]);
        }

        if (formData.event_location === 'new') {
          const locationData = {
            title: '',
            street_address: '',
            city: '',
            postal_code: ''
          };
          Object.keys(locationData).forEach(key => {
            const locationField = form.querySelector(`[name="location-${key.replace('_', '-')}"]`);

            if (locationField) {
              locationData[key] = locationField.value;
            }
          });
          formRequests.push(eventFormSubmit.submitFormData(locationData, 'submit_location'));
        } else {
          formData['location'] = formData['event_existing_location'];
          formRequests.push([]);
        }

        Promise.all(formRequests).then(_ref => {
          let [imageResponse, organizerResponse, locationResponse] = _ref;

          if (imageResponse !== null && imageResponse !== void 0 && imageResponse.success) {
            formData['featured_media'] = imageResponse.data;
          }

          if (organizerResponse !== null && organizerResponse !== void 0 && organizerResponse.success) {
            formData['organizers'] = [{
              organizer: organizerResponse.data.id,
              main_organizer: true
            }];
            formData['contact_phone'] = organizerResponse.data.phone;
            formData['contact_email'] = organizerResponse.data.email;
          }

          if (locationResponse !== null && locationResponse !== void 0 && locationResponse.success) {
            formData['location'] = locationResponse.data.id;
          }

          const errorResponses = [imageResponse, organizerResponse, locationResponse].filter(x => !Array.isArray(x) && !x.success).map(x => x.data);

          if (errorResponses.length > 0) {
            eventFormSubmit.displayErorrNotice(form, errorResponses.join('<br />'));
          } else {
            eventFormSubmit.submitFormData(formData, 'submit_event').then(response => {
              if (response.success) {
                eventFormSubmit.displaySuccessNotice(form, eventIntegrationFront.event_submitted_message);
                form.reset();
              } else {
                eventFormSubmit.displayErorrNotice(form, response.data);
              }
            });
          }
        }).catch(e => {
          eventFormSubmit.displayErorrNotice(form, e.message);
        }).finally(x => {
          submitButton.disabled = false;
        });
      });
    });
  },
  displayErorrNotice: (form, text) => {
    form.querySelector('.event-submit__success').classList.add('u-display--none');
    const errorNotice = form.querySelector('.event-submit__error');
    errorNotice.classList.remove('u-display--none');
    errorNotice.querySelector('[id^="notice__text__"]').innerHTML = text;
  },
  displaySuccessNotice: (form, text) => {
    form.querySelector('.event-submit__error').classList.add('u-display--none');
    const successNotice = form.querySelector('.event-submit__success');
    successNotice.classList.remove('u-display--none');
    successNotice.querySelector('[id^="notice__text__"]').innerHTML = text;
  },
  submitImageData: data => {
    data.append('action', 'submit_image');
    return eventFormSubmit.submitForm(data);
  },
  submitFormData: (data, action) => {
    let formData = new FormData();
    formData = eventFormSubmit.buildFormData(formData, data, 'data');
    formData.append('action', action);
    return eventFormSubmit.submitForm(new URLSearchParams(formData));
  },
  buildFormData: (formData, data, parentKey) => {
    if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
      Object.keys(data).forEach(key => {
        formData = eventFormSubmit.buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
      });
    } else {
      const value = data == null ? '' : data;
      formData.append(parentKey, value);
    }

    return formData;
  },
  submitForm: body => {
    return new Promise((resolve, reject) => {
      var _eventintegration;

      if (!((_eventintegration = eventintegration) !== null && _eventintegration !== void 0 && _eventintegration.ajaxurl)) {
        return reject('[submitImageData] No ajax url defined');
      }

      fetch(eventintegration.ajaxurl, {
        method: 'POST',
        body
      }).then(res => res.json()).then(json => resolve(json)).catch(err => reject(err));
    });
  },
  formToJsonData: form => {
    const formArray = eventFormSubmit.serializeArray(form);
    let formData = {};
    let groups;
    const categories = [];
    const tags = [];
    formArray.forEach(field => {
      switch (field.name) {
        case 'user_groups':
          groups = field.value.split(',').map(value => parseInt(value, 10));
          break;

        case 'event_categories':
          categories.push(parseInt(field.value));
          break;

        case 'event_tags':
          tags.push(parseInt(field.value));
          break;

        default:
          formData[field.name] = field.value;
      }
    });
    formData['occasions'] = [];
    form.querySelectorAll('#event_schema_single_date .sub-fields').forEach(occasionGroup => {
      const startDate = eventFormSubmit.formatDate(occasionGroup.querySelector('[name="start_date"]').value, occasionGroup.querySelector('[name="start_time"]').value);
      const endDate = eventFormSubmit.formatDate(occasionGroup.querySelector('[name="end_date"]').value, occasionGroup.querySelector('[name="end_time"]').value);

      if (startDate && endDate) {
        formData['occasions'].push({
          start_date: startDate,
          end_date: endDate,
          status: 'scheduled',
          content_mode: 'master'
        });
      }
    }); // Recurring occasions

    formData['rcr_rules'] = [];
    {
      const occasionGroup = form.querySelector('#event_schema_recurring_date');
      const startTime = occasionGroup.querySelector('[name="recurring_start_time"]').value;
      const endTime = occasionGroup.querySelector('[name="recurring_end_time"]').value;
      let startDate = occasionGroup.querySelector('[name="recurring_start_date"]').value;
      startDate = eventFormSubmit.isValidDate(startDate) ? startDate : false;
      let endDate = occasionGroup.querySelector('[name="recurring_end_date"]').value;
      endDate = eventFormSubmit.isValidDate(endDate) ? endDate : false;

      if (startTime && endTime && startDate && endDate) {
        formData['rcr_rules'].push({
          rcr_week_day: occasionGroup.querySelector('[name="weekday"]').value,
          rcr_weekly_interval: occasionGroup.querySelector('[name="weekly_interval"]').value,
          rcr_start_time: startTime,
          rcr_end_time: endTime,
          rcr_start_date: startDate,
          rcr_end_date: endDate
        });
      }
    }
    formData['accessibility'] = [];
    form.querySelectorAll("input[name='accessibility']:checked").forEach(input => {
      formData['accessibility'].push(input.value);
    });

    if (groups) {
      formData['user_groups'] = groups;
    }

    formData['event_categories'] = categories;
    formData['event_tags'] = tags;
    return formData;
  },
  serializeArray: form => {
    const formData = new FormData(form);
    const pairs = [];

    for (const [name, value] of formData) {
      pairs.push({
        name,
        value
      });
    }

    return pairs;
  },
  formatDate: (date, time) => {
    let dateTime = '';
    let hh = time.split(':')[0];
    let mm = time.split(':')[1]; //Format from datepicker (dd/mm/yyyy) to wp format (yyyy-mm-dd)

    if (date.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
      let dateExploded = date.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/); // Pads date with 0 eg. 06 for june

      dateExploded[2] = dateExploded[2].padStart(2, '0');
      dateExploded[1] = dateExploded[1].padStart(2, '0'); //YYYY-MM-DD

      date = `${dateExploded[3]}-${dateExploded[2]}-${dateExploded[1]}`;
    }

    if (eventFormSubmit.isValidDate(date) && hh && mm) {
      dateTime = date + ' ' + hh.padStart(2, '0') + ':' + mm.padStart(2, '0') + ':00';
    }

    return dateTime;
  },
  isValidDate: dateString => {
    const regEx = /^\d{4}-\d{2}-\d{2}$/;
    return dateString.match(regEx) != null;
  }
};
document.addEventListener('DOMContentLoaded', function () {
  eventFormSubmit.setupFormSubmit();
});

/***/ }),

/***/ "./source/js/front/form-validate-date.js":
/*!***********************************************!*\
  !*** ./source/js/front/form-validate-date.js ***!
  \***********************************************/
/***/ (() => {

const eventFormDateValidation = {
  setupEventDateValidation: () => {
    const eventSchemaSingleDates = document.querySelectorAll('#event_schema_single_date .sub-fields');
    eventSchemaSingleDates.forEach(subFields => {
      const startDate = subFields.querySelector('input[name="start_date"]');
      const startTime = subFields.querySelector('input[name="start_time"]');
      const endDate = subFields.querySelector('input[name="end_date"]');
      const endTime = subFields.querySelector('input[name="end_time"]');
      [startTime, endTime].forEach(input => input.addEventListener('change', () => {
        if (startDate.value == endDate.value) {
          if (endTime.value <= startTime.value) {
            endTime.parentElement.querySelector('.c-field__error-icon').classList.add('u-display--block');

            if (!endTime.parentElement.parentElement.querySelector('#error-text')) {
              const errorMsg = document.createElement('span');
              errorMsg.id = 'error-text';
              errorMsg.appendChild(document.createTextNode(eventIntegrationFront.event_end_date_invalid));
              errorMsg.classList.add('u-color__text--danger');
              endTime.parentElement.parentElement.appendChild(errorMsg);
            }
          } else {
            var _endTime$parentElemen;

            endTime.parentElement.querySelector('.c-field__error-icon').classList.remove('u-display--block');
            (_endTime$parentElemen = endTime.parentElement.parentElement.querySelector('#error-text')) === null || _endTime$parentElemen === void 0 ? void 0 : _endTime$parentElemen.remove();
          }
        }
      }));
    });
  }
};
document.addEventListener('DOMContentLoaded', function () {
  eventFormDateValidation.setupEventDateValidation();
});

/***/ }),

/***/ "./source/js/front/form-validate.js":
/*!******************************************!*\
  !*** ./source/js/front/form-validate.js ***!
  \******************************************/
/***/ (() => {

const eventFormValidate = {
  setupFormValidate: () => {
    const forms = document.querySelectorAll('.js-event-form');
    forms.forEach(form => {
      const inputs = form.querySelectorAll('input, textarea, select'); // Validate fields on change

      ['keyup', 'change'].forEach(function (e) {
        inputs.forEach(input => {
          input.addEventListener(e, () => eventFormValidate.validateInput(input));
        });
      }); // Validate fields on submit

      const submitButton = form.querySelector('button[type="submit"]');
      submitButton.addEventListener('click', e => {
        if (!form.checkValidity()) {
          inputs.forEach(input => {
            eventFormValidate.validateInput(input);
          });
        }
      });
    });
  },
  validateInput: input => {
    if (input.checkValidity()) {
      eventFormValidate.inputSuccess(input);
    } else {
      eventFormValidate.inputError(input);
    }
  },
  getFieldWrapper: input => {
    var fieldWrapper = input;

    do {
      if (fieldWrapper.parentNode !== document.body) {
        fieldWrapper = fieldWrapper.parentNode;
      } else {
        return input;
      }
    } while (!fieldWrapper.matches('.c-field, .c-option'));

    return fieldWrapper;
  },
  inputSuccess: input => {
    eventFormValidate.getFieldWrapper(input).classList.remove('is-invalid');
  },
  inputError: input => {
    eventFormValidate.getFieldWrapper(input).classList.add('is-invalid');
  }
};
document.addEventListener('DOMContentLoaded', function () {
  eventFormValidate.setupFormValidate();
});

/***/ }),

/***/ "./source/js/front/form.js":
/*!*********************************!*\
  !*** ./source/js/front/form.js ***!
  \*********************************/
/***/ (() => {

const eventForm = {
  setupForms: () => {
    const forms = document.querySelectorAll('.js-event-form');
    forms.forEach(form => {
      const conditionalFields = form.querySelectorAll('[data-condition]');
      conditionalFields.forEach(field => eventForm.setupConditionalFields(form, field));
      const conditionalValueFields = form.querySelectorAll('[data-condition-value]');
      conditionalValueFields.forEach(field => eventForm.setupConditionalValueFields(form, field));
      eventForm.setupRepeaters(form);
      eventForm.setupRemoteSelect(form, eventintegration, eventIntegrationFront ?? {});
    });
  },
  setupConditionalFields: (form, field) => {
    eventForm.setVisiblity(form, field);
    const targetFieldKeys = JSON.parse(field.dataset.condition).map(condition => condition.key);
    targetFieldKeys.forEach(fieldKey => {
      form.querySelectorAll(`input[name="${fieldKey}"]`).forEach(targetField => {
        targetField.addEventListener('change', e => {
          eventForm.setVisiblity(form, field);
        });
      });
    });
  },
  setupConditionalValueFields: (form, field) => {
    const conditionValue = JSON.parse(field.dataset.conditionValue);
    form.querySelectorAll(`input[name="${conditionValue.key}"]`).forEach(targetField => {
      targetField.addEventListener('change', e => {
        const conditionResult = eventForm.checkConditions(form, [conditionValue]);

        if (conditionResult.every(x => x === true)) {
          field.querySelectorAll('input').forEach(x => {
            x.dataset.oldValue = x.value;
            x.value = conditionValue.value;
          });
        } else {
          field.querySelectorAll('input').forEach(x => {
            if ('oldValue' in x.dataset) {
              x.value = x.dataset.oldValue;
            }
          });
        }
      });
    });
  },
  checkConditions: (form, conditions) => {
    const conditionResult = conditions.map(condition => {
      let targetField = form.querySelector(`input[name="${condition.key}"]:checked`);

      if (!targetField) {
        targetField = form.querySelector(`input[name="${condition.key}"]`);
      }

      if (targetField) {
        switch (condition.compare) {
          case '=':
            if (targetField.type === 'checkbox') {
              return targetField.checked == condition.compareValue;
            }

            if (targetField.files !== null) {
              return targetField.files.length == condition.compareValue;
            }

            return targetField.value == condition.compareValue;

          case '!=':
            if (targetField.type === 'checkbox') {
              return targetField.checked != condition.compareValue;
            }

            if (targetField.files !== null) {
              return targetField.files.length != condition.compareValue;
            }

            return targetField.value != condition.compareValue;

          default:
            console.warn(`Compare condition '${condition.compare}' not supported`);
            break;
        }
      } else {
        console.info(`Target field '${condition.key}' not found`);
      }

      return false;
    });
    return conditionResult;
  },
  setVisiblity: (form, field) => {
    const conditions = JSON.parse(field.dataset.condition);
    const conditionResult = eventForm.checkConditions(form, conditions);

    if (conditionResult.every(x => x === true)) {
      field.classList.remove('u-display--none');
      field.querySelectorAll('input, select').forEach(x => {
        x.disabled = false;
      });
    } else {
      field.classList.add('u-display--none');
      field.querySelectorAll('input, select').forEach(x => {
        x.disabled = true;
      });
    }
  },
  setupRepeaters: form => {
    const repeaters = form.querySelectorAll('.js-repeater');
    repeaters.forEach(repeater => {
      const addButton = repeater.querySelector('.btn-repeater-add');
      const removeButton = repeater.querySelector('.btn-repeater-remove');
      addButton.addEventListener('click', e => {
        const subFieldsClone = repeater.querySelector('.sub-fields').cloneNode(true);
        subFieldsClone.querySelectorAll('input').forEach(field => {
          field.value = '';
        });
        repeater.insertBefore(subFieldsClone, addButton);

        if (repeater.querySelectorAll('.sub-fields').length > 1) {
          removeButton.classList.remove('u-display--none');
        }
      });
      removeButton.addEventListener('click', e => {
        const subFields = repeater.querySelectorAll('.sub-fields');

        if (subFields.length > 1) {
          subFields[subFields.length - 1].remove();
        }

        if (subFields.length === 1) {
          removeButton.classList.add('u-display--none');
        }
      });
    });
  },
  setupRemoteSelect: (form, _ref, _ref2) => {
    let {
      apiurl
    } = _ref;
    let {
      select_string
    } = _ref2;

    if (apiurl === undefined) {
      return;
    }

    const apiUrl = apiurl.replace(/\/$/, '');
    const selects = form.querySelectorAll('select[data-source*=type]');
    selects.forEach(select => {
      const dataSource = JSON.parse(select.dataset.source);
      let url = apiUrl + '/' + dataSource.name;

      if (dataSource.type === 'post') {
        url += '/complete';
      } else {
        url += '?per_page=100';
      }

      fetch(url).then(data => data.json()).then(items => eventForm.setupSelectOptions(select_string, select, dataSource, items));
    });
  },
  setupSelectOptions: (select_string, select, dataSource, items) => {
    select.querySelectorAll('option').forEach(option => option.remove());

    if (!select.multiple) {
      const defaultOption = document.createElement('option');
      defaultOption.setAttribute('selected', 'selected');
      defaultOption.innerText = select_string;
      defaultOption.value = '';
      select.appendChild(defaultOption);
    }

    items.sort((a, b) => a.title > b.title).forEach((item, index) => eventForm.createSelectOption(select, dataSource, item, index));

    if (dataSource.hiddenFields !== undefined) {
      select.addEventListener('change', () => {
        const selectedOption = select.querySelector('option[value="' + select.value + '"]');

        if (selectedOption && selectedOption.dataset.hiddenFields) {
          Object.values(dataSource.hiddenFields).forEach(key => {
            const hiddenField = select.parentNode.querySelector(`input[name=${key}]`);
            hiddenField.value = JSON.parse(selectedOption.dataset.hiddenFields)[key];
          });
        }
      });
      Object.values(dataSource.hiddenFields).forEach(key => eventForm.createHiddenField(select, key));
    }
  },
  createSelectOption: (select, dataSource, item, index) => {
    const option = document.createElement('option');
    option.setAttribute('value', item.id);

    if (dataSource.type === 'post') {
      option.innerText = item.title;
    } else {
      option.innerText = item.name;
    }

    if (dataSource.hiddenFields !== undefined) {
      const hiddenFieldsData = {};
      Object.keys(dataSource.hiddenFields).forEach(key => {
        hiddenFieldsData[dataSource.hiddenFields[key]] = item[key];
      });
      option.setAttribute('data-hidden-fields', JSON.stringify(hiddenFieldsData));
    }

    select.appendChild(option);
  },
  createHiddenField: (select, key) => {
    const selectedOption = select.querySelector('option[data-hidden-fields]');

    if (selectedOption) {
      const hiddenField = document.createElement('input');
      hiddenField.name = key;
      hiddenField.type = 'hidden';
      hiddenField.value = JSON.parse(selectedOption.dataset.hiddenFields)[key];
      select.parentNode.insertBefore(hiddenField, select);
    }
  }
};
document.addEventListener('DOMContentLoaded', function () {
  eventForm.setupForms();
});

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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
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
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************************!*\
  !*** ./source/js/front/index.js ***!
  \**********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _event_pagination__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./event-pagination */ "./source/js/front/event-pagination.js");
/* harmony import */ var _event_map__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./event-map */ "./source/js/front/event-map.js");
/* harmony import */ var _event_widget__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./event-widget */ "./source/js/front/event-widget.js");
/* harmony import */ var _form__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./form */ "./source/js/front/form.js");
/* harmony import */ var _form__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_form__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _form_validate__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./form-validate */ "./source/js/front/form-validate.js");
/* harmony import */ var _form_validate__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_form_validate__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _form_submit__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./form-submit */ "./source/js/front/form-submit.js");
/* harmony import */ var _form_submit__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_form_submit__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _form_validate_date__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./form-validate-date */ "./source/js/front/form-validate-date.js");
/* harmony import */ var _form_validate_date__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_form_validate_date__WEBPACK_IMPORTED_MODULE_6__);







})();

/******/ })()
;
//# sourceMappingURL=event-integration-front.js.map