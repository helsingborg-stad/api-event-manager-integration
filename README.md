# Event Manager Integration

Import and display events from Event Manager API.

## JavaScript widgets

### Event List code example
Here is a code example to display a list of events. Use the attributes listed below to set API-url and filters.<br>
`data-apiurl` = Url to Event manager API root.<br>
`post-limit` = Desired number of events to show.<br>
`group-id` = Add one or many(separated with comma) group ID to get events from specific groups.<br>
`category-id` = Add one or many(separated with comma) category ID to get events from specific categories.<br>
`latlng` = Enter latitude and longotide(separated with comma) to get events occurring at a certain location.<br>
`distance` = Used with `latlng` attribute to get events within a given radius. Enter value in kilometers.

```html
<div class="box box-panel box-primary">
<h4 class="box-title">Evenemang</h4>
    <ul class="event-api" data-apiurl="http://api.helsingborg.se/event/json/wp/v2" post-limit="10" group-id="" category-id="" latlng="56.0464674,12.694512099999997" distance="1">

        <li class="event-loading-template"><i class="loading-dots" style="margin: 10px auto;"></i></li>
        <div class="template hidden">
            <li>
                <div class="grid">
                    <div class="grid-xs-1 text-center text-sm">
                        {event-occasion}
                    </div>
                    <div class="grid-xs-11">
                        <a class="modal-event" data-event-id="{event-id}" href="#modal-event">{event-title}</a>
                    </div>
                </div>
            </li>
        </div>
        <div class="modal-template hidden">
            <div id="modal-event" class="modal modal-backdrop-1 modal-medium" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-content">
                    <div class="modal-body">
                        <div class="grid">
                            <div class="grid-md-4">
                                <div class="gutter gutter-vertical gutter-margin">
                                    {event-modal-image}
                                </div>
                                <div class="accordion accordion-icon accordion-list gutter gutter-vertical gutter-margin">
                                    {event-modal-occations}
                                    {event-modal-location}
                                    {event-modal-booking}
                                </div>
                            </div>
                            <div class="grid-md-8">
                                <article>
                                    <h2 class="modal-title">{event-modal-title}</h2>
                                    {event-modal-content}
                                    {event-modal-link}
                                </article>
                            </div>
                        </div>
                    </div>
                    </div><!-- /.modal-content -->
                <a href="#close" class="backdrop"></a>
            </div><!-- /.modal -->
        </div>
        <div class="error-template hidden">
            <li class="notice warning">
                <i class="fa fa-warning"></i> Whoopsie! We could not load the event's for today. Please try again later.
            </li>
        </div>
    </ul>
</div>
```

### External event submit form code example

```html
<div class="box box-panel box-primary">
<h4 class="box-title">Registrera evenemang</h4>
    <div class="gutter">
        <form name="submit-event" class="submit-event" enctype="multipart/form-data">
            <div class="form-group">
                <label for="title">Namn på evenemang</label>
                <input type="text" name="title" id="title" placeholder="Namn" required>
            </div>

            <div class="form-group">
                <label for="content">Beskrivning</label>
                <small class="text-dark-gray">Information om evenemanget.</small>
                <textarea name="content" id="content textarea" placeholder="Beskrivning" required></textarea>
            </div>

            <div class="form-group">
                <label for="radio">Evenemanget inträffar</label>
                <small class="text-dark-gray">Lägg till tidpunkter för evenemanget. Återkommer evenemanget varje vecka? Lägg då till en regel för återkommande evenemang.</small>
                <label class="radio">
                    <input data-id="single-event" type="radio" name="radio" checked> Enstaka händelse
                </label>
                <label class="radio">
                    <input data-id="recurring-event" type="radio" name="radio"> Återkommande
                </label>
            </div>

            <div id="single-event" class="event-occasion form-group">
                <div class="box box-panel box-panel-secondary">
                    <h4 class="box-title">Datum</h4>
                    <div class="box-content">
                        <div class="form-group">
                            <label for="start_date">Startdatum</label>
                            <input type="text" name="start_date" id="start_date" placeholder="Datum" value="" class="datepicker">
                        </div>
                        <div class="form-group form-horizontal">
                            <label for="start_time_h">Starttid</label>
                            <div class="form-group">
                                <input type="number" name="start_time_h" id="start_time_h" placeholder="HH" value="" min="0" max="24">
                            </div>
                            <div class="form-group">
                                <i>: </i><input type="number" name="start_time_m" id="start_time_m" placeholder="MM" value="" min="0" max="60">
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="end_date">Slutdatum</label>
                            <input type="text" name="end_date" id="end_date" placeholder="Datum" value="" class="datepicker">
                        </div>
                        <div class="form-group form-horizontal">
                            <label for="end_time_h">Sluttid</label>
                            <div class="form-group">
                                <input type="number" name="end_time_h" id="end_time_h" placeholder="HH" value="" min="0" max="24">
                            </div>
                            <div class="form-group">
                                <i>: </i><input type="number" name="end_time_m" id="end_time_m" placeholder="MM" value="" min="0" max="60">
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="recurring-event" class="event-occasion form-group">
                <div class="box box-panel box-panel-secondary">
                    <h4 class="box-title">Regel för återkommande evenemang</h4>
                    <div class="box-content">
                        <div class="form-group">
                            <label for="weekday">Veckodag</label>
                            <small>Evenemanget inträffar på vald veckodag.</small>
                            <select name="weekday" id="weekday">
                                <option value="Monday">Måndag</option>
                                <option value="Tuesday">Tisdag</option>
                                <option value="Wednesday">Onsdag</option>
                                <option value="Thursday">Torsdag</option>
                                <option value="Friday">Fredag</option>
                                <option value="Saturday">Lördag</option>
                                <option value="Sunday">Söndag</option>
                            </select>
                        </div>

                        <div class="form-group form-horizontal">
                            <label for="recurring_start_h">Starttid</label>
                            <small>Evenemangets starttid</small>
                            <div class="form-group">
                                <input type="number" name="recurring_start_h" id="recurring_start_h" placeholder="HH" value="" min="0" max="24">
                            </div>
                            <div class="form-group">
                                <i>: </i><input type="number" name="recurring_start_m" id="recurring_start_m" placeholder="MM" value="" min="0" max="60">
                            </div>
                        </div>
                        <div class="form-group form-horizontal">
                            <label for="recurring_end_h">Sluttid</label>
                            <small>Evenemangets sluttid</small>
                            <div class="form-group">
                                <input type="number" name="recurring_end_h" id="recurring_end_h" placeholder="HH" value="" min="0" max="24">
                            </div>
                            <div class="form-group">
                                <i>: </i><input type="number" name="recurring_end_m" id="recurring_end_m" placeholder="MM" value="" min="0" max="60">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="recurring_start_d">Startdatum </label>
                            <small>Evenemanget inträffar löpande fr.o.m. detta datum</small>
                            <input type="text" name="recurring_start_d" id="recurring_start_d" placeholder="Startdatum" value="" class="datepicker">
                        </div>
                        <div class="form-group">
                            <label for="recurring_end_d">Slutdatum</label>
                            <small>Evenemanget inträffar löpande t.o.m. detta datum</small>
                            <input type="text" name="recurring_end_d" id="recurring_end_d" placeholder="Startdatum" value="" class="datepicker">
                        </div>
                    </div>
                </div>
            </div>

           <div class="form-group">
                <label for="event_link">Webbplats</label>
                <small class="text-dark-gray">Länk till evenemangets webbplats.</small>
                <input type="url" name="event_link" id="event_link" placeholder="Webbplats">
            </div>

           <div class="form-group">
                <label for="booking_link">Länk till bokning</label>
                <small class="text-dark-gray">Länk till evenemangets bokningssida.</small>
                <input type="url" name="booking_link" id="booking_link" placeholder="Länk till bokning">
            </div>

           <div class="form-group">
                <label for="price_adult">Pris</label>
                <input type="number" name="price_adult" id="price_adult" placeholder="Pris">
            </div>

            <div class="form-group">
                <label for="organizer">Arrangör</label>
                <small class="text-dark-gray">Företaget, organisationen eller privatpersonen som står bakom evenemanget.</small>
                <select name="organizer" id="organizer">
                    <option value="">Hämtar...</option>
                </select>
            </div>

            <div class="form-group">
                <label for="location">Plats</label>
                <small class="text-dark-gray">Plats eller adress för evenemanget.</small>
                <select name="location" id="location">
                    <option value="">Hämtar...</option>
                </select>
            </div>

            <div class="form-group">
                <label for="event_categories">Kategorier</label>
                <small class="text-dark-gray">Välj kategorier som evenemanget tillhör.</small>
                <select name="event_categories" id="event_categories" multiple>
                    <option value="">Hämtar...</option>
                </select>
            </div>

            <div class="form-group">
                <label for="user_groups">Användarorganisation</label>
                <select name="user_groups" id="user_groups" multiple>
                    <option value="">Hämtar...</option>
                </select>
            </div>

            <div class="form-group">
                <label for="image-input">Bild</label>
                <input name="image-input" id="image-input" type="file" accept="image/gif, image/jpeg, image/png">
            </div>

            <div class="form-group submit-error hidden">
                <li class="notice warning"></li>
            </div>
            <div class="form-group submit-success hidden">
                <li class="notice success"></li>
            </div>

            <div class="form-group">
                <input type="submit" class="btn btn-primary" value="Skicka">
            </div>
        </form>
    </div>
</div>


```
