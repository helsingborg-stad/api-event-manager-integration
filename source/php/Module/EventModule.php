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
        'icon' => 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE2LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgd2lkdGg9Ijk4NS4zMzNweCIgaGVpZ2h0PSI5ODUuMzM0cHgiIHZpZXdCb3g9IjAgMCA5ODUuMzMzIDk4NS4zMzQiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDk4NS4zMzMgOTg1LjMzNDsiDQoJIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPHBhdGggZD0iTTg2OC41NjUsNDkyLjhjLTQuNCwyMi4xMDEtMjQsMzguMi00Ny41LDM5LjJjLTcuNCwwLjMtMTMuNyw1LjctMTUuMTAxLDEzYy0xLjUsNy4zLDIuMiwxNC43LDguOSwxNy44DQoJCWMyMS4zLDEwLDMzLjIsMzIuNCwyOC43LDU0LjVsLTQuMiwyMWMtNS41LDI3LjctMzYuMTAxLDQ1LTYyLjksMzguNGMtNy41LTEuOC0xNS4yLTMuMi0yMi44LTQuN2MtMTEuMi0yLjItMjIuNC00LjUtMzMuNi02LjcNCgkJYy0xNC44MDEtMy0yOS42MDEtNS44OTktNDQuNC04Ljg5OWMtMTcuNi0zLjUtMzUuMy03LjEwMS01Mi45LTEwLjYwMWMtMTkuNjk5LTQtMzkuMzk5LTcuODk5LTU5LjEtMTEuODk5DQoJCWMtMjEtNC4yLTQyLjEtOC40LTYzLjEtMTIuN2MtMjEuNjAxLTQuMy00My4yLTguNy02NC43LTEzYy0yMS40LTQuMy00Mi43LTguNjAxLTY0LjEwMS0xMi45Yy0yMC4zOTktNC4xLTQwLjgtOC4yLTYxLjE5OS0xMi4zDQoJCWMtMTguNy0zLjctMzcuMy03LjUtNTYtMTEuMmMtMTYuMi0zLjItMzIuNC02LjUtNDguNS05LjdjLTEyLjktMi42LTI1LjgtNS4xOTktMzguOC03LjhjLTguOS0xLjgtMTcuODAxLTMuNi0yNi43LTUuMzk5DQoJCWMtNC4xMDEtMC44MDEtOC4yLTEuNy0xMi4zLTIuNWMtMC4yLDAtMC40LTAuMTAxLTAuNjAxLTAuMTAxYzIuMiwxMC40LDEuMiwyMS41LTMuNiwzMS45Yy0xMC4xMDEsMjEuOC0zMy42MDEsMzMuMi01Ni4yLDI4LjgNCgkJYy02LjctMS4zLTE0LDEuMi0xNi45LDcuNGwtOSwxOS41Yy0yLjg5OSw2LjE5OSwwLDEzLjM5OSw1LjMwMSwxNy42OTljMSwwLjgwMSw3MjEuOCwzMzMuMTAxLDcyMi45OTksMzMzLjQNCgkJYzYuNywxLjMsMTQtMS4yLDE2LjktNy40bDktMTkuNWMyLjktNi4xOTksMC0xMy4zOTktNS4zLTE3LjY5OWMtMTgtMTQuMzAxLTI0LjYwMS0zOS42MDEtMTQuNS02MS40YzEwLjEtMjEuOCwzMy42LTMzLjIsNTYuMi0yOC44DQoJCWM2LjY5OSwxLjMsMTQtMS4yLDE2Ljg5OS03LjRsOS0xOS41YzIuOS02LjIsMC0xMy4zOTktNS4zLTE3LjdjLTE4LTE0LjMtMjQuNi0zOS42LTE0LjUtNjEuMzk5czMzLjYtMzMuMiw1Ni4yLTI4LjgNCgkJYzYuNywxLjMsMTQtMS4yLDE2LjktNy40bDktMTkuNWMyLjg5OS02LjIsMC0xMy40LTUuMzAxLTE3LjdjLTE4LTE0LjMtMjQuNi0zOS42LTE0LjUtNjEuNGMxMC4xMDEtMjEuOCwzMy42MDEtMzMuMTk5LDU2LjItMjguOA0KCQljNi43LDEuMywxNC0xLjIsMTYuOS03LjM5OWw5Ljg5OS0yMS42MDFjMi45LTYuMiwwLjItMTMuNS02LTE2LjM5OWwtMTA3LjY5OS00OS43TDg2OC41NjUsNDkyLjh6Ii8+DQoJPHBhdGggZD0iTTkuNjY1LDQ4NS45YzEuMiwwLjYsNzc5LjMsMTU2LjY5OSw3ODAuNiwxNTYuNjk5YzYuODAxLTAuMywxMy40LTQuNSwxNC43LTExLjFsNC4yLTIxYzEuMy02LjctMy4xLTEzLjEtOS4zLTE2DQoJCWMtMjAuOC05LjgtMzMuMTAxLTMyLjgtMjguNC01Ni40YzQuNy0yMy42LDI1LTQwLjEsNDgtNDEuMWM2LjgtMC4zLDEzLjQtNC41LDE0LjctMTEuMWwzLjEtMTUuNGwxLjEwMS01LjcNCgkJYzEuMy02LjctMy4xMDEtMTMuMS05LjMtMTZjLTIwLjgwMS05LjgtMzMuMTAxLTMyLjgtMjguNC01Ni4zOTljNC43LTIzLjYwMSwyNS00MC4xMDEsNDgtNDEuMTAxYzYuOC0wLjMsMTMuNC00LjUsMTQuNy0xMS4xDQoJCWw0LjItMjFjMS4zLTYuNy0zLjEwMS0xMy4xLTkuMzAxLTE2Yy0yMC44LTkuOC0zMy4xLTMyLjgtMjguMzk5LTU2LjRjNC43LTIzLjYsMjUtNDAuMSw0OC00MS4xYzYuOC0wLjMsMTMuMzk5LTQuNSwxNC43LTExLjENCgkJbDQuNjk5LTIzLjNjMS4zMDEtNi43LTMtMTMuMi05LjY5OS0xNC41YzAsMC03ODEuOS0xNTYuOC03ODIuNy0xNTYuOGMtNS44LDAtMTAuOSw0LjEtMTIuMSw5LjlsLTQuNywyMy4zDQoJCWMtMS4zLDYuNywzLjEsMTMuMSw5LjMsMTZjMjAuOCw5LjgsMzMuMSwzMi44LDI4LjQsNTYuNGMtNC43LDIzLjYtMjUsNDAuMS00OCw0MS4xYy02LjgwMSwwLjMtMTMuNCw0LjUtMTQuNywxMS4xbC00LjIsMjENCgkJYy0xLjMsNi43LDMuMSwxMy4xLDkuMywxNmMyMC44LDkuOCwzMy4xMDEsMzIuOCwyOC40LDU2LjRjLTQuNywyMy42LTI1LDQwLjEtNDgsNDEuMWMtNi44LDAuMy0xMy40LDQuNS0xNC43LDExLjFsLTQuMiwyMQ0KCQljLTEuMyw2LjcsMy4xMDEsMTMuMSw5LjMsMTZjMjAuODAxLDkuOCwzMy4xMDEsMzIuOCwyOC40LDU2LjRjLTQuNywyMy42MDEtMjUsNDAuMTAxLTQ4LDQxLjEwMWMtNi44LDAuMy0xMy40LDQuNS0xNC43LDExLjENCgkJbC00LjIsMjFDLTAuOTM1LDQ3Ni43LDMuNDY0LDQ4Myw5LjY2NSw0ODUuOXogTTY3Ni4xNjUsMjI5LjZjMi43LTEzLjUsMTUuOS0yMi4zLDI5LjQtMTkuNnMyMi4zLDE1LjksMTkuNiwyOS40bC0zMywxNjQuMg0KCQlsLTIwLjMsMTAxLjJjLTIuNCwxMS45LTEyLjgsMjAuMTAxLTI0LjUsMjAuMTAxYy0xLjYwMSwwLTMuMy0wLjItNC45LTAuNWMtMTMuNS0yLjctMjIuMy0xNS45LTE5LjYtMjkuNGwyMi43LTExMi45TDY3Ni4xNjUsMjI5LjYNCgkJeiBNMjI1LjM2NSwxMzkuMWMyLjctMTMuNSwxNS45LTIyLjMsMjkuNC0xOS42czIyLjMsMTUuOSwxOS42LDI5LjRsLTExLjQsNTYuN2wtMTIuODk5LDY0LjNsLTEwLjQsNTEuOGwtMTguNSw5Mi42DQoJCWMtMi4zOTksMTEuOS0xMi44LDIwLjEwMS0yNC41LDIwLjEwMWMtMS42LDAtMy4zLTAuMi00Ljg5OS0wLjVjLTAuNy0wLjEwMS0xLjQtMC4zMDEtMi0wLjVjLTEyLjQtMy42MDEtMjAuMTAxLTE2LjEwMS0xNy41LTI4LjkNCgkJbDMuNjk5LTE4LjdsOS43LTQ4LjRMMjI1LjM2NSwxMzkuMXoiLz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjwvc3ZnPg0K'
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

        add_action('wp_ajax_nopriv_ajax_pagination', array($this, 'ajaxPagination'));
        add_action('wp_ajax_ajax_pagination', array($this, 'ajaxPagination'));
    }

    /**
     * Get events on pagination click
     */
    public function ajaxPagination()
    {
        $page = $_POST['page'];
        $module_id = $_POST['id'];
        $events = self::displayEvents($module_id, $page);

        echo $events;
        wp_die();
    }

    public static function countPages($module_id)
    {
        $fields = json_decode(json_encode(get_fields($module_id)));
        if ($fields->mod_event_limit == 0) {
            return $fields->mod_event_limit;
        }
        $max_per_page = $fields->mod_event_limit;
        $events = self::getEvents($module_id, 1, false);
        $total_posts = count($events);  //Total number of posts returned
        $pages = ceil($total_posts / $max_per_page);

        return $pages;
    }

    /**
     * Get included Events
     * @param  int    $module_id Module ID
     * @param  int    $page      Pagination page number
     * @param  bool   $useLimit  True = limit by setting, false = get all
     * @return array             Array with event objects
     */
    public static function getEvents($module_id, $page = 1, $useLimit = true)
    {
        $fields = json_decode(json_encode(get_fields($module_id)));
        $display_limit = ($useLimit == true) ? $fields->mod_event_limit : -1;
        $days_ahead = $fields->mod_event_interval;

        // Set start and end date
        $start_date = date('Y-m-d H:i:s', strtotime("today midnight"));
        $end_date = date('Y-m-d H:i:s', strtotime("tomorrow midnight +$days_ahead days") - 1);

        // Save categories, groups and tags IDs to array
        $taxonomies = array();
        if ($fields->mod_event_categories_show == false && ! empty($fields->mod_event_categories_list)) {
            foreach ($fields->mod_event_categories_list as $v) {
                $taxonomies[] = $v;
            }
        }
        if ($fields->mod_event_groups_show == false && ! empty($fields->mod_event_groups_list)) {
            foreach ($fields->mod_event_groups_list as $v) {
                $taxonomies[] = $v;
            }
        }
        if ($fields->mod_event_tags_show == false && ! empty($fields->mod_event_tags_list)) {
            foreach ($fields->mod_event_tags_list as $v) {
                $taxonomies[] = $v;
            }
        }

        $taxonomies = (! empty($taxonomies)) ? $taxonomies : null;
        $params = array('start_date'    => $start_date,
                        'end_date'      => $end_date,
                        'display_limit' => $display_limit,
                        'taxonomies'    => $taxonomies,
                        'location'      => $fields->mod_event_geographic,
                        'distance'      => $fields->mod_event_distance
                        );

        $events = \EventManagerIntegration\Helper\QueryEvents::getEventsByInterval($params, $page);

        return $events;
    }

    /**
     * Converts array of events into string with markup
     * @param  int    $module_id Module ID
     * @param  int    $page      Pagination page number
     * @return string            String with events and markup
     */
    public static function displayEvents($module_id, $page = 1)
    {
        $fields = json_decode(json_encode(get_fields($module_id)));
        $events = self::getEvents($module_id, $page);
        $descr_limit = (! empty($fields->mod_event_descr_limit)) ? $fields->mod_event_descr_limit : null;
        $fields->mod_event_fields = is_array($fields->mod_event_fields) ? $fields->mod_event_fields : array();
        $grid_size = in_array('image', $fields->mod_event_fields) ? 'class="grid-md-9"' : 'class="grid-md-12"';

        $ret = '<ul class="event-module-list">';
        if (! $events) {
            $ret .= '<li>' . __('No events found', 'event-integration') . '</li>';
        } else {
            foreach ($events as $event) {
                $ret .= '<li>';

                if (! empty($event->start_date) && in_array('occasion', $fields->mod_event_fields) && $fields->mod_event_occ_pos == 'left') {
                    $occasion = \EventManagerIntegration\App::formatShortDate($event->start_date);
                    $ret .= '<div class="event-date">';
                    if ($occasion['today'] == true) {
                        $ret .= '<span><strong>' . __('Today', 'event-integration') . '</strong></span>';
                        $ret .= '<span>' . $occasion['time'] . '</span>';
                    } else {
                        $ret .= '<span>' . $occasion['date'] . '</span>';
                        $ret .= '<span>' . $occasion['month'] . '</span>';
                    }
                    $ret .= '</div>';
                }

                $ret .= '<div class="event-content">';
                $ret .= '<div class="grid">';
                if (in_array('image', $fields->mod_event_fields)) {
                    $ret .= '<div class="grid-md-3">';
                    if (get_the_post_thumbnail($event->ID)) {
                        $ret .= get_the_post_thumbnail($event->ID, 'large', array('class' => 'image-responsive'));
                    } elseif ($fields->mod_event_def_image) {
                        $ret .= wp_get_attachment_image($fields->mod_event_def_image->ID, array('700', '500'), "", array( "class" => "image-responsive" ));
                    }
                    $ret .= '</div>';
                }

                $ret .= '<div ' . $grid_size . '>';

                if (! empty($event->post_title)) {
                    $date_url = preg_replace('/\D/', '', $event->start_date);
                    $ret .= '<a href="' . esc_url(add_query_arg('date', $date_url, get_page_link($event->ID))) .'" class="link-item">' . $event->post_title . '</a>';
                }
                if (! empty($event->start_date) && ! empty($event->end_date) && in_array('occasion', $fields->mod_event_fields) && $fields->mod_event_occ_pos == 'below') {
                    $occasion = \EventManagerIntegration\App::formatEventDate($event->start_date, $event->end_date);
                    $ret .= '<p class="date text-sm text-dark-gray">' . $occasion . '</p>';
                }
                if (in_array('location', $fields->mod_event_fields) && get_post_meta($event->ID, 'location', true)) {
                    $location = get_post_meta($event->ID, 'location', true);
                    $ret .= '<p>' . $location['title'] . '</p>';
                }

                if (in_array('description', $fields->mod_event_fields) && $event->content_mode == 'custom' && ! empty($event->content)) {
                    $ret .= '<p>' . \EventManagerIntegration\Helper\QueryEvents::stringLimiter($event->content, $descr_limit) . '</p>';
                } elseif (! empty($event->post_content) && in_array('description', $fields->mod_event_fields)) {
                    $ret .= '<p>' . \EventManagerIntegration\Helper\QueryEvents::stringLimiter($event->post_content, $descr_limit) . '</p>';
                }
                $ret .= '</div>';
                $ret .= '</div>';
                $ret .= '</div>';
                $ret .= '</li>';
            }
        }
        $ret .= '</ul>';

        return $ret;
    }
}
