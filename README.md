# Event Manager Integration

Integrate and display events from Event Manager API.

## JavaScript widget
Here is a code example to display a list of events. Use the attributes listed below to set API-url and filters. 
`data-apiurl` = Url to the event API.
`post-limit` = Desired number of events to show.
`group-id` = Add one or many(separated with comma) group ID to get events from specific groups.
`category-id` = Add one or many(separated with comma) category ID to get events from specific categories.

### Event List code example

```html
<div class="box box-panel box-primary">
<h4 class="box-title">Evenemang</h4>
    <<ul class="event-api" data-apiurl="http://api.helsingborg.se/json/wp/v2/event" post-limit="10" group-id="1" category-id="2,3">
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
