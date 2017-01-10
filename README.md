# Event Manager Integration

Integrate and display events from Event Manager API.

## JavaScript widget
Below is a code example to display a list of events. Replace attribute value ```data-apiurl``` with url to the event API and ```data-limit``` with desired number of events.

### Event List code example

```html
<div class="box box-panel box-primary">
<h4 class="box-title">Evenemang</h4>
    <ul class="event-api" data-apiurl="http://api.helsingborg.se/json/wp/v2/event" data-limit="10">
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
