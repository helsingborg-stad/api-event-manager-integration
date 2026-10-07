export default (() => {
    const namespace = window.EventManagerIntegration = window.EventManagerIntegration || {};
    namespace.Widget = namespace.Widget || {};
    const months = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];

    class TemplateParser {
        constructor() { this.init(); }

        init() {
            document.querySelectorAll('.event-api').forEach((module) => {
                const date = new Date();
                const apiBaseUrl = module.getAttribute('data-apiurl')?.replace(/\/$/, '');
                if (!apiBaseUrl) return;

                const url = new URL(`${apiBaseUrl}/event/time`);
                url.searchParams.set('start', `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);
                url.searchParams.set('end', `${date.getFullYear() + 1}-${date.getMonth() + 1}-${date.getDate()}`);
                url.searchParams.set('post-limit', this.isNumeric(module.getAttribute('post-limit')) ? module.getAttribute('post-limit') : '10');
                ['group-id', 'category-id', 'latlng', 'distance'].forEach((attribute) => {
                    const value = module.getAttribute(attribute);
                    if (value) url.searchParams.set(attribute, value);
                });
                this.storeTemplates(module);
                this.loadEvents(module, url);
            });
        }

        storeTemplates(module) {
            ['template', 'error-template', 'modal-template'].forEach((className) => {
                const template = module.querySelector(`.${className}`);
                module.dataset[this.datasetKey(className)] = template?.innerHTML || '';
                template?.remove();
            });
        }

        async loadEvents(module, url) {
            try {
                const response = await this.getJsonp(url);
                module._eventResponse = response;
                module.replaceChildren();
                response.forEach((event) => module.insertAdjacentHTML('beforeend', this.renderEvent(module, event)));
                this.bindEventLinks(module);
            } catch (error) {
                module.innerHTML = module.dataset.errorTemplate || '';
            }
        }

        getJsonp(url) {
            return new Promise((resolve, reject) => {
                const callback = `eventIntegration${Date.now()}${Math.floor(Math.random() * 1000)}`;
                const script = document.createElement('script');
                let timeout;
                const cleanup = (error) => {
                    window.clearTimeout(timeout);
                    delete window[callback];
                    script.remove();
                    if (error) reject(error);
                };
                timeout = window.setTimeout(() => cleanup(new Error('The event API request timed out.')), 10000);
                url.searchParams.set('_jsonp', callback);
                window[callback] = (response) => { cleanup(); resolve(response); };
                script.src = url.toString();
                script.onerror = () => cleanup(new Error('The event API request failed.'));
                document.head.appendChild(script);
            });
        }

        renderEvent(module, event) {
            const occasion = event.occasions.find((item) => item.current_occasion) || {};
            const date = new Date(occasion.start_date);
            return (module.dataset.template || '')
                .replace('{event-id}', event.id)
                .replace('{event-occasion}', `${date.getDate()}<div class="clearfix"></div>${months[date.getMonth()]}`)
                .replace('{event-title}', `<p class="link-item">${event.title.rendered}</p>`);
        }

        bindEventLinks(module) {
            module.querySelectorAll('li a').forEach((link) => link.addEventListener('click', (event) => {
                const eventId = event.target.closest('a.modal-event')?.dataset.eventId;
                const selectedEvent = module._eventResponse?.find((item) => String(item.id) === eventId);
                if (selectedEvent) this.renderModal(selectedEvent, module.dataset.modalTemplate || '');
            }));
        }

        renderModal(event, template) {
            const occasions = event.occasions.map((occasion) => {
                const start = new Date(occasion.start_date);
                const end = new Date(occasion.end_date);
                const startDate = `${this.addZero(start.getDate())} ${months[start.getMonth()]} ${start.getFullYear()} kl. ${this.addZero(start.getHours())}:${this.addZero(start.getMinutes())}`;
                const endDate = start.getDate() === end.getDate() ? `kl. ${this.addZero(end.getHours())}:${this.addZero(end.getMinutes())}` : `${end.getDate()} ${months[end.getMonth()]} ${end.getFullYear()} kl. ${this.addZero(end.getHours())}:${this.addZero(end.getMinutes())}`;
                return `<li class="text-sm gutter-sm gutter-vertical">${startDate} - ${endDate}</li>`;
            }).join('');
            const locationData = [event.location?.title && `<li><strong>${event.location.title}</strong></li>`, event.location?.street_address && `<li>${event.location.street_address}</li>`, event.location?.postal_code && `<li>${event.location.postal_code}</li>`, event.location?.city && `<li>${event.location.city}</li>`].filter(Boolean).join('');
            const bookingData = [event.booking_phone && `<li>Telefon: ${event.booking_phone}</li>`, event.price_adult && `<li>Pris: ${event.price_adult} kr</li>`, event.price_children && `<li>Barnpris: ${event.price_children} kr</li>`, event.price_senior && `<li>Pensionärspris: ${event.price_senior} kr</li>`, event.price_student && `<li>Studentpris: ${event.price_student} kr</li>`, event.age_restriction && `<li>Åldersgräns: ${event.age_restriction} kr</li>`].filter(Boolean).join('');
            const membershipCards = (event.membership_cards || []).map((card) => `<li>${card.post_title}</li>`).join('');
            const booking = `${bookingData}${membershipCards ? `<li>&nbsp;</li><li><strong>Ingår i medlemskort</strong></li>${membershipCards}` : ''}${event.booking_link ? `<li>&nbsp;</li><li><a href="${event.booking_link}" class="link-item" target="_blank">Boka bljetter här</a></li>` : ''}`;
            template = template
                .replace('{event-modal-title}', event.title.rendered)
                .replace('{event-modal-content}', event.content.rendered || '')
                .replace('{event-modal-link}', event.event_link ? `<p><a href="${event.event_link}" target="_blank">${event.event_link}</a></p>` : '')
                .replace('{event-modal-image}', event.featured_media ? `<img src="${event.featured_media.source_url}" alt="${event.title.rendered}" style="display:block; width:100%;">` : '')
                .replace('{event-modal-occations}', `<section class="accordion-section"><input type="radio" name="active-section" id="accordion-section-1"><label class="accordion-toggle" for="accordion-section-1"><h2>Evenemanget inträffar</h2></label><div class="accordion-content"><ul id="modal-occations">${occasions}</ul></div></section>`)
                .replace('{event-modal-location}', locationData ? `<section class="accordion-section"><input type="radio" name="active-section" id="accordion-section-2"><label class="accordion-toggle" for="accordion-section-2"><h2>Plats</h2></label><div class="accordion-content"><ul>${locationData}</ul></div></section>` : '')
                .replace('{event-modal-booking}', booking ? `<section class="accordion-section"><input type="radio" name="active-section" id="accordion-section-3"><label class="accordion-toggle" for="accordion-section-3"><h2>Bokning</h2></label><div class="accordion-content"><ul>${booking}</ul></div></section>` : '');
            document.getElementById('modal-event')?.remove();
            document.body.insertAdjacentHTML('beforeend', template);
        }

        datasetKey(className) { return className.replace(/-([a-z])/g, (_, character) => character.toUpperCase()); }
        isNumeric(value) { return value !== null && value.trim() !== '' && Number.isFinite(Number(value)); }
        addZero(value) { return value < 10 ? `0${value}` : value; }
    }

    namespace.Widget.TemplateParser = new TemplateParser();
})();
