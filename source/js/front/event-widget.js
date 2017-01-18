"use strict";

//Init event widget
EventManagerIntegration = EventManagerIntegration || {};
EventManagerIntegration.Widget = EventManagerIntegration.Widget || {};

//Component
EventManagerIntegration.Widget.TemplateParser = (function ($) {
    var date                = new Date();
    var dd                  = date.getDate();
    var mm                  = date.getMonth()+1;
    var year                = date.getFullYear();
    var months              = ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];

    var template            = {};
    var errorTemplate       = {};

    function TemplateParser() {
        this.init();
    }

    TemplateParser.prototype.init = function () {
        $(".event-api").each(function(index,module){
            var dataApiurl          = ($(module).attr('data-apiurl'));
                dataApiurl          = dataApiurl.replace(/\/$/, "");
                dataApiurl          = dataApiurl + '/time?start=' + year + '-' + mm + '-' + dd + '&end=' + (year+1) + '-' + mm + '-' + dd;
            var dataLimit           = ($(module).attr('data-limit'));
            var dataGroupId         = ($(module).attr('group-id'));
            var dataCategoryId      = ($(module).attr('category-id'));
            var apiUrl = (typeof dataLimit != 'undefined' && $.isNumeric(dataLimit)) ? dataApiurl + '&post-limit=' + dataLimit : dataApiurl + '&post-limit=' + 10;
                apiUrl = (typeof dataGroupId != 'undefined') ? apiUrl + '&group-id=' + dataGroupId : apiUrl;
                apiUrl = (typeof dataCategoryId != 'undefined') ? apiUrl + '&category-id=' + dataCategoryId : apiUrl;
            this.storeErrorTemplate($(module));
            this.storeTemplate($(module));
            this.storeModalTemplate($(module));
            this.loadEvent($(module),apiUrl);
        }.bind(this));
    };

    TemplateParser.prototype.storeTemplate = function (module) {
        module.data('template',$('.template',module).html());
        module.find('.template').remove();
    };

    TemplateParser.prototype.storeErrorTemplate = function (module) {
        module.data('error-template',$('.error-template',module).html());
        module.find('.error-template').remove();
    };

    TemplateParser.prototype.storeModalTemplate = function (module) {
        module.data('modal-template',$('.modal-template',module).html());
        module.find('.modal-template').remove();
    };

    TemplateParser.prototype.loadEvent = function(module, resource) {

        $.ajax(resource).done(function(response) {

            if(typeof response.data == 'undefined') {

                //Store response on module
                module.data('json-response', response);

                //Clear target div
                this.clear(module);

                $(response).each(function(index,event){

                    // Get the correct occasion
                    var eventOccasion = "";
                    $.each(event.occasions, function(occationindex,occation) {
                        if (typeof occation.current_occasion != 'undefined' && occation.current_occasion == true) {
                            eventOccasion = occation;
                            return false;
                        }
                    });

                    var occasionDate    = new Date(eventOccasion.start_date);

                    //Load template data
                    var moduleTemplate  = module.data('template');

                    //Replace with values
                    moduleTemplate      = moduleTemplate.replace('{event-id}', event.id);
                    moduleTemplate      = moduleTemplate.replace('{event-occasion}', occasionDate.getDate() + '<div class="clearfix"></div>' + months[occasionDate.getMonth()]);
                    moduleTemplate      = moduleTemplate.replace('{event-title}', '<p class="link-item">' + event.title.rendered + '</p>');

                    //Append
                    module.append(moduleTemplate);
                });

                //bind click
                this.click(module);

            } else {
                this.clear(module);
                module.html(module.data('error-template'));
            }

        }.bind(this)).fail(function() {

            this.clear(module);
            module.html(module.data('error-template'));

        }.bind(this));
    };

    TemplateParser.prototype.clear = function(module){
        jQuery(module).html('');
    };

    TemplateParser.prototype.addZero = function (i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    };

    TemplateParser.prototype.click = function(module){

        jQuery("li a",module).on('click',{},function(e){

            var eventId = jQuery(e.target).closest("a.modal-event").data('event-id');

            $.each(module.data('json-response'), function(index,object) {

                if(object.id == eventId) {

                    // Main modal
                    var modalTemplate = module.data('modal-template');
                        modalTemplate = modalTemplate.replace('{event-modal-title}', object.title.rendered);
                        modalTemplate = modalTemplate.replace('{event-modal-content}', (object.content.rendered != null) ? object.content.rendered : '');
                        modalTemplate = modalTemplate.replace('{event-modal-link}', (object.event_link != null) ? '<p><a href="' + object.event_link + '" target="_blank">' + object.event_link + '</a></p>' : '');
                        modalTemplate = modalTemplate.replace('{event-modal-image}', (object.featured_media != null) ? '<img src=' + object.featured_media.source_url + ' alt="' + object.title.rendered + '" style="display:block; width:100%;">' : '');
                        // Occations accordion section
                        var modalOccationResult = "";
                        $.each(object.occasions, function(occationindex,occation) {
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
                        modalTemplate = modalTemplate.replace('{event-modal-occations}','<section class="accordion-section"><input type="radio" name="active-section" id="accordion-section-1"><label class="accordion-toggle" for="accordion-section-1"><h2>Evenemanget inträffar</h2></label><div class="accordion-content"><ul id="modal-occations">' + modalOccationResult + '</ul></div></section>');
                        // Location accordion section
                        var locationData = "";
                            locationData += (object.location != null && object.location.title != null) ? '<li><strong>' + object.location.title + '</strong></li>' : '';
                            locationData += (object.location != null && object.location.street_address != null) ? '<li>' + object.location.street_address + '</li>' : '';
                            locationData += (object.location != null && object.location.postal_code != null) ? '<li>' + object.location.postal_code + '</li>' : '';
                            locationData += (object.location != null && object.location.city != null) ? '<il>' + object.location.city + '</li>' : '';
                        var location = (locationData) ? '<section class="accordion-section"><input type="radio" name="active-section" id="accordion-section-2"><label class="accordion-toggle" for="accordion-section-2"><h2>Plats</h2></label><div class="accordion-content"><ul>' + locationData + '</ul></div></section>' : '';
                        modalTemplate = modalTemplate.replace('{event-modal-location}', location);
                        // Boooking accordion section
                        var bookingData = "";
                            bookingData += (object.booking_phone != null) ? '<li>Telefon: ' + object.booking_phone + '</li>' : '';
                            bookingData += (object.price_adult != null) ? '<li>Pris: ' + object.price_adult + ' kr</li>' : '';
                            bookingData += (object.price_children != null) ? '<li>Barnpris: ' + object.price_children + ' kr</li>' : '';
                            bookingData += (object.price_senior != null) ? '<li>Pensionärspris: ' + object.price_senior + ' kr</li>' : '';
                            bookingData += (object.price_student != null) ? '<li>Studentpris: ' + object.price_student + ' kr</li>' : '';
                            bookingData += (object.age_restriction != null) ? '<li>Åldersgräns: ' + object.age_restriction + ' kr</li>' : '';
                        var membershipCards = "";
                        $.each(object.membership_cards, function(cardindex,card) {
                            membershipCards = membershipCards + '<li>' + card.post_title + '</li>';
                        }.bind(this));
                            bookingData += (membershipCards) ? '<li>&nbsp;</li><li><strong>Ingår i medlemskort</strong></li>' + membershipCards : '';
                            bookingData += (object.booking_link != null) ? '<li>&nbsp;</li><li><a href="' + object.booking_link + '" class="link-item" target="_blank">Boka bljetter här</a></li>' : '';
                        var booking = (bookingData) ? '<section class="accordion-section"><input type="radio" name="active-section" id="accordion-section-3"><label class="accordion-toggle" for="accordion-section-3"><h2>Bokning</h2></label><div class="accordion-content"><ul>' + bookingData + '</ul></div></section>' : '';
                        modalTemplate = modalTemplate.replace('{event-modal-booking}', booking);

                    $('#modal-event').remove();
                    $('body').append(modalTemplate);
                }

            }.bind(this));

        }.bind(this));

    };

    return new TemplateParser();

})(jQuery);
