<?php

namespace EventManagerIntegration\Module;

class Event extends \Modularity\Module
{
    public $slug = 'event';
    public $supports = array();

    public function init()
    {
        $this->nameSingular = __('Event', 'event-integration');
        $this->namePlural = __('Events', 'event-integration');
        $this->description = __('Outputs a list if upcoming events', 'event-integration');

        add_action('wp_ajax_nopriv_ajax_pagination', array($this, 'ajaxPagination'));
        add_action('wp_ajax_ajax_pagination', array($this, 'ajaxPagination'));
    }

    public function data() : array
    {
        $fields = get_fields($this->ID);

        $data['pagesCount'] = $this->countPages($this->ID);
        $data['showArrows'] = (isset($fields->mod_event_nav_arrows) && $fields->mod_event_nav_arrows == true) ? true : false;

        $data['classes'] = implode(' ', apply_filters('Modularity/Module/Classes', array('box', 'box-panel'), $this->post_type, $this->args));
        return $data;
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

    public function countPages($module_id)
    {
        $fields = json_decode(json_encode(get_fields($module_id)));

        if (isset($fields->mod_event_limit) && $fields->mod_event_limit == 0) {
            return $fields->mod_event_limit;
        }

        $max_per_page = (isset($fields->mod_event_limit)) ? $fields->mod_event_limit : 10;
        $events = self::getEvents($module_id, 1, false);
        $total_posts = count($events);  //Total number of posts returned
        $pages = ceil($total_posts / $max_per_page);

        if (isset($fields->mod_event_pagination_limit) && $fields->mod_event_pagination_limit >= 0 && $fields->mod_event_pagination_limit <= $pages) {
            $pages = $fields->mod_event_pagination_limit;
        }

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
        $display_limit = ($useLimit == true && isset($fields->mod_event_limit)) ? $fields->mod_event_limit : -1;
        $days_ahead = isset($fields->mod_event_interval) ? $fields->mod_event_interval: 0;

        // Set start and end date
        $start_date = date('Y-m-d H:i:s', strtotime("today midnight"));
        $end_date = date('Y-m-d H:i:s', strtotime("tomorrow midnight +$days_ahead days") - 1);

        // Save categories, groups and tags IDs to array
        $taxonomies = array();
        if (isset($fields->mod_event_categories_show) && $fields->mod_event_categories_show == false && isset($fields->mod_event_categories_list) && ! empty($fields->mod_event_categories_list)) {
            foreach ($fields->mod_event_categories_list as $v) {
                $taxonomies[] = $v;
            }
        }
        if (isset($fields->mod_event_groups_show) && $fields->mod_event_groups_show == false && isset($fields->mod_event_groups_list) && ! empty($fields->mod_event_groups_list)) {
            foreach ($fields->mod_event_groups_list as $v) {
                $taxonomies[] = $v;
            }
        }
        if (isset($fields->mod_event_tags_show) && $fields->mod_event_tags_show == false && isset($fields->mod_event_tags_list) && ! empty($fields->mod_event_tags_list)) {
            foreach ($fields->mod_event_tags_list as $v) {
                $taxonomies[] = $v;
            }
        }

        $taxonomies = (! empty($taxonomies)) ? $taxonomies : null;
        $params = array('start_date'    => $start_date,
                        'end_date'      => $end_date,
                        'display_limit' => $display_limit,
                        'taxonomies'    => $taxonomies,
                        'location'      => (isset($fields->mod_event_geographic)) ? $fields->mod_event_geographic : null,
                        'distance'      => (isset($fields->mod_event_distance)) ? $fields->mod_event_distance : null,
                        );

        $events = \EventManagerIntegration\Helper\QueryEvents::getEventsByInterval($params, $page);

        return $events;
    }

    // Rewrite
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

        if (get_option('timezone_string')) {
            date_default_timezone_set(get_option('timezone_string'));
        }
        $date_now = strtotime('now');

        $ret = '<ul class="event-module-list">';
        if (! $events) {
            $ret .= '<li><span class="event-info">' . __('No events found', 'event-integration') . '</span></li>';
        } else {
            foreach ($events as $event) {
                $ret .= (isset($event->end_date) && (strtotime($event->end_date) < $date_now)) ? '<li class="passed-event">' : '<li>';

                if (! empty($event->start_date) && in_array('occasion', $fields->mod_event_fields) && $fields->mod_event_occ_pos == 'left') {
                    $occasion = \EventManagerIntegration\App::formatShortDate($event->start_date);
                    $ret .= '<span class="event-date">';
                    if ($occasion['today'] == true) {
                        $ret .= '<span><strong>' . __('Today', 'event-integration') . '</strong></span>';
                        $ret .= '<span>' . $occasion['time'] . '</span>';
                    } else {
                        $ret .= '<span>' . $occasion['date'] . '</span>';
                        $ret .= '<span>' . $occasion['month'] . '</span>';
                    }
                    $ret .= '</span>';
                }

                $ret .= '<span class="event-info">';

                if (in_array('image', $fields->mod_event_fields)) {
                    if (get_the_post_thumbnail($event->ID)) {
                        $ret .= get_the_post_thumbnail($event->ID, 'large', array('class' => 'image-responsive'));
                    } elseif ($fields->mod_event_def_image) {
                        $ret .= wp_get_attachment_image($fields->mod_event_def_image->ID, array('700', '500'), "", array( "class" => "image-responsive" ));
                    }
                }

                if (! empty($event->post_title)) {
                    $date_url = preg_replace('/\D/', '', $event->start_date);
                    $ret .= '<a href="' . esc_url(add_query_arg('date', $date_url, get_permalink($event->ID))) .'" class="title"><span class="link-item title">' . $event->post_title . '</span></a>';
                }
                if (! empty($event->start_date) && ! empty($event->end_date) && in_array('occasion', $fields->mod_event_fields) && $fields->mod_event_occ_pos == 'below') {
                    $occasion = \EventManagerIntegration\App::formatEventDate($event->start_date, $event->end_date);
                    $ret .= '<p class="text-sm"><i class="pricon pricon-calendar"></i> <strong>' . __('Date', 'event-integration') . ':</strong> ' . $occasion . '</p>';
                }
                if (in_array('location', $fields->mod_event_fields) && get_post_meta($event->ID, 'location', true)) {
                    $location = get_post_meta($event->ID, 'location', true);
                    $ret .= '<p class="text-sm"><i class="pricon pricon-location-pin"></i> <strong>' . __('Location', 'event-integration') . ':</strong> ' . $location['title'] . '</p>';
                }

                if (in_array('description', $fields->mod_event_fields) && $event->content_mode == 'custom' && ! empty($event->content)) {
                    $ret .= \EventManagerIntegration\Helper\QueryEvents::stringLimiter($event->content, $descr_limit);
                } elseif (! empty($event->post_content) && in_array('description', $fields->mod_event_fields)) {
                    $ret .= \EventManagerIntegration\Helper\QueryEvents::stringLimiter($event->post_content, $descr_limit);
                }

                $ret .= '</span>';
                $ret .= '</li>';
            }
        }
        $ret .= '</ul>';

        return $ret;
    }

    /**
     * Available "magic" methods for modules:
     * init()            What to do on initialization (if you must, use __construct with care, this will probably break stuff!!)
     * data()            Use to send data to view (return array)
     * style()           Enqueue style only when module is used on page
     * script            Enqueue script only when module is used on page
     * adminEnqueue()    Enqueue scripts for the module edit/add page in admin
     * template()        Return the view template (blade) the module should use when displayed
     */
}
