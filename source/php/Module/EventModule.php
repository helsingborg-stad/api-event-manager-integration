<?php

namespace EventManagerIntegration\Module;

class EventModule extends \Modularity\Module
{
    /**
     * Module args
     * @var array
     */
    public $args = array(
        'id' => 'event',
        'nameSingular' => 'Event',
        'namePlural' => 'Events',
        'description' => 'Outputs a list if upcoming events',
        'supports' => array('editor'),
        'icon' => 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE2LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgd2lkdGg9IjQxOC40NzNweCIgaGVpZ2h0PSI0MTguNDczcHgiIHZpZXdCb3g9IjAgMCA0MTguNDczIDQxOC40NzMiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQxOC40NzMgNDE4LjQ3MzsiDQoJIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPHBhdGggZD0iTTM1MS43NTksMTY4LjYxMmMzNy4zMTIsMTAuNzY4LDc0LjYzNi0zOC4wMyw1NS4yNTItMTA2LjIxMUMzODcuNjM4LTUuNzcsMzE2LjU4OCwzLjU1NCwzMDQuMzk2LDEyLjE3DQoJCWMwLDAtNzAuMzIyLTI5LjQyNC0xMTEuNTg0LDMuMjMyYzAsMC00OS41MTUtNDguNDM1LTEwNy42NDUsNTkuMjAxYzAsMC0yMC40NTQsMTA3LjY0NSw2NC41ODUsODkuMzQyDQoJCWM0OS41MTUtMTguMzAyLTE3LjIyMi03MS4wMzksMTIuOTE5LTEwOS43OTZjMCwwLDguNjE2LDU0Ljg5OCwzMC4xNDEsNzMuMmMwLDAtMzAuMTQxLDM0LjQ0NCw5LjY4Nyw1Ny4wNTENCgkJYzAsMC0xNS4wNzEsNTQuODk4LTc2LjQyNCw4NS4wMzlzLTM5LjgzNyw4OC4yNzEtNDMuMDYsOTcuOTU4YzAsMC03OC41NzUsMzUuNTI1LTc1LjM0My00NS4yMTFjMCwwLTIwLjQ1NCwxMDUuNDkzLDg5LjM0Miw4NS4wMzkNCgkJYzAsMC0yLjU4Miw5LjY4Nyw3LjMxNSwxMC43NjhjOS45MDcsMS4wOCwxMjguMzEsMCwxMjguMzEsMHMzNy42NzctNS4zODQsMC00MS45NzljMCwwLDE5LjkxOS0xNS4wNywxOS4zNzQtMjMuNjg3bDAuMDEsNjIuNDM0DQoJCWMwLDAsNDYuMjcyLDQuODQ5LDU0LjM0My0wLjUzNWM4LjA3MS01LjM4NCw4LjYxNi0yMS41MjUtOS42ODctMjUuODM4Yy0xOC4zMDMtNC4zMTMsMTcuNDMzLTE3My4xMzktNy42ODgtMTk4LjI2DQoJCWMwLDAsMzEuOS0yMC4wODEsMTcuNTQ4LTU3LjM5NWMwLDAsMzAuMTQxLTM1Ljg3OCwyMC44MDgtODkuNzA1QzM2MS4wOTIsODYuODA1LDMwNS4xMjQsMTQ1LjY1MiwzNTEuNzU5LDE2OC42MTJ6Ii8+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8L3N2Zz4NCg=='
    );

    public function __construct()
    {
        // This will register the module
        $this->register(
            $this->args['id'],
            $this->args['nameSingular'],
            $this->args['namePlural'],
            $this->args['description'],
            $this->args['supports'],
            $this->args['icon']
        );

        // Add our template folder as search path for templates
        add_filter('Modularity/Module/TemplatePath', function ($paths) {
            $paths[] = EVENTMANAGERINTEGRATION_PATH . 'source/php/Templates/';
            return $paths;
        });
    }

    /**
     * Get included Events
     * @param  object $module Module object
     * @return array          Array with event objects
     */
    public static function getEvents($module)
    {
        $fields = json_decode(json_encode(get_fields($module->ID)));
        $display_limit = $fields->mod_event_limit;
        $days_ahead = $fields->mod_event_interval;

        $start_date = date('Y-m-d H:i:s', strtotime("today midnight"));
        $end_date = date('Y-m-d H:i:s', strtotime("tomorrow midnight +$days_ahead days") - 1);

        $events = \EventManagerIntegration\Helper\QueryEvents::getEventsOccasions($start_date, $end_date, $display_limit);

        return $events;
    }

    /**
     * Helper to format date and time
     * @param  object $module Module object
     * @param  string $date   Date and time string
     * @return string         Formatted date
     */
    public static function formatDate($module, $date)
    {
        $fields = json_decode(json_encode(get_fields($module->ID)));

        $dateTime = new \DateTime($date);

        switch ($fields->mod_event_date_format) {
            // Date & time
            case 1:
                $date = $dateTime->format('Y-m-d H:i');
                break;
            // Date only
            case 2:
                $date = $dateTime->format('Y-m-d');
                break;
            // Time only
            case 3:
                $date = $dateTime->format('H:i');
                break;

            default:
                $date = $date;
                break;
        }

        return $date;
    }
}
