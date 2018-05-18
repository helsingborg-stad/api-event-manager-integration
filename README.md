Event Manager Integration
==========

Import and display events from [Event Manager API](https://github.com/helsingborg-stad/api-event-manager).

Shortcodes
----------------

#### event_submit_form

> Displays a form to post events directly to Event Manager API.<br>
It requires that the client is authorized to submit events.

*Parameters:*
```
user_groups     Comma separated string with group IDs. Sets default user groups for all submited events.
```

*Example:*
```php
[event_submit_form user_groups="1337"]
```

#### single_event_accordion

> Shortcode to display event information as accordion.<br>
Add the shortcode to your single event template file.

*Example:*
```php
[single_event_accordion]
```

#### single_event_information

> Shortcode to display event information as list element.<br>
Add the shortcode to your single event template file.

*Example:*
```php
[single_event_information]
```

#### gallery

> Gallery images is stored as attached images.<br>
Therefore you can use WordPress built in shortcode to display the images.<br>
Add the shortcode to your single event template file.

*Example:*
```php
[gallery]
```

JavaScript widgets
----------------

#### Event List code example

> Here is a code example to display a list of events.<br>
Use the attributes listed below to set API-url and different filters.

*Data attributes:*
```
data-apiurl     Url to Event manager API root.
post-limit      Desired number of events to show.
group-id        Add one or many(separated with comma) group ID to get events from specific groups.
category-id     Add one or many(separated with comma) category ID to get events from specific categories.
latlng          Enter latitude and longotide(separated with comma) to get events occurring at a certain location.
distance        Used with `latlng` attribute to get events within a given radius. Enter value in kilometers.
```

*Example:*
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
